import React, { useRef } from 'react';
import { X, Download, Upload, RefreshCw, FileText, Check } from 'lucide-react';
import { BJJSession, ConditioningSession, DailyNutrition, ReadinessCheck, UserProfile } from '../../types';

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
  onResetData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      } catch (err) {
        alert('Erro ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-tatame-card border border-tatame-border rounded-t-3xl sm:rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-tatame-border">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gerenciamento de Dados</h3>
              <p className="text-xs text-tatame-muted">Backup, Exportação e Importação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Export JSON */}
          <div className="bg-tatame-bg/90 rounded-2xl p-4 border border-tatame-border/70 flex items-center justify-between">
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
          <div className="bg-tatame-bg/90 rounded-2xl p-4 border border-tatame-border/70 flex items-center justify-between">
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
          <div className="bg-tatame-bg/90 rounded-2xl p-4 border border-tatame-border/70 flex items-center justify-between">
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
