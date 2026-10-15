import {
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck,
  UserProfile
} from '../types';

export const GIST_FILENAME = 'road2belt-sync.json';
export const SYNC_CONFIG_STORAGE_KEY = 'bjj_gist_sync_config';
export const LAST_UPDATED_STORAGE_KEY = 'bjj_last_updated_at';

export type SyncStatus =
  | 'unconfigured'
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'error'
  | 'offline';

export interface GistSyncConfig {
  token: string;
  gistId: string | null;
  autoSync: boolean;
  lastSyncedAt: string | null;
}

export interface CloudBackupPayload {
  version: string;
  updatedAt: string;
  user: UserProfile;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
}

function getHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token.trim()}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

export function isValidPayload(data: unknown): data is CloudBackupPayload {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return Boolean(obj.user && typeof obj.user === 'object' && Array.isArray(obj.bjjSessions));
}

export async function pullFromGist(
  token: string,
  gistId: string
): Promise<CloudBackupPayload> {
  const response = await fetch(`https://api.github.com/gists/${gistId}?t=${Date.now()}`, {
    method: 'GET',
    headers: getHeaders(token),
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token do GitHub inválido ou expirado.');
    }
    if (response.status === 404) {
      throw new Error('Gist não encontrado. Verifique o ID ou reconecte.');
    }
    throw new Error(`Erro ao baixar dados da nuvem (${response.status}).`);
  }

  const gist = await response.json();
  const file = gist.files?.[GIST_FILENAME];

  if (!file) {
    throw new Error(`Arquivo ${GIST_FILENAME} não encontrado no Gist.`);
  }

  let rawContent: string = file.content;
  if (file.truncated && file.raw_url) {
    const rawResp = await fetch(file.raw_url, { cache: 'no-store' });
    rawContent = await rawResp.text();
  }

  const parsed = JSON.parse(rawContent);
  if (!isValidPayload(parsed)) {
    throw new Error('Conteúdo do Gist possui formato inválido.');
  }

  return {
    version: parsed.version || '1.0.0',
    updatedAt: parsed.updatedAt || gist.updated_at || new Date(0).toISOString(),
    user: parsed.user,
    bjjSessions: parsed.bjjSessions || [],
    conditioningSessions: parsed.conditioningSessions || [],
    nutritionLogs: parsed.nutritionLogs || [],
    readinessLogs: parsed.readinessLogs || []
  };
}

export async function pushToGist(
  token: string,
  gistId: string,
  payload: CloudBackupPayload
): Promise<void> {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'ROAD2BELT BJJ Tracker - Cloud Sync Data',
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(payload, null, 2)
        }
      }
    })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token do GitHub inválido ou sem permissão de Gist.');
    }
    throw new Error(`Erro ao salvar dados na nuvem (${response.status}).`);
  }
}

export async function findOrCreateSyncGist(
  token: string,
  initialPayload: CloudBackupPayload
): Promise<{
  gistId: string;
  remotePayload: CloudBackupPayload;
  created: boolean;
}> {
  const listResp = await fetch('https://api.github.com/gists?per_page=100', {
    method: 'GET',
    headers: getHeaders(token),
    cache: 'no-store'
  });

  if (!listResp.ok) {
    if (listResp.status === 401) {
      throw new Error('Token inválido. Certifique-se de gerar um token com escopo "gist".');
    }
    throw new Error(`Falha ao consultar Gists no GitHub (${listResp.status}).`);
  }

  const gists: Array<{ id: string; files?: Record<string, unknown> }> = await listResp.json();
  const existing = gists.find((g) => g.files && Boolean(g.files[GIST_FILENAME]));

  if (existing) {
    const remotePayload = await pullFromGist(token, existing.id);
    return {
      gistId: existing.id,
      remotePayload,
      created: false
    };
  }

  // Create a new secret Gist if none exists yet
  const createResp = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      ...getHeaders(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'ROAD2BELT BJJ Tracker - Cloud Sync Data',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(initialPayload, null, 2)
        }
      }
    })
  });

  if (!createResp.ok) {
    throw new Error(`Não foi possível criar o Gist secreto (${createResp.status}). Verifique a permissão "gist" do seu token.`);
  }

  const createdGist = await createResp.json();
  return {
    gistId: createdGist.id,
    remotePayload: initialPayload,
    created: true
  };
}
