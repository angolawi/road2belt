export type BJJArenaFocus = 
  | 'GUARD_RETENTION' 
  | 'PASSING' 
  | 'SUBMISSIONS' 
  | 'TAKEDOWN' 
  | 'SPARRING_ONLY';

export interface BJJSession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ex: "12:00"
  durationMinutes: number; // ex: 75
  focusArea: BJJArenaFocus;
  roundsRolled: number; // quantidade de rolas
  rpe: number; // 1 a 10 (Percepção Subjetiva de Esforço)
  techniqueNotes: string; // A-Game, raspagens/passagens executadas
  partnersFeedback: string; // observações qualitativas com graduados
  createdAt: string;
}

export type ConditioningType = 
  | 'PILATES_18H' 
  | 'SC_TREINO_A' 
  | 'SC_TREINO_B' 
  | 'REST';

export interface ExerciseDefinition {
  id: string;
  block: 1 | 2 | 3;
  name: string;
  sets: number;
  reps: string;
  cadence: string; // ex: "1011", "20X1", "4010"
  targetPse: number;
  notes?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface ConditioningSession {
  id: string;
  date: string;
  type: ConditioningType;
  weekCycle: number; // 1 a 6
  completed: boolean;
  cadenceAdherence: boolean;
  pseAverage: number; // 1 a 10 (alerta visual se >= 9 na musculação)
  attendanceStatus?: 'ATTENDED' | 'SKIPPED' | 'PASSIVE_REST'; // Pilates
  decompressionImpact?: 'HIGH' | 'MODERATE' | 'LOW'; // Pilates
  barefootConfirmed: boolean; // Treino descalço
  exercises?: ExerciseDefinition[];
  notes: string;
}

export type NutritionProtocolType = 'DIAS_COM_BJJ' | 'DIAS_SEM_BJJ';

export interface MealOption {
  description: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

export interface MealDetail {
  time: string;
  name: string;
  kcal: number;
  description: string;
  options: string[];
  tips?: string;
}

export interface DailyNutrition {
  id: string;
  date: string;
  protocolType: NutritionProtocolType;
  targetKcal: number;
  targetCarbsG: number;
  targetProteinG: number;
  targetFatG: number;
  breakfastDone: boolean;
  snackAmDone: boolean;
  lunchDone: boolean;
  snackPmDone: boolean;
  dinnerDone: boolean;
  hydrationLiters: number;
  notes?: string;
}

export interface ReadinessCheck {
  id: string;
  date: string;
  sleepHours: number;
  jointSoreness: number; // 1 a 5 (dedos, joelhos, coluna)
  energyLevel: number; // 1 a 5
  lumbarNeckStatus: 'OPTIMAL' | 'NORMAL' | 'STIFF' | 'PAIN';
  notes?: string;
}

export interface WeeklyScheduleConfig {
  bjjDays: number[]; // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  conditioningDays: number[]; // Dias de musculação / S&C
  pilatesDays: number[]; // Dias de Pilates
  bjjDefaultTime: string; // ex: "12:00"
  pilatesDefaultTime: string; // ex: "18:00"
}

export type BJJBeltColor = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';

export interface BJJBeltMeta {
  color: BJJBeltColor;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  hex: string;
  sleeveColor: 'BLACK' | 'RED';
}

export const BJJ_BELT_METAS: Record<BJJBeltColor, BJJBeltMeta> = {
  WHITE: {
    color: 'WHITE',
    name: 'Faixa Branca',
    bgClass: 'bg-slate-200',
    textClass: 'text-slate-900',
    borderClass: 'border-slate-300',
    hex: '#e2e8f0',
    sleeveColor: 'BLACK'
  },
  BLUE: {
    color: 'BLUE',
    name: 'Faixa Azul',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-200',
    borderClass: 'border-blue-500',
    hex: '#2563eb',
    sleeveColor: 'BLACK'
  },
  PURPLE: {
    color: 'PURPLE',
    name: 'Faixa Roxa',
    bgClass: 'bg-purple-700',
    textClass: 'text-purple-200',
    borderClass: 'border-purple-500',
    hex: '#7e22ce',
    sleeveColor: 'BLACK'
  },
  BROWN: {
    color: 'BROWN',
    name: 'Faixa Marrom',
    bgClass: 'bg-amber-900',
    textClass: 'text-amber-200',
    borderClass: 'border-amber-700',
    hex: '#78350f',
    sleeveColor: 'BLACK'
  },
  BLACK: {
    color: 'BLACK',
    name: 'Faixa Preta',
    bgClass: 'bg-neutral-950',
    textClass: 'text-neutral-100',
    borderClass: 'border-neutral-700',
    hex: '#0a0a0a',
    sleeveColor: 'RED'
  }
};

export interface UserProfile {
  id: string;
  name: string;
  currentRank: string;
  targetRank: string;
  currentBeltColor?: BJJBeltColor;
  currentDegrees?: number;
  targetBeltColor?: BJJBeltColor;
  targetDegrees?: number;
  targetDate: string;
  startDate: string;
  scheduleConfig?: WeeklyScheduleConfig;
}
