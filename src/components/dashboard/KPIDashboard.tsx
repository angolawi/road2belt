import React, { useState } from 'react';
import { Award, Shield, Flame, Dumbbell, HeartPulse, Apple, TrendingUp, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { BJJSession, ConditioningSession, DailyNutrition, UserProfile } from '../../types';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';

interface KPIDashboardProps {
  user: UserProfile;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({
  user,
  bjjSessions,
  conditioningSessions,
  nutritionLogs
}) => {
  const [period, setPeriod] = useState<'14days' | 'month'>('month');

  // Filter sessions by period
  const now = new Date();
  const daysLimit = period === '14days' ? 14 : 30;
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - daysLimit);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const recentBJJ = bjjSessions.filter((s) => s.date >= cutoffStr);
  const recentCond = conditioningSessions.filter((s) => s.date >= cutoffStr);
  const recentNutr = nutritionLogs.filter((s) => s.date >= cutoffStr);

  // 1. Taxa de Presença BJJ (baseada nos dias configurados pelo usuário)
  const bjjDaysPerWeek = user.scheduleConfig?.bjjDays.length || 3;
  const expectedBJJCount = Math.max(1, period === '14days' ? Math.round(bjjDaysPerWeek * 2) : Math.round(bjjDaysPerWeek * 4.2));
  const bjjPresenceRate = Math.min(100, Math.round((recentBJJ.length / expectedBJJCount) * 100));
  const bjjCompliant = bjjPresenceRate >= 90;

  // 2. Volume de Rolas Semanais
  const totalRounds = recentBJJ.reduce((acc, s) => acc + s.roundsRolled, 0);
  const weeksCount = period === '14days' ? 2 : 4.2;
  const avgRoundsPerWeek = Math.round(totalRounds / weeksCount);
  const targetRoundsPerWeek = bjjDaysPerWeek * 6; // Meta de 6 rolas por sessão
  const roundsCompliant = avgRoundsPerWeek >= Math.min(18, targetRoundsPerWeek);

  // 3. Cumprimento do Plano de Força (Samuel Saraiva)
  const strengthSessions = recentCond.filter(
    (s) => (s.type === 'SC_TREINO_A' || s.type === 'SC_TREINO_B') && s.completed
  );
  const targetStrengthPerWeek = user.scheduleConfig?.conditioningDays.length || 3;
  const avgStrengthPerWeek = (strengthSessions.length / weeksCount).toFixed(1);
  const strengthCompliant = Number(avgStrengthPerWeek) >= (targetStrengthPerWeek * 0.8);

  // 4. Frequência no Pilates 18h
  const pilatesSessions = recentCond.filter(
    (s) => s.type === 'PILATES_18H' && s.attendanceStatus === 'ATTENDED'
  );
  const targetPilatesPerWeek = user.scheduleConfig?.pilatesDays.length || 1;
  const avgPilatesPerWeek = (pilatesSessions.length / weeksCount).toFixed(1);
  const pilatesCompliant = Number(avgPilatesPerWeek) >= (targetPilatesPerWeek * 0.8);

  // 5. Índice de Adesão Nutricional (>= 85% das refeições marcadas)
  let totalTrackedMeals = 0;
  let totalDoneMeals = 0;
  recentNutr.forEach((n) => {
    totalTrackedMeals += 5;
    if (n.breakfastDone) totalDoneMeals++;
    if (n.snackAmDone) totalDoneMeals++;
    if (n.lunchDone) totalDoneMeals++;
    if (n.snackPmDone) totalDoneMeals++;
    if (n.dinnerDone) totalDoneMeals++;
  });
  const nutritionRate = totalTrackedMeals > 0 ? Math.round((totalDoneMeals / totalTrackedMeals) * 100) : 85;
  const nutritionCompliant = nutritionRate >= 85;

  // Pontuação Geral Rumo à Faixa Alvo (0 a 100%)
  const complianceScore = Math.round(
    ((bjjCompliant ? 1 : bjjPresenceRate / 90) * 30) +
    ((roundsCompliant ? 1 : Math.min(1, avgRoundsPerWeek / 18)) * 25) +
    ((strengthCompliant ? 1 : Math.min(1, Number(avgStrengthPerWeek) / 2)) * 15) +
    ((pilatesCompliant ? 1 : Math.min(1, Number(avgPilatesPerWeek) / 1.5)) * 15) +
    ((nutritionCompliant ? 1 : nutritionRate / 85) * 15)
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Top Card: Score Faixa Alvo */}
      <div className="bg-gradient-to-br from-tatame-card via-purple-950/50 to-tatame-card border border-purple-500/40 rounded-3xl p-5 glow-purple">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/40 border border-purple-400/40">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                Índice de Prontidão
              </span>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-lg font-extrabold text-white">Padrão {user.targetRank}</h2>
                <BJJBeltBadge color={user.targetBeltColor || 'PURPLE'} degrees={user.targetDegrees || 0} size="sm" />
              </div>
              <p className="text-xs text-tatame-muted">Consolidação do Tripé: Tatame • Força • Dieta</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-purple-300 font-mono">
              {Math.min(100, complianceScore)}%
            </span>
            <span className="text-[10px] text-tatame-muted block">Alinhamento</span>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="mt-4">
          <div className="w-full h-3 bg-tatame-bg rounded-full overflow-hidden border border-tatame-border/80">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, complianceScore)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-tatame-muted mt-1.5 font-medium">
            <span>{user.currentRank}</span>
            <span className="text-purple-300 font-bold">{user.targetRank} (Graduação)</span>
          </div>
        </div>

        {/* Period Selector: Quinzenal vs Mensal */}
        <div className="flex bg-tatame-bg/80 border border-tatame-border/70 rounded-xl p-1 mt-4">
          <button
            onClick={() => setPeriod('14days')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              period === '14days' ? 'bg-purple-600 text-white shadow' : 'text-gray-400'
            }`}
          >
            Últimos 14 Dias (Quinzenal)
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              period === 'month' ? 'bg-purple-600 text-white shadow' : 'text-gray-400'
            }`}
          >
            Últimos 30 Dias (Mensal)
          </button>
        </div>
      </div>

      {/* 5 KPIs Detalhados */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          Os 5 Indicadores-Chave de Desempenho (Tripé)
        </h3>

        {/* KPI 1: Taxa de Presença BJJ */}
        <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              bjjCompliant ? 'bg-purple-950 text-purple-400 border border-purple-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white">Presença no Tatame (12:00)</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  bjjCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {bjjCompliant ? 'Padrão Alvo ✓' : 'Ajustar Ritmo'}
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Meta: ≥90% ({period === '14days' ? '5-6 treinos' : '11-12 treinos'}) • Feitos: {recentBJJ.length} treinos
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-white">{bjjPresenceRate}%</span>
          </div>
        </div>

        {/* KPI 2: Volume de Rolas Semanais */}
        <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              roundsCompliant ? 'bg-purple-950 text-purple-400 border border-purple-800' : 'bg-gray-800 text-gray-400'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white">Volume de Rolas Semanais</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  roundsCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}>
                  {roundsCompliant ? 'Pressão Alta ✓' : 'Subir Rounds'}
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Meta: ≥18 a 24 rounds/semana • Atual: ~{avgRoundsPerWeek} rolas/semana
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-purple-400">{avgRoundsPerWeek}</span>
            <span className="text-[10px] text-tatame-muted block">rounds/sem</span>
          </div>
        </div>

        {/* KPI 3: Cumprimento Plano de Força Samuel Saraiva */}
        <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              strengthCompliant ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-gray-800 text-gray-400'
            }`}>
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white">Treino de Força (Saraiva)</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  strengthCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}>
                  {strengthCompliant ? 'Blindagem OK ✓' : 'Fazer 2-3x'}
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Meta: 2 a 3 sessões semanais • Média: {avgStrengthPerWeek} sessões/sem
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-blue-400">{strengthSessions.length}</span>
            <span className="text-[10px] text-tatame-muted block">sessões</span>
          </div>
        </div>

        {/* KPI 4: Frequência no Pilates 18h */}
        <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              pilatesCompliant ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-gray-800 text-gray-400'
            }`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white">Pilates 18h (Descompressão)</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  pilatesCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}>
                  {pilatesCompliant ? 'Coluna Protegida ✓' : 'Priorizar'}
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Meta: ≥2 sessões/semana • Realizadas: {pilatesSessions.length} no período
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-white">{avgPilatesPerWeek}</span>
            <span className="text-[10px] text-tatame-muted block">x / semana</span>
          </div>
        </div>

        {/* KPI 5: Adesão Nutricional Aline Marinho */}
        <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              nutritionCompliant ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white">Adesão Alimentar (Aline Marinho)</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  nutritionCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {nutritionCompliant ? 'Glicogênio OK ✓' : 'Aumentar Adesão'}
                </span>
              </div>
              <p className="text-[11px] text-tatame-muted mt-0.5">
                Meta: ≥85% das refeições marcadas • Cumprimento: {nutritionRate}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-emerald-400">{nutritionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
