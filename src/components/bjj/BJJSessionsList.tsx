import React from 'react';
import { Flame, Plus, Clock, Sparkles, MessageSquare, Shield, Calendar } from 'lucide-react';
import { BJJSession, WeeklyScheduleConfig } from '../../types';
import { formatDisplayDate, getTodayString, getWeekDays } from '../../hooks/useDailySchedule';

interface BJJSessionsListProps {
  sessions: BJJSession[];
  scheduleConfig?: WeeklyScheduleConfig;
  onOpenCheckin: () => void;
  onEditSession: (session: BJJSession) => void;
  onDeleteSession: (id: string) => void;
}

export const BJJSessionsList: React.FC<BJJSessionsListProps> = ({
  sessions,
  scheduleConfig,
  onOpenCheckin,
  onEditSession,
  onDeleteSession
}) => {
  const todayStr = getTodayString();
  const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  const totalRounds = sessions.reduce((acc, s) => acc + s.roundsRolled, 0);
  const avgPse = sessions.length ? (sessions.reduce((acc, s) => acc + s.rpe, 0) / sessions.length).toFixed(1) : '0';

  const getFocusBadge = (focus: string) => {
    switch (focus) {
      case 'GUARD_RETENTION': return { label: 'Guarda & Retenção', color: 'bg-purple-900/60 text-purple-300 border-purple-700/50' };
      case 'PASSING': return { label: 'Passagem', color: 'bg-blue-900/60 text-blue-300 border-blue-700/50' };
      case 'SUBMISSIONS': return { label: 'Finalizações', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' };
      case 'TAKEDOWN': return { label: 'Quedas', color: 'bg-amber-900/60 text-amber-300 border-amber-700/50' };
      default: return { label: 'Rolas Intensos', color: 'bg-red-900/60 text-red-300 border-red-700/50' };
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-br from-tatame-card to-purple-950/40 border border-tatame-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tatame & Sparring</h2>
              <p className="text-xs text-tatame-muted">Consistência 12:00 • Seg/Qua/Sex</p>
            </div>
          </div>
          <button
            onClick={onOpenCheckin}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-purple-900/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Treino</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-tatame-border/60 text-center">
          <div className="bg-tatame-bg/80 rounded-xl p-2.5 border border-tatame-border/50">
            <span className="text-[11px] text-tatame-muted block">Treinos Totais</span>
            <span className="text-base font-extrabold text-white">{sessions.length}</span>
          </div>
          <div className="bg-tatame-bg/80 rounded-xl p-2.5 border border-tatame-border/50">
            <span className="text-[11px] text-tatame-muted block">Rounds Rolados</span>
            <span className="text-base font-extrabold text-purple-400">{totalRounds}</span>
          </div>
          <div className="bg-tatame-bg/80 rounded-xl p-2.5 border border-tatame-border/50">
            <span className="text-[11px] text-tatame-muted block">PSE Médio</span>
            <span className="text-base font-extrabold text-amber-400">{avgPse}</span>
          </div>
        </div>
      </div>

      {/* Grade Fixa de Tatame: Segundas, Quartas e Sextas às 12:00 */}
      <div className="bg-tatame-card border border-purple-500/50 rounded-2xl p-4 space-y-3 shadow-lg shadow-purple-950/20">
        <div className="flex items-center justify-between pb-2 border-b border-tatame-border/60">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Grade Fixa de Tatame: Seg, Qua e Sex (12:00)
            </h3>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 font-bold">
            Semana Vigente
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {getWeekDays(todayStr, scheduleConfig).filter(d => d.isBJJ).map(bjjDay => {
            const matchingSession = sessions.find(s => s.date === bjjDay.dateStr);
            const isToday = bjjDay.dateStr === todayStr;
            const isPast = bjjDay.dateStr < todayStr;
            const isFuture = bjjDay.dateStr > todayStr;

            return (
              <div
                key={bjjDay.dateStr}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  matchingSession
                    ? 'bg-purple-950/30 border-purple-600/60 shadow-sm'
                    : isToday
                    ? 'bg-purple-950/60 border-purple-400 ring-1 ring-purple-400'
                    : 'bg-tatame-bg/90 border-tatame-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-white flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-purple-400" />
                      {bjjDay.weekdayShort}-Feira ({bjjDay.dayNum})
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono font-bold">
                      12:00
                    </span>
                  </div>

                  {matchingSession ? (
                    <div className="space-y-1 mt-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          ✓ {matchingSession.roundsRolled} Rolas
                        </span>
                        <span className="font-bold text-amber-400">
                          PSE {matchingSession.rpe}/10
                        </span>
                      </div>
                      <p className="text-[10px] text-tatame-muted line-clamp-1 italic mt-1">
                        {matchingSession.techniqueNotes || 'Sessão concluída'}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[11px] text-tatame-muted">
                      {isToday ? (
                        <span className="text-purple-300 font-bold block">🔥 Treino Hoje às 12:00!</span>
                      ) : isPast ? (
                        <span className="text-amber-400/90 block">⚠️ Não registrado</span>
                      ) : (
                        <span className="text-gray-400 block">📅 Próxima Sessão</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-tatame-border/50">
                  {matchingSession ? (
                    <button
                      onClick={() => onEditSession(matchingSession)}
                      className="w-full py-1.5 text-[11px] font-bold text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 rounded-lg transition-colors"
                    >
                      Editar Treino
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCheckin()}
                      className={`w-full py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        isToday
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                          : 'bg-tatame-card hover:bg-tatame-border/40 text-gray-300 border border-tatame-border'
                      }`}
                    >
                      + Registrar Treino
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          Histórico de Sessões no Tatame ({sessions.length})
        </h3>

        {sortedSessions.length === 0 ? (
          <div className="text-center py-10 bg-tatame-card border border-tatame-border rounded-2xl p-6">
            <Flame className="w-8 h-8 text-tatame-muted mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-gray-300">Nenhum treino de BJJ registrado ainda</p>
            <p className="text-[11px] text-tatame-muted mt-1">
              Registre os treinos das segundas, quartas e sextas para acompanhar sua jornada rumo à roxa!
            </p>
            <button
              onClick={onOpenCheckin}
              className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Registrar Primeiro Treino
            </button>
          </div>
        ) : (
          sortedSessions.map((session) => {
            const badge = getFocusBadge(session.focusArea);

            return (
              <div
                key={session.id}
                onClick={() => onEditSession(session)}
                className="bg-tatame-card hover:bg-tatame-cardHover border border-tatame-border rounded-2xl p-4 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">
                        {formatDisplayDate(session.date)}
                      </span>
                      <span className="text-[10px] text-tatame-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.startTime} ({session.durationMinutes}m)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] bg-tatame-bg text-gray-300 px-2 py-0.5 rounded border border-tatame-border font-medium">
                        {session.roundsRolled} rolas
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                      PSE {session.rpe}/10
                    </span>
                  </div>
                </div>

                {session.techniqueNotes && (
                  <div className="bg-tatame-bg/90 rounded-xl p-2.5 border border-tatame-border/60">
                    <div className="flex items-center space-x-1 text-[11px] font-semibold text-purple-300 mb-0.5">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>A-Game & Ajustes Técnicos:</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {session.techniqueNotes}
                    </p>
                  </div>
                )}

                {session.partnersFeedback && (
                  <div className="bg-tatame-bg/90 rounded-xl p-2.5 border border-tatame-border/60">
                    <div className="flex items-center space-x-1 text-[11px] font-semibold text-blue-300 mb-0.5">
                      <MessageSquare className="w-3 h-3 text-blue-400" />
                      <span>Feedback com Graduados:</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {session.partnersFeedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
