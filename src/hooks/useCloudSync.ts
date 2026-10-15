import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck,
  UserProfile
} from '../types';
import {
  CloudBackupPayload,
  findOrCreateSyncGist,
  GistSyncConfig,
  pullFromGist,
  pushToGist,
  SYNC_CONFIG_STORAGE_KEY,
  SyncStatus
} from '../services/gistSync';

interface UseCloudSyncOptions {
  user: UserProfile;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
  localUpdatedAt: string | null;
  onApplyRemoteData: (payload: CloudBackupPayload) => void;
}

const DEFAULT_CONFIG: GistSyncConfig = {
  token: '',
  gistId: null,
  autoSync: true,
  lastSyncedAt: null
};

export function useCloudSync({
  user,
  bjjSessions,
  conditioningSessions,
  nutritionLogs,
  readinessLogs,
  localUpdatedAt,
  onApplyRemoteData
}: UseCloudSyncOptions) {
  const [config, setConfig] = useState<GistSyncConfig>(() => {
    try {
      const raw = window.localStorage.getItem(SYNC_CONFIG_STORAGE_KEY);
      return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const isConfigured = Boolean(config.token && config.gistId);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    config.token && config.gistId ? 'idle' : 'unconfigured'
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const lastKnownRemoteUpdatedAtRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Keep latest data in a ref so async callbacks always read fresh state
  const latestDataRef = useRef({
    user,
    bjjSessions,
    conditioningSessions,
    nutritionLogs,
    readinessLogs,
    localUpdatedAt
  });

  useEffect(() => {
    latestDataRef.current = {
      user,
      bjjSessions,
      conditioningSessions,
      nutritionLogs,
      readinessLogs,
      localUpdatedAt
    };
  }, [user, bjjSessions, conditioningSessions, nutritionLogs, readinessLogs, localUpdatedAt]);

  const saveConfig = useCallback((next: GistSyncConfig) => {
    setConfig(next);
    try {
      window.localStorage.setItem(SYNC_CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Erro ao salvar configuração de sync:', e);
    }
  }, []);

  const buildCurrentPayload = useCallback((overrideUpdatedAt?: string): CloudBackupPayload => {
    const current = latestDataRef.current;
    return {
      version: '1.0.0',
      updatedAt: overrideUpdatedAt || current.localUpdatedAt || new Date().toISOString(),
      user: current.user,
      bjjSessions: current.bjjSessions,
      conditioningSessions: current.conditioningSessions,
      nutritionLogs: current.nutritionLogs,
      readinessLogs: current.readinessLogs
    };
  }, []);

  // Connect using Token (and optional Gist ID)
  const connectWithToken = useCallback(
    async (rawToken: string, customGistId?: string): Promise<boolean> => {
      const token = rawToken.trim();
      if (!token) {
        setSyncError('Informe um Personal Access Token válido.');
        return false;
      }

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const localTime = latestDataRef.current.localUpdatedAt
          ? new Date(latestDataRef.current.localUpdatedAt).getTime()
          : 0;

        let targetGistId = customGistId?.trim() || null;
        let remotePayload: CloudBackupPayload | null = null;
        let wasCreated = false;

        if (targetGistId) {
          remotePayload = await pullFromGist(token, targetGistId);
        } else {
          const initialPayload = buildCurrentPayload(
            latestDataRef.current.localUpdatedAt || new Date().toISOString()
          );
          const result = await findOrCreateSyncGist(token, initialPayload);
          targetGistId = result.gistId;
          remotePayload = result.remotePayload;
          wasCreated = result.created;
        }

        if (!wasCreated && remotePayload) {
          const remoteTime = new Date(remotePayload.updatedAt).getTime() || 0;
          // If this is a fresh device (localTime === 0) or remote is newer/equal, apply remote data
          if (localTime === 0 || remoteTime >= localTime) {
            lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
            onApplyRemoteData(remotePayload);
          } else {
            // Local has newer edits than remote; push local to Gist
            const payloadToPush = buildCurrentPayload();
            await pushToGist(token, targetGistId, payloadToPush);
            lastKnownRemoteUpdatedAtRef.current = payloadToPush.updatedAt;
          }
        } else if (wasCreated && remotePayload) {
          lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
        }

        const nowIso = new Date().toISOString();
        saveConfig({
          token,
          gistId: targetGistId,
          autoSync: true,
          lastSyncedAt: nowIso
        });
        setSyncStatus('synced');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido ao sincronizar.';
        setSyncError(message);
        setSyncStatus('error');
        return false;
      } finally {
        isSyncingRef.current = false;
      }
    },
    [buildCurrentPayload, onApplyRemoteData, saveConfig]
  );

  // Smart Sync (Pull if remote is newer, Push if local is newer)
  const syncNow = useCallback(async () => {
    if (!config.token || !config.gistId || isSyncingRef.current) return;
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }

    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const remotePayload = await pullFromGist(config.token, config.gistId);
      const remoteTime = new Date(remotePayload.updatedAt).getTime() || 0;
      const localTime = latestDataRef.current.localUpdatedAt
        ? new Date(latestDataRef.current.localUpdatedAt).getTime()
        : 0;

      if (localTime === 0 || remoteTime > localTime) {
        lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
        onApplyRemoteData(remotePayload);
      } else if (localTime > remoteTime) {
        const payloadToPush = buildCurrentPayload();
        await pushToGist(config.token, config.gistId, payloadToPush);
        lastKnownRemoteUpdatedAtRef.current = payloadToPush.updatedAt;
      } else {
        lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
      }

      saveConfig({
        ...config,
        lastSyncedAt: new Date().toISOString()
      });
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro na sincronização.';
      setSyncError(message);
      setSyncStatus(navigator.onLine ? 'error' : 'offline');
    } finally {
      isSyncingRef.current = false;
    }
  }, [buildCurrentPayload, config, onApplyRemoteData, saveConfig]);

  // Force Pull from Cloud
  const forcePull = useCallback(async () => {
    if (!config.token || !config.gistId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const remotePayload = await pullFromGist(config.token, config.gistId);
      lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
      onApplyRemoteData(remotePayload);
      saveConfig({
        ...config,
        lastSyncedAt: new Date().toISOString()
      });
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao baixar da nuvem.';
      setSyncError(message);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [config, onApplyRemoteData, saveConfig]);

  // Force Push to Cloud
  const forcePush = useCallback(async () => {
    if (!config.token || !config.gistId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const nowIso = new Date().toISOString();
      const payload = buildCurrentPayload(nowIso);
      await pushToGist(config.token, config.gistId, payload);
      lastKnownRemoteUpdatedAtRef.current = nowIso;
      onApplyRemoteData(payload);
      saveConfig({
        ...config,
        lastSyncedAt: nowIso
      });
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar para a nuvem.';
      setSyncError(message);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [buildCurrentPayload, config, onApplyRemoteData, saveConfig]);

  const disconnect = useCallback(() => {
    try {
      window.localStorage.removeItem(SYNC_CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfig(DEFAULT_CONFIG);
    setSyncStatus('unconfigured');
    setSyncError(null);
  }, []);

  // 1. Check URL Hash for 1-click device pairing (#gist_token=...&gist_id=...)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('gist_token=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const urlToken = params.get('gist_token');
      const urlGistId = params.get('gist_id') || undefined;

      // Immediately strip token from URL bar for security
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );

      if (urlToken) {
        connectWithToken(urlToken, urlGistId);
      }
    }
  }, [connectWithToken]);

  // 2. Auto-sync on initial mount, tab visibility change, and network recovery
  useEffect(() => {
    if (!isConfigured || !config.autoSync) return;

    syncNow();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncNow();
      }
    };

    const handleOnline = () => {
      syncNow();
    };

    const handleOffline = () => {
      setSyncStatus('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConfigured, config.autoSync, syncNow]);

  // 3. Debounced Auto-Push when localUpdatedAt changes from a user edit
  useEffect(() => {
    if (!isConfigured || !config.autoSync || !localUpdatedAt) return;
    if (localUpdatedAt === lastKnownRemoteUpdatedAtRef.current) return;

    const timer = window.setTimeout(async () => {
      if (!config.token || !config.gistId || isSyncingRef.current) return;
      if (!navigator.onLine) {
        setSyncStatus('offline');
        return;
      }

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const payload = buildCurrentPayload(localUpdatedAt);
        await pushToGist(config.token, config.gistId, payload);
        lastKnownRemoteUpdatedAtRef.current = localUpdatedAt;
        saveConfig({
          ...config,
          lastSyncedAt: new Date().toISOString()
        });
        setSyncStatus('synced');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar na nuvem.';
        setSyncError(message);
        setSyncStatus(navigator.onLine ? 'error' : 'offline');
      } finally {
        isSyncingRef.current = false;
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [localUpdatedAt, isConfigured, config, buildCurrentPayload, saveConfig]);

  const getPairingUrl = useCallback(() => {
    if (!config.token) return '';
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('gist_token', config.token);
    if (config.gistId) {
      params.set('gist_id', config.gistId);
    }
    return `${baseUrl}#${params.toString()}`;
  }, [config.token, config.gistId]);

  return {
    config,
    isConfigured,
    syncStatus,
    syncError,
    connectWithToken,
    syncNow,
    forcePull,
    forcePush,
    disconnect,
    getPairingUrl
  };
}
