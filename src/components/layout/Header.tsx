import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Award, Cloud, CloudOff, RefreshCw, Settings } from 'lucide-react';
import { UserProfile } from '../../types';
import { SyncStatus } from '../../services/gistSync';
import { formatDisplayDate, getTodayString, getWeekDays } from '../../hooks/useDailySchedule';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';

interface HeaderProps {
  user: UserProfile;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  syncStatus: SyncStatus;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  selectedDate,
  onSelectDate,
  onOpenSettings,
  onOpenBackup,
  syncStatus
}) => {
  const todayStr = getTodayString();
  const isToday = selectedDate === todayStr;

  // Dias até a meta da faixa roxa
  const daysUntilTarget = Math.max(
    0,
    Math.ceil((new Date(user.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prevStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(prevStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const nextStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(nextStr);
  };

  return (
    <header className="sticky top-0 z-40 bg-tatame-bg/95 backdrop-blur-md border-b border-tatame-border px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-lg shadow-purple-900/30 border border-purple-500/30">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-black tracking-tight text-white">ROAD2BELT</h1>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-semibold border border-purple-700/50">
                BJJ TRACKER
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-tatame-muted">
              <span className="text-gray-300 font-medium">{user.name}</span>
              <span>•</span>
              <BJJBeltBadge
                color={user.currentBeltColor || 'BLUE'}
                degrees={user.currentDegrees ?? 4}
                size="sm"
              />
              <span className="text-[10px] text-gray-400">➔</span>
              <BJJBeltBadge
                color={user.targetBeltColor || 'PURPLE'}
                degrees={user.targetDegrees ?? 0}
                size="sm"
              />
              <span className="text-[10px] text-purple-300 font-bold">({daysUntilTarget}d)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenBackup}
            title={
              syncStatus === 'synced'
                ? 'Nuvem Sincronizada (Clique para gerenciar)'
                : syncStatus === 'syncing'
                ? 'Sincronizando com a nuvem...'
                : syncStatus === 'error'
                ? 'Erro na sincronização (Clique para verificar)'
                : syncStatus === 'offline'
                ? 'Offline (Dados salvos localmente)'
                : 'Configurar Sincronização na Nuvem e Backup'
            }
            className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              syncStatus === 'synced'
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                : syncStatus === 'syncing'
                ? 'bg-purple-950/60 border-purple-700/60 text-purple-300'
                : syncStatus === 'error'
                ? 'bg-red-950/60 border-red-700/60 text-red-300 hover:bg-red-900/60'
                : syncStatus === 'offline'
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300 hover:bg-amber-900/60'
                : 'bg-tatame-card/80 border-tatame-border text-gray-400 hover:text-white hover:bg-tatame-card'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : syncStatus === 'offline' || syncStatus === 'error' ? (
              <CloudOff className="w-3.5 h-3.5" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {syncStatus === 'synced'
                ? 'Sync'
                : syncStatus === 'syncing'
                ? 'Sync...'
                : syncStatus === 'error'
                ? 'Erro'
                : syncStatus === 'offline'
                ? 'Offline'
                : 'Nuvem'}
            </span>
            {syncStatus === 'synced' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
            {syncStatus === 'error' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={onOpenSettings}
            title="Configurações e Metas"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-tatame-card transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date navigation bar */}
      <div className="max-w-lg mx-auto mt-2.5 pt-2 border-t border-tatame-border/60 flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-tatame-card transition-colors"
          title="Dia Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-gray-200">
            {formatDisplayDate(selectedDate)}
          </span>
          {!isToday && (
            <button
              onClick={() => onSelectDate(todayStr)}
              className="text-[10px] bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-700/50 px-1.5 py-0.5 rounded font-medium transition-colors"
            >
              Voltar p/ Hoje
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-tatame-card transition-colors"
          title="Próximo Dia"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekly Schedule Strip (Segunda a Domingo) */}
      <div className="max-w-lg mx-auto mt-2 grid grid-cols-7 gap-1">
        {getWeekDays(selectedDate, user.scheduleConfig).map((day) => {
          const isSelected = day.dateStr === selectedDate;

          return (
            <button
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                  : day.isBJJ
                  ? 'bg-purple-950/40 border border-purple-800/50 text-purple-200 hover:bg-purple-900/50'
                  : 'bg-tatame-card/70 border border-tatame-border/60 text-gray-400 hover:bg-tatame-card'
              }`}
            >
              <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : day.isBJJ ? 'text-purple-300' : 'text-gray-400'}`}>
                {day.weekdayShort}
              </span>
              <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                {day.dayNum}
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {day.isBJJ && (
                  <span className={`text-[8px] font-bold px-1 rounded ${isSelected ? 'bg-purple-800 text-purple-100' : 'bg-purple-900/80 text-purple-300'}`}>
                    12h
                  </span>
                )}
                {day.isSC && !day.isBJJ && (
                  <span className="w-1 h-1 rounded-full bg-blue-400" title="Musculação" />
                )}
                {day.isPilates && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400" title="Pilates 18h" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
};
