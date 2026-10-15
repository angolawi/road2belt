import React, { useState } from 'react';
import { Flame, Dumbbell, Apple, HeartPulse, Check, Sparkles, ChevronRight, Clock, Plus, AlertCircle, Droplets } from 'lucide-react';
import { BJJSession, ConditioningSession, DailyNutrition, ReadinessCheck, WeeklyScheduleConfig, UserProfile } from '../../types';
import { useDailySchedule } from '../../hooks/useDailySchedule';
import { ReadinessCard } from './ReadinessCard';
import { MiniDashboard } from './MiniDashboard';
import confetti from 'canvas-confetti';

interface DayViewProps {
  selectedDate: string;
  user: UserProfile;
  scheduleConfig?: WeeklyScheduleConfig;
  bjjSession?: BJJSession;
  conditioningSession?: ConditioningSession;
  nutritionLog?: DailyNutrition;
  readinessLog?: ReadinessCheck;
  allBjjSessions: BJJSession[];
  allConditioningSessions: ConditioningSession[];
  allNutritionLogs: DailyNutrition[];
  allReadinessLogs: ReadinessCheck[];
  onOpenBJJCheckin: () => void;
  onNavigateToTab: (tab: 'tatame' | 'conditioning' | 'nutrition' | 'kpis') => void;
  onSaveNutrition: (nutrition: DailyNutrition) => void;
  onSaveConditioning: (session: ConditioningSession) => void;
  onSaveReadiness: (readiness: ReadinessCheck) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  user,
  scheduleConfig,
  bjjSession,
  conditioningSession,
  nutritionLog,
  readinessLog,
  allBjjSessions,
  allConditioningSessions,
  allNutritionLogs,
  allReadinessLogs,
  onOpenBJJCheckin,
  onNavigateToTab,
  onSaveNutrition,
  onSaveConditioning,
  onSaveReadiness
}) => {
  const schedule = useDailySchedule(selectedDate, scheduleConfig);

  // Nutrition state
  const isBjjProtocol = (nutritionLog?.protocolType || schedule.defaultNutritionProtocol) === 'DIAS_COM_BJJ';
  const targetKcal = isBjjProtocol ? 1702 : 1598;

  const bjjDone = !!bjjSession;
  const condDone = conditioningSession?.completed ?? false;
  const mealsDoneCount = [
    nutritionLog?.breakfastDone,
    nutritionLog?.snackAmDone,
    nutritionLog?.lunchDone,
    nutritionLog?.snackPmDone,
    nutritionLog?.dinnerDone
  ].filter(Boolean).length;
  const nutritionDone = mealsDoneCount >= 4;

  // Quick toggle meals
  const handleToggleMeal = (mealKey: 'breakfast' | 'snackAm' | 'lunch' | 'snackPm' | 'dinner') => {
    const updated: DailyNutrition = {
      id: nutritionLog?.id || `nutr-${Date.now()}`,
      date: selectedDate,
      protocolType: nutritionLog?.protocolType || schedule.defaultNutritionProtocol,
      targetKcal,
      targetCarbsG: isBjjProtocol ? 197.4 : 166.9,
      targetProteinG: isBjjProtocol ? 102.7 : 120.7,
      targetFatG: isBjjProtocol ? 63.5 : 55.3,
      breakfastDone: nutritionLog?.breakfastDone ?? false,
      snackAmDone: nutritionLog?.snackAmDone ?? false,
      lunchDone: nutritionLog?.lunchDone ?? false,
      snackPmDone: nutritionLog?.snackPmDone ?? false,
      dinnerDone: nutritionLog?.dinnerDone ?? false,
      hydrationLiters: nutritionLog?.hydrationLiters ?? 2.5,
      notes: nutritionLog?.notes || '',
      [mealKey === 'breakfast' ? 'breakfastDone' :
       mealKey === 'snackAm' ? 'snackAmDone' :
       mealKey === 'lunch' ? 'lunchDone' :
       mealKey === 'snackPm' ? 'snackPmDone' : 'dinnerDone']: !nutritionLog?.[mealKey === 'breakfast' ? 'breakfastDone' : mealKey === 'snackAm' ? 'snackAmDone' : mealKey === 'lunch' ? 'lunchDone' : mealKey === 'snackPm' ? 'snackPmDone' : 'dinnerDone']
    };
    onSaveNutrition(updated);
  };

  // Quick Pilates check-in
  const handleQuickPilates = (status: 'ATTENDED' | 'SKIPPED' | 'PASSIVE_REST') => {
    const updated: ConditioningSession = {
      id: conditioningSession?.id || `cond-pilates-${Date.now()}`,
      date: selectedDate,
      type: 'PILATES_18H',
      weekCycle: conditioningSession?.weekCycle || 1,
      completed: status === 'ATTENDED',
      attendanceStatus: status,
      decompressionImpact: conditioningSession?.decompressionImpact || 'HIGH',
      cadenceAdherence: true,
      pseAverage: 4,
      barefootConfirmed: true,
      notes: conditioningSession?.notes || 'Check-in rápido de Pilates das 18h.'
    };
    onSaveConditioning(updated);
    if (status === 'ATTENDED') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  };

  // Quick SC check-in
  const handleQuickSC = () => {
    const isCompleted = !conditioningSession?.completed;
    const updated: ConditioningSession = {
      id: conditioningSession?.id || `cond-${Date.now()}`,
      date: selectedDate,
      type: schedule.recommendedConditioningType,
      weekCycle: conditioningSession?.weekCycle || 1,
      completed: isCompleted,
      cadenceAdherence: true,
      pseAverage: conditioningSession?.pseAverage || 7,
      barefootConfirmed: true,
      notes: conditioningSession?.notes || 'Treino de Força concluído.'
    };
    onSaveConditioning(updated);
    if (isCompleted) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Mini Dashboard de Visualização Rápida Semanal */}
      <MiniDashboard
        selectedDate={selectedDate}
        user={user}
        scheduleConfig={scheduleConfig}
        bjjSessions={allBjjSessions}
        conditioningSessions={allConditioningSessions}
        nutritionLogs={allNutritionLogs}
        readinessLogs={allReadinessLogs}
      />

      {/* Smart Alert: Sugestão de Treino BJJ 12:00 */}
      {schedule.isBJJDay && !bjjDone && (
        <div className="bg-gradient-to-r from-purple-950/80 to-purple-900/60 border border-purple-500/60 rounded-2xl p-4 shadow-lg shadow-purple-950/50 flex items-center justify-between animate-pulse-gentle">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded">
                  Tatame 12:00
                </span>
                <span className="text-xs font-bold text-white">Dia de BJJ!</span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                Registre seus rolas e notas de A-Game em 30 segundos.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBJJCheckin}
            className="px-3.5 py-2 bg-white text-purple-950 hover:bg-gray-100 text-xs font-extrabold rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1 flex-shrink-0"
          >
            <span>Check-in</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. PILAR TATAME (BJJ SESSIONS) */}
      <div className={`bg-tatame-card border rounded-2xl p-4 transition-all ${
        bjjDone ? 'border-purple-600/70 shadow-sm shadow-purple-900/20' : 'border-tatame-border'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-tatame-border/60">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              bjjDone ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-400 border border-purple-800'
            }`}>
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Pilar Tatame • Jiu-Jitsu 12:00
                </h3>
                {bjjDone && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded font-bold">
                    ✓ Concluído
                  </span>
                )}
              </div>
              <p className="text-[11px] text-tatame-muted">
                {schedule.isBJJDay ? 'Seg/Qua/Sex • Sessão regular 12:00 (75 min)' : 'Dia de descanso de tatame ou foco em força'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBJJCheckin}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>{bjjDone ? 'Editar' : 'Check-in'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {bjjDone ? (
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/60">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-white">{bjjSession.roundsRolled} Rolas Rolados</span>
                <span className="text-tatame-muted">•</span>
                <span className="text-gray-300">Duração: {bjjSession.durationMinutes} min</span>
              </div>
              <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                PSE {bjjSession.rpe}/10
              </span>
            </div>

            {bjjSession.techniqueNotes && (
              <div className="text-xs bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/60">
                <span className="font-semibold text-purple-300 block mb-0.5">A-Game & Ajustes:</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{bjjSession.techniqueNotes}</p>
              </div>
            )}
          </div>
        ) : !schedule.isBJJDay ? (
          <div className="mt-3 p-3.5 bg-tatame-bg/90 rounded-xl border border-tatame-border/70 text-xs space-y-2.5">
            <div className="flex items-start space-x-2.5">
              <span className="text-base">🥋</span>
              <div>
                <p className="font-bold text-white">
                  Treinos de Jiu-Jitsu: Segundas, Quartas e Sextas às 12:00
                </p>
                <p className="text-[11px] text-tatame-muted mt-0.5">
                  Hoje ({schedule.formattedDate.split(',')[0]}) o foco é na musculação de Samuel Saraiva e recuperação muscular para manter as articulações blindadas.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 border-t border-tatame-border/50">
              <button
                onClick={() => onNavigateToTab('tatame')}
                className="flex-1 py-1.5 px-2 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 rounded-lg text-[11px] font-bold text-center"
              >
                Ver Grade de BJJ da Semana
              </button>
              <button
                onClick={onOpenBJJCheckin}
                className="py-1.5 px-2.5 bg-tatame-card hover:bg-tatame-border/50 text-gray-300 border border-tatame-border rounded-lg text-[11px] font-semibold"
                title="Caso tenha feito um treino extra de tatame hoje"
              >
                + Registrar Treino Extra
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-center py-4 bg-purple-950/20 rounded-xl border border-dashed border-purple-800/80 p-3 space-y-2">
            <p className="text-xs font-bold text-purple-200">
              🥋 Hoje é dia de Tatame ao meio-dia (12:00)!
            </p>
            <p className="text-[11px] text-tatame-muted">
              Treino regular de 75 min (sparring, retenção de guarda e transições).
            </p>
            <button
              onClick={onOpenBJJCheckin}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-900/40 inline-flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              <span>Fazer Check-in do Treino de BJJ</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. PILAR FÍSICO & MOBILIDADE (S&C SAMUEL SARAIVA OU PILATES 18H) */}
      <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-tatame-border/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pilar Físico & Mobilidade
              </h3>
              <p className="text-[11px] text-tatame-muted">
                {schedule.isSCStrengthDay ? 'Musculação Samuel Saraiva (Ter/Qui/Sáb)' : 'Pilates Mirele 18h & Descompressão'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('conditioning')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Ver Ficha</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic conditioning card depending on day */}
        {schedule.isPilatesDay ? (
          <div className="mt-3 bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-blue-400" />
                  Pilates das 18:00 (Prof. Mirele)
                </span>
                <span className="text-[10px] text-tatame-muted block">
                  Descompressão lombar e estabilidade de quadril pós-tatame.
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                conditioningSession?.attendanceStatus === 'ATTENDED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-tatame-card text-gray-400 border-tatame-border'
              }`}>
                {conditioningSession?.attendanceStatus === 'ATTENDED' ? 'Compareceu ✓' : 'Aguardando 18h'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => handleQuickPilates('ATTENDED')}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  conditioningSession?.attendanceStatus === 'ATTENDED'
                    ? 'bg-blue-600 text-white border-blue-400 shadow'
                    : 'bg-tatame-card text-gray-300 border-tatame-border hover:bg-tatame-border/40'
                }`}
              >
                Compareci
              </button>
              <button
                onClick={() => handleQuickPilates('SKIPPED')}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  conditioningSession?.attendanceStatus === 'SKIPPED'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : 'bg-tatame-card text-gray-400 border-tatame-border'
                }`}
              >
                Pulei
              </button>
              <button
                onClick={() => handleQuickPilates('PASSIVE_REST')}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  conditioningSession?.attendanceStatus === 'PASSIVE_REST'
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : 'bg-tatame-card text-gray-400 border-tatame-border'
                }`}
              >
                Descanso
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-purple-400" />
                  Protocolo Samuel Saraiva: {schedule.recommendedConditioningType === 'SC_TREINO_B' ? 'Treino B' : 'Treino A'}
                </span>
                <span className="text-[10px] text-tatame-muted block">
                  Treino descalço • Cadência programada • PSE ≤ 8
                </span>
              </div>
              <button
                onClick={handleQuickSC}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                  condDone
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                    : 'bg-tatame-card text-gray-300 border-tatame-border hover:border-gray-500'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{condDone ? 'Concluído' : 'Marcar Feito'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. PILAR NUTRIÇÃO & ADESÃO (ALINE MARINHO) */}
      <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-tatame-border/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <Apple className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Pilar Nutrição • Aline Marinho
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded font-bold">
                  {targetKcal} kcal
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted">
                {isBjjProtocol ? 'Dias com BJJ (197g Carbo / 103g Proteína)' : 'Dias sem BJJ (167g Carbo / 121g Proteína)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('nutrition')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Detalhes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Checkboxes Rápidos de Refeição */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: 'breakfast', label: 'Café 06:40', done: nutritionLog?.breakfastDone },
            { key: 'snackAm', label: 'Colação 10:00', done: nutritionLog?.snackAmDone },
            { key: 'lunch', label: 'Almoço 13:30', done: nutritionLog?.lunchDone },
            { key: 'snackPm', label: 'Lanche 16:30', done: nutritionLog?.snackPmDone },
            { key: 'dinner', label: 'Jantar / Ceia', done: nutritionLog?.dinnerDone },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => handleToggleMeal(m.key as any)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                m.done
                  ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                  : 'bg-tatame-bg border-tatame-border text-gray-400 hover:text-white'
              }`}
            >
              <span>{m.label}</span>
              <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                m.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-gray-600 bg-tatame-card'
              }`}>
                {m.done && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          ))}
        </div>

        {/* Hidratação Rápida */}
        <div className="flex items-center justify-between pt-2 border-t border-tatame-border/50 text-xs">
          <span className="text-gray-300 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Água: <strong className="text-blue-400 font-bold">{nutritionLog?.hydrationLiters?.toFixed(1) || '2.5'} L</strong></span>
          </span>
          <button
            onClick={() => onNavigateToTab('nutrition')}
            className="text-[11px] text-tatame-muted hover:text-purple-300 underline"
          >
            Ajustar Água
          </button>
        </div>
      </div>

      {/* 4. READINESS & RECUPERAÇÃO NEURAL */}
      <ReadinessCard
        readiness={readinessLog}
        onSaveReadiness={onSaveReadiness}
        selectedDate={selectedDate}
      />
    </div>
  );
};
