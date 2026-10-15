import { UserProfile, BJJSession, ConditioningSession, DailyNutrition, ReadinessCheck, WeeklyScheduleConfig } from '../types';

export const DEFAULT_SCHEDULE_CONFIG: WeeklyScheduleConfig = {
  bjjDays: [1, 3, 5], // Seg, Qua, Sex
  conditioningDays: [2, 4, 6], // Ter, Qui, Sáb
  pilatesDays: [3], // Qua (18h)
  bjjDefaultTime: '12:00',
  pilatesDefaultTime: '18:00'
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-willian-angola',
  name: 'Willian Angola',
  currentRank: 'Faixa Azul 4 Graus',
  targetRank: 'Faixa Roxa',
  currentBeltColor: 'BLUE',
  currentDegrees: 4,
  targetBeltColor: 'PURPLE',
  targetDegrees: 0,
  targetDate: '2027-07-31',
  startDate: '2025-01-01',
  scheduleConfig: DEFAULT_SCHEDULE_CONFIG
};

// Exemplos de treinos recentes para alimentar os KPIs e demonstração imediata
export const INITIAL_BJJ_SESSIONS: BJJSession[] = [
  {
    id: 'bjj-sample-1',
    date: '2026-10-12', // Segunda
    startTime: '12:00',
    durationMinutes: 75,
    focusArea: 'GUARD_RETENTION',
    roundsRolled: 6,
    rpe: 8,
    techniqueNotes: 'Guarda De La Riva ativa; raspagem de gancho encaixada quando adversário colocou peso na perna base.',
    partnersFeedback: 'Professor elogiou a postura e recomentou esgrimar mais rápido antes de subir.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bjj-sample-2',
    date: '2026-10-14', // Quarta
    startTime: '12:00',
    durationMinutes: 75,
    focusArea: 'PASSING',
    roundsRolled: 7,
    rpe: 8,
    techniqueNotes: 'Passagem toreando combinada com leg drag; boa estabilização no cem quilos.',
    partnersFeedback: 'Treino duro com dois faixas roxas; resistência de pegada muito boa.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CONDITIONING_SESSIONS: ConditioningSession[] = [
  {
    id: 'cond-sample-1',
    date: '2026-10-13', // Terça
    type: 'SC_TREINO_A',
    weekCycle: 1,
    completed: true,
    cadenceAdherence: true,
    pseAverage: 7,
    barefootConfirmed: true,
    notes: 'Treino A da Semana 1 concluído descalço. Agachamento Goblet com 24kg.'
  },
  {
    id: 'cond-sample-2',
    date: '2026-10-14', // Quarta
    type: 'PILATES_18H',
    weekCycle: 1,
    completed: true,
    attendanceStatus: 'ATTENDED',
    cadenceAdherence: true,
    pseAverage: 5,
    decompressionImpact: 'HIGH',
    barefootConfirmed: true,
    notes: 'Sessão com Prof. Mirele focada em mobilidade torácica e descompressão lombar pós-tatame.'
  }
];

export const INITIAL_NUTRITION_LOGS: DailyNutrition[] = [
  {
    id: 'nutr-sample-1',
    date: '2026-10-14',
    protocolType: 'DIAS_COM_BJJ',
    targetKcal: 1702,
    targetCarbsG: 197.4,
    targetProteinG: 102.7,
    targetFatG: 63.5,
    breakfastDone: true,
    snackAmDone: true,
    lunchDone: true,
    snackPmDone: true,
    dinnerDone: false,
    hydrationLiters: 3.2,
    notes: 'Seguiu tapioca com chia no café e shake de amendoim à tarde.'
  }
];

export const INITIAL_READINESS_LOGS: ReadinessCheck[] = [
  {
    id: 'read-sample-1',
    date: '2026-10-15',
    sleepHours: 7.5,
    jointSoreness: 2,
    energyLevel: 4,
    lumbarNeckStatus: 'NORMAL',
    notes: 'Boa recuperação após pilates de ontem.'
  }
];
