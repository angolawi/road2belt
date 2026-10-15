import { useMemo } from 'react';
import { NutritionProtocolType, ConditioningType, WeeklyScheduleConfig } from '../types';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const weekdayNames = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
  ];
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return `${weekdayNames[date.getDay()]}, ${day} de ${monthNames[date.getMonth()]}`;
}

export interface WeekDayInfo {
  dateStr: string;
  dayNum: number;
  weekdayShort: string;
  isBJJ: boolean;
  isPilates: boolean;
  isSC: boolean;
  isToday: boolean;
}

export function getWeekDays(referenceDateStr: string, scheduleConfig?: WeeklyScheduleConfig): WeekDayInfo[] {
  const [year, month, day] = referenceDateStr.split('-').map(Number);
  const refDate = new Date(year, month - 1, day);
  const dayOfWeek = refDate.getDay(); // 0 = Dom, 1 = Seg, ...
  
  // Distância para a segunda-feira da semana
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(year, month - 1, day + diffToMonday);

  const todayStr = getTodayString();
  const shortNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const bjjDays = scheduleConfig?.bjjDays ?? [1, 3, 5];
  const conditioningDays = scheduleConfig?.conditioningDays ?? [2, 4, 6];
  const pilatesDays = scheduleConfig?.pilatesDays ?? [3];

  const week: WeekDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const currentDayOfWeek = current.getDay();

    const isBJJ = bjjDays.includes(currentDayOfWeek);
    const isPilates = pilatesDays.includes(currentDayOfWeek);
    const isSC = conditioningDays.includes(currentDayOfWeek);

    week.push({
      dateStr,
      dayNum: current.getDate(),
      weekdayShort: shortNames[i],
      isBJJ,
      isPilates,
      isSC,
      isToday: dateStr === todayStr
    });
  }

  return week;
}

export function useDailySchedule(selectedDate: string, scheduleConfig?: WeeklyScheduleConfig) {
  return useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.

    const bjjDays = scheduleConfig?.bjjDays ?? [1, 3, 5];
    const conditioningDays = scheduleConfig?.conditioningDays ?? [2, 4, 6];
    const pilatesDays = scheduleConfig?.pilatesDays ?? [3];

    const isBJJDay = bjjDays.includes(dayOfWeek);
    const isSCStrengthDay = conditioningDays.includes(dayOfWeek);
    const isPilatesDay = pilatesDays.includes(dayOfWeek);

    const recommendedConditioningType: ConditioningType = (() => {
      if (isSCStrengthDay) {
        // Alterna Treino A e B conforme paridade ou dia
        return dayOfWeek === 4 ? 'SC_TREINO_B' : 'SC_TREINO_A';
      }
      if (isPilatesDay) {
        return 'PILATES_18H';
      }
      return 'REST';
    })();

    const defaultNutritionProtocol: NutritionProtocolType = isBJJDay ? 'DIAS_COM_BJJ' : 'DIAS_SEM_BJJ';

    return {
      dayOfWeek,
      isBJJDay,
      isSCStrengthDay,
      isPilatesDay,
      recommendedConditioningType,
      defaultNutritionProtocol,
      formattedDate: formatDisplayDate(selectedDate),
      bjjDefaultTime: scheduleConfig?.bjjDefaultTime || '12:00',
      pilatesDefaultTime: scheduleConfig?.pilatesDefaultTime || '18:00'
    };
  }, [selectedDate, scheduleConfig]);
}

