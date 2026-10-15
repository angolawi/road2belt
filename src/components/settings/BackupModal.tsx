import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  Check,
  ExternalLink,
  Copy,
  LogOut,
  AlertCircle,
  KeyRound,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';
import {
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck,
  UserProfile
} from '../../types';
import { GistSyncConfig, SyncStatus } from '../../services/gistSync';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
  onImportAll: (data: {
    user: UserProfile;
    bjjSessions: BJJSession[];
    conditioningSessions: ConditioningSession[];
    nutritionLogs: DailyNutrition[];
    readinessLogs: ReadinessCheck[];
  }) => void;
  onResetData: () => void;
  syncConfig: GistSyncConfig;
  isSyncConfigured: boolean;
  syncStatus: SyncStatus;
  syncError: string | null;
  onConnectToken: (token: string, customGistId?: string) => Promise<boolean>;
  onSyncNow: () => Promise<void>;
  onForcePull: () => Promise<void>;
  onForcePush: () => Promise<void>;
  onDisconnectSync: () => void;
  getPairingUrl: () => string;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  user,
  bjjSessions,
  conditioningSessions,
  nutritionLogs,
  readinessLogs,
  onImportAll,
  onResetData,
  syncConfig,
  isSyncConfigured,
  syncStatus,
  syncError,
  onConnectToken,
  onSyncNow,
  onForcePull,
  onForcePush,
  onDisconnectSync,
  getPairingUrl
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [customGistIdInput, setCustomGistIdInput] = useState('');
  const [showAdvancedGistId, setShowAdvancedGistId] = useState(false);
  const [copiedPairingLink, setCopiedPairingLink] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const ok = await onConnectToken(tokenInput, customGistIdInput || undefined);
    if (ok) {
      setTokenInput('');
      setCustomGistIdInput('');
    }
  };

  const handleCopyPairingLink = async () => {
    const url = getPairingUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPairingLink(true);
      setTimeout(() => setCopiedPairingLink(false), 3000);
    } catch {
      prompt('Copie o link abaixo para abrir no celular ou tablet:', url);
    }
  };

  const formatLastSynced = (iso: string | null) => {
    if (!iso) return 'Nunca';
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const handleExport = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      bjjSessions,
      conditioningSessions,
      nutritionLogs,
      readinessLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bjj-purple-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.user && Array.isArray(parsed.bjjSessions)) {
          onImportAll({
            user: parsed.user,
            bjjSessions: parsed.bjjSessions || [],
            conditioningSessions: parsed.conditioningSessions || [],
            nutritionLogs: parsed.nutritionLogs || [],
            readinessLogs: parsed.readinessLogs || []
          });
          alert('Backup restaurado com sucesso!');
          onClose();
        } else {
          alert('Formato de backup inválido.');
        }
      } catch {
        alert('Erro ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-tatame-card border border-tatame-border rounded-t-3xl sm:rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-tatame-border">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sincronização & Dados</h3>
              <p className="text-xs text-tatame-muted">
                Compartilhe seus dados entre Celular, Tablet e Web
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GitHub Gist Cloud Sync Section */}
        <div className="bg-gradient-to-br from-purple-950/50 via-tatame-bg to-tatame-bg rounded-2xl p-4 border border-purple-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Sincronização na Nuvem (GitHub Gist)
              </h4>
            </div>
            {isSyncConfigured && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                    : syncStatus === 'syncing'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                    : syncStatus === 'error'
                    ? 'bg-red-950/80 text-red-300 border-red-700/60'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                }`}
              >
                {syncStatus === 'synced'
                  ? '● Sincronizado'
                  : syncStatus === 'syncing'
                  ? '↻ Sincronizando...'
                  : syncStatus === 'error'
                  ? '✕ Erro'
                  : '○ Offline'}
              </span>
            )}
          </div>

          {syncError && (
            <div className="bg-red-950/60 border border-red-700/70 rounded-xl p-2.5 flex items-start gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{syncError}</span>
            </div>
          )}

          {!isSyncConfigured ? (
            <form onSubmit={handleConnect} className="space-y-3">
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Conecte seu token do GitHub uma única vez em cada aparelho. O app localizará (ou criará) automaticamente seu arquivo secreto{' '}
                <code className="text-purple-300 font-mono">road2belt-sync.json</code> e manterá celular, tablet e PC sincronizados.
              </p>

              <a
                href="https://github.com/settings/tokens/new?description=Road2Belt+Sync&scopes=gist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 hover:text-purple-200 underline"
              >
                <KeyRound className="w-3.5 h-3.5" />
                1. Gerar Token no GitHub (escopo &quot;gist&quot; pré-selecionado)
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-gray-300">
                  2. Cole seu Personal Access Token (ghp_...):
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-tatame-card border border-tatame-border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedGistId((v) => !v)}
                  className="text-[11px] text-gray-400 hover:text-gray-200 underline"
                >
                  {showAdvancedGistId
                    ? 'Ocultar ID do Gist manual'
                    : 'Já tem um Gist ID específico? (Opcional — descoberta é automática)'}
                </button>
                {showAdvancedGistId && (
                  <input
                    type="text"
                    value={customGistIdInput}
                    onChange={(e) => setCustomGistIdInput(e.target.value)}
                    placeholder="ID do Gist (opcional)"
                    className="mt-1.5 w-full bg-tatame-card border border-tatame-border rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={syncStatus === 'syncing' || !tokenInput.trim()}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Conectando ao GitHub...
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5" />
                    Conectar e Sincronizar
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="bg-tatame-card/90 rounded-xl p-3 border border-tatame-border/80 flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <div className="text-gray-400">
                    Última sincronização:{' '}
                    <span className="text-white font-semibold">
                      {formatLastSynced(syncConfig.lastSyncedAt)}
                    </span>
                  </div>
                  <div className="text-gray-500 font-mono text-[10px]">
                    Gist ID: {syncConfig.gistId?.slice(0, 12)}...
                  </div>
                </div>
                <button
                  onClick={onSyncNow}
                  disabled={syncStatus === 'syncing'}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                  />
                  Sincronizar
                </button>
              </div>

              {/* 1-Click Pairing Link for Smartphone / Tablet */}
              <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-purple-200">
                    Conectar Celular ou Tablet em 1 Clique
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Copie o link de pareamento e abra no outro aparelho para configurar automaticamente.
                  </p>
                </div>
                <button
                  onClick={handleCopyPairingLink}
                  className="shrink-0 px-3 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-100 border border-purple-600/50 text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {copiedPairingLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Link
                    </>
                  )}
                </button>
              </div>

              {/* Manual Pull / Push / Disconnect controls */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={onForcePull}
                  disabled={syncStatus === 'syncing'}
                  className="py-2 px-2 bg-tatame-card hover:bg-gray-800 border border-tatame-border rounded-xl text-[11px] font-semibold text-gray-200 flex items-center justify-center gap-1"
                  title="Substituir dados deste aparelho pelos dados da nuvem"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-blue-400" />
                  Baixar Nuvem
                </button>
                <button
                  onClick={onForcePush}
                  disabled={syncStatus === 'syncing'}
                  className="py-2 px-2 bg-tatame-card hover:bg-gray-800 border border-tatame-border rounded-xl text-[11px] font-semibold text-gray-200 flex items-center justify-center gap-1"
                  title="Forçar envio dos dados deste aparelho para a nuvem"
                >
                  <ArrowUpFromLine className="w-3.5 h-3.5 text-purple-400" />
                  Enviar Nuvem
                </button>
                <button
                  onClick={() => {
                    if (confirm('Desconectar a sincronização automática neste aparelho?')) {
                      onDisconnectSync();
                    }
                  }}
                  className="py-2 px-2 bg-red-950/40 hover:bg-red-950/80 border border-red-800/50 rounded-xl text-[11px] font-semibold text-red-300 flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Desconectar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2.5 pt-1">
          <h4 className="text-[11px] font-bold text-tatame-muted uppercase tracking-wider px-1">
            Backup Manual em Arquivo (Offline)
          </h4>

          {/* Export JSON */}
          <div className="bg-tatame-bg/90 rounded-2xl p-3.5 border border-tatame-border/70 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-purple-400" />
                Exportar Backup JSON
              </h4>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Gera um arquivo com todos os seus treinos, rolas e refeições.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow"
            >
              Baixar JSON
            </button>
          </div>

          {/* Import JSON */}
          <div className="bg-tatame-bg/90 rounded-2xl p-3.5 border border-tatame-border/70 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-400" />
                Restaurar Backup
              </h4>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Substitui os dados atuais pelo arquivo JSON enviado.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow"
            >
              Importar
            </button>
          </div>

          {/* Reset Dados */}
          <div className="bg-tatame-bg/90 rounded-2xl p-3.5 border border-tatame-border/70 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-red-400" />
                Restaurar Dados Iniciais
              </h4>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Recarrega as fichas e treinos de demonstração originais.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Deseja recarregar os dados iniciais padrão?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3.5 py-2 bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-700 text-xs font-bold rounded-xl"
            >
              Resetar
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-tatame-bg border border-tatame-border text-gray-300 text-xs font-semibold rounded-xl"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
