import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Flame, Dumbbell, HeartPulse, Apple, Moon, Activity, Award, TrendingUp, Sparkles } from 'lucide-react';
import { BJJSession, ConditioningSession, DailyNutrition, ReadinessCheck, UserProfile, WeeklyScheduleConfig } from '../../types';
import { getWeekDays } from '../../hooks/useDailySchedule';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';

interface MiniDashboardProps {
  selectedDate: string;
  user: UserProfile;
  scheduleConfig?: WeeklyScheduleConfig;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
}

export const MiniDashboard: React.FC<MiniDashboardProps> = ({
  selectedDate,
  user,
  scheduleConfig,
  bjjSessions,
  conditioningSessions,
  nutritionLogs,
  readinessLogs
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Obter todos os 7 dias da semana selecionada
  const currentWeek = getWeekDays(selectedDate, scheduleConfig);
  const weekDateStrings = currentWeek.map(d => d.dateStr);

  // Filtrar sessões que pertencem à semana corrente
  const weekBJJ = bjjSessions.filter(s => weekDateStrings.includes(s.date));
  const weekCond = conditioningSessions.filter(s => weekDateStrings.includes(s.date));
  const weekNutr = nutritionLogs.filter(s => weekDateStrings.includes(s.date));
  const weekReadiness = readinessLogs.filter(s => weekDateStrings.includes(s.date));

  // Metas da semana baseadas na configuração do atleta
  const plannedBJJCount = scheduleConfig?.bjjDays.length || 3;
  const plannedSCCount = scheduleConfig?.conditioningDays.length || 3;
  const plannedPilatesCount = scheduleConfig?.pilatesDays.length || 1;
  const targetWeeklyRounds = plannedBJJCount * 6; // Meta de 6 rolas por treino

  // Métricas calculadas da semana
  const bjjDoneCount = weekBJJ.length;
  const totalRounds = weekBJJ.reduce((acc, s) => acc + s.roundsRolled, 0);
  const scDoneCount = weekCond.filter(s => (s.type === 'SC_TREINO_A' || s.type === 'SC_TREINO_B') && s.completed).length;
  const pilatesDoneCount = weekCond.filter(s => s.type === 'PILATES_18H' && s.attendanceStatus === 'ATTENDED').length;

  // Nutrição da semana
  let totalTrackedMeals = 0;
  let totalDoneMeals = 0;
  let totalWater = 0;
  weekNutr.forEach(n => {
    totalTrackedMeals += 5;
    if (n.breakfastDone) totalDoneMeals++;
    if (n.snackAmDone) totalDoneMeals++;
    if (n.lunchDone) totalDoneMeals++;
    if (n.snackPmDone) totalDoneMeals++;
    if (n.dinnerDone) totalDoneMeals++;
    totalWater += n.hydrationLiters;
  });
  const nutritionAdherence = totalTrackedMeals > 0 ? Math.round((totalDoneMeals / totalTrackedMeals) * 100) : 0;
  const avgWater = weekNutr.length > 0 ? (totalWater / weekNutr.length).toFixed(1) : '0.0';

  // Readiness médio da semana
  const avgSleep = weekReadiness.length > 0
    ? (weekReadiness.reduce((acc, r) => acc + r.sleepHours, 0) / weekReadiness.length).toFixed(1)
    : '7.5';
  const avgSoreness = weekReadiness.length > 0
    ? (weekReadiness.reduce((acc, r) => acc + r.jointSoreness, 0) / weekReadiness.length).toFixed(1)
    : '2.0';

  // Taxa de cumprimento semanal geral (0 a 100%)
  const bjjPillarScore = Math.min(1, bjjDoneCount / Math.max(1, plannedBJJCount));
  const roundsPillarScore = Math.min(1, totalRounds / Math.max(1, targetWeeklyRounds));
  const scPillarScore = Math.min(1, scDoneCount / Math.max(1, plannedSCCount));
  const pilatesPillarScore = Math.min(1, pilatesDoneCount / Math.max(1, plannedPilatesCount));
  const weeklyScore = Math.round(
    ((bjjPillarScore * 0.35) + (roundsPillarScore * 0.25) + (scPillarScore * 0.2) + (pilatesPillarScore * 0.2)) * 100
  );

  return (
    <div className="bg-gradient-to-br from-tatame-card to-tatame-bg border border-tatame-border rounded-2xl p-3.5 space-y-3 shadow-lg">
      {/* Header do Mini Dashboard com Toggle */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-white tracking-wide uppercase">
                Mini Dashboard da Semana
              </h3>
              <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-1.5 py-0.2 rounded border border-purple-800">
                {weeklyScore}% Meta
              </span>
            </div>
            <p className="text-[10px] text-tatame-muted">
              Rumo à {user.targetRank} • {totalRounds} rolas • {bjjDoneCount}/{plannedBJJCount} treinos
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mini Faixa Alvo no Cabeçalho */}
          <BJJBeltBadge
            color={user.targetBeltColor || 'PURPLE'}
            degrees={user.targetDegrees || 0}
            size="sm"
          />
          <button
            type="button"
            className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Expansível do Mini Dashboard */}
      {isExpanded && (
        <div className="pt-2 border-t border-tatame-border/60 space-y-3 animate-in fade-in">
          {/* Grid de 4 Pilares da Semana */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Tatame & Sparring */}
            <div className="bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/70">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-purple-400" /> Tatame
                </span>
                <span className="font-extrabold text-white">
                  {bjjDoneCount}/{plannedBJJCount}
                </span>
              </div>
              <div className="text-xs font-bold text-purple-300">
                {totalRounds} <span className="text-[10px] text-tatame-muted font-normal">/ {targetWeeklyRounds} rolas</span>
              </div>
              <div className="w-full h-1.5 bg-tatame-card rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalRounds / Math.max(1, targetWeeklyRounds)) * 100)}%` }}
                />
              </div>
            </div>

            {/* 2. Força Saraiva */}
            <div className="bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/70">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-400 font-bold flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-400" /> Força
                </span>
                <span className="font-extrabold text-blue-400">
                  {scDoneCount}/{plannedSCCount}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {scDoneCount >= plannedSCCount ? 'Blindagem OK' : `${plannedSCCount - scDoneCount} restante`}
              </div>
              <div className="w-full h-1.5 bg-tatame-card rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (scDoneCount / Math.max(1, plannedSCCount)) * 100)}%` }}
                />
              </div>
            </div>

            {/* 3. Pilates Mirele */}
            <div className="bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/70">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-400 font-bold flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> Pilates
                </span>
                <span className="font-extrabold text-emerald-400">
                  {pilatesDoneCount}/{plannedPilatesCount}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {pilatesDoneCount >= plannedPilatesCount ? 'Descompressão ✓' : 'Pendente'}
              </div>
              <div className="w-full h-1.5 bg-tatame-card rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (pilatesDoneCount / Math.max(1, plannedPilatesCount)) * 100)}%` }}
                />
              </div>
            </div>

            {/* 4. Readiness & Sono */}
            <div className="bg-tatame-bg/90 p-2.5 rounded-xl border border-tatame-border/70">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-400 font-bold flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-amber-400" /> Sono
                </span>
                <span className="font-extrabold text-amber-300">
                  {avgSleep}h
                </span>
              </div>
              <div className="text-[11px] text-gray-300 flex items-center justify-between mt-1">
                <span>Dor Articular:</span>
                <span className={`font-bold ${Number(avgSoreness) <= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {avgSoreness}/5
                </span>
              </div>
            </div>
          </div>

          {/* Banner de Evolução da Graduação: Atual -> Alvo */}
          <div className="bg-tatame-bg/80 rounded-xl p-2 px-3 border border-tatame-border/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-tatame-muted font-bold">Graduação:</span>
              <BJJBeltBadge
                color={user.currentBeltColor || 'BLUE'}
                degrees={user.currentDegrees ?? 4}
                size="sm"
                showLabel
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-tatame-muted text-xs">➔</span>
              <BJJBeltBadge
                color={user.targetBeltColor || 'PURPLE'}
                degrees={user.targetDegrees ?? 0}
                size="sm"
                showLabel
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
