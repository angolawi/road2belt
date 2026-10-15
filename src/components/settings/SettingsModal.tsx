import React, { useState } from 'react';
import { X, User, Bell, Award, Calendar, Check, Flame, Dumbbell, HeartPulse, Clock, Sparkles } from 'lucide-react';
import { UserProfile, WeeklyScheduleConfig, BJJBeltColor, BJJ_BELT_METAS } from '../../types';
import { DEFAULT_SCHEDULE_CONFIG } from '../../data/defaultData';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (user: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser
}) => {
  if (!isOpen) return null;

  const currentConfig = user.scheduleConfig || DEFAULT_SCHEDULE_CONFIG;

  const [name, setName] = useState(user.name);
  const [targetDate, setTargetDate] = useState(user.targetDate);

  // Faixa Atual e Próxima
  const [currentBeltColor, setCurrentBeltColor] = useState<BJJBeltColor>(user.currentBeltColor || 'BLUE');
  const [currentDegrees, setCurrentDegrees] = useState<number>(user.currentDegrees ?? 4);
  const [targetBeltColor, setTargetBeltColor] = useState<BJJBeltColor>(user.targetBeltColor || 'PURPLE');
  const [targetDegrees, setTargetDegrees] = useState<number>(user.targetDegrees ?? 0);

  // Configuração semanal dos 3 pilares
  const [bjjDays, setBjjDays] = useState<number[]>(currentConfig.bjjDays);
  const [conditioningDays, setConditioningDays] = useState<number[]>(currentConfig.conditioningDays);
  const [pilatesDays, setPilatesDays] = useState<number[]>(currentConfig.pilatesDays);
  const [bjjDefaultTime, setBjjDefaultTime] = useState<string>(currentConfig.bjjDefaultTime || '12:00');
  const [pilatesDefaultTime, setPilatesDefaultTime] = useState<string>(currentConfig.pilatesDefaultTime || '18:00');

  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const daysList = [
    { id: 1, label: 'Seg', name: 'Segunda' },
    { id: 2, label: 'Ter', name: 'Terça' },
    { id: 3, label: 'Qua', name: 'Quarta' },
    { id: 4, label: 'Qui', name: 'Quinta' },
    { id: 5, label: 'Sex', name: 'Sexta' },
    { id: 6, label: 'Sáb', name: 'Sábado' },
    { id: 0, label: 'Dom', name: 'Domingo' },
  ];

  const availableBelts: { id: BJJBeltColor; label: string; icon: string }[] = [
    { id: 'WHITE', label: 'Branca', icon: '⚪' },
    { id: 'BLUE', label: 'Azul', icon: '🔵' },
    { id: 'PURPLE', label: 'Roxa', icon: '🟣' },
    { id: 'BROWN', label: 'Marrom', icon: '🟤' },
    { id: 'BLACK', label: 'Preta', icon: '⚫' },
  ];

  const formatRankTitle = (color: BJJBeltColor, deg: number) => {
    const meta = BJJ_BELT_METAS[color] || BJJ_BELT_METAS.PURPLE;
    if (deg === 0) return meta.name;
    return `${meta.name} ${deg}º Grau`;
  };

  const toggleDay = (currentList: number[], dayId: number, setter: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (currentList.includes(dayId)) {
      setter(currentList.filter(d => d !== dayId));
    } else {
      setter([...currentList, dayId].sort((a, b) => a - b));
    }
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotificationStatus(res);
      if (res === 'granted') {
        new Notification("Road2Belt", {
          body: `Lembretes configurados para ${bjjDefaultTime} (BJJ) e ${pilatesDefaultTime} (Pilates).`,
          icon: "/favicon.svg"
        });
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: WeeklyScheduleConfig = {
      bjjDays,
      conditioningDays,
      pilatesDays,
      bjjDefaultTime,
      pilatesDefaultTime
    };

    onSaveUser({
      ...user,
      name,
      currentRank: formatRankTitle(currentBeltColor, currentDegrees),
      targetRank: formatRankTitle(targetBeltColor, targetDegrees),
      currentBeltColor,
      currentDegrees,
      targetBeltColor,
      targetDegrees,
      targetDate,
      scheduleConfig: updatedConfig
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-tatame-card border border-tatame-border rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
        <div className="sticky top-0 bg-tatame-card/95 backdrop-blur-md pb-3 border-b border-tatame-border flex items-center justify-between z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurações do Atleta</h3>
              <p className="text-xs text-tatame-muted">Graduações, rotina e metas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* SEÇÃO 1: SELETOR DE GRADUAÇÃO (ATUAL E PRÓXIMA) */}
          <div className="bg-tatame-bg/90 rounded-2xl p-4 border border-tatame-border/80 space-y-4">
            <div className="flex items-center justify-between border-b border-tatame-border/60 pb-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Graduação do Jiu-Jitsu (Road to Belt)
              </span>
              <span className="text-[10px] text-tatame-muted">Agnóstico de Faixa</span>
            </div>

            {/* 1.1 Graduação Atual */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white">
                  Sua Graduação Atual:
                </label>
                <BJJBeltBadge color={currentBeltColor} degrees={currentDegrees} size="sm" showLabel />
              </div>

              {/* Botões de Cores de Faixa */}
              <div className="grid grid-cols-5 gap-1.5">
                {availableBelts.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setCurrentBeltColor(b.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      currentBeltColor === b.id
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-sm ring-1 ring-purple-400'
                        : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span className="text-[10px]">{b.label}</span>
                  </button>
                ))}
              </div>

              {/* Seletor de Graus Atuais */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-tatame-muted font-semibold">Graus na Faixa:</span>
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4].map((deg) => (
                    <button
                      type="button"
                      key={deg}
                      onClick={() => setCurrentDegrees(deg)}
                      className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                        currentDegrees === deg
                          ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                          : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {deg} {deg === 1 ? 'grau' : 'graus'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1.2 Próxima Graduação (Alvo) */}
            <div className="space-y-2 pt-3 border-t border-tatame-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Próxima Graduação (Alvo):</span>
                </label>
                <BJJBeltBadge color={targetBeltColor} degrees={targetDegrees} size="sm" showLabel />
              </div>

              {/* Botões de Cores da Faixa Alvo */}
              <div className="grid grid-cols-5 gap-1.5">
                {availableBelts.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setTargetBeltColor(b.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      targetBeltColor === b.id
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-sm ring-1 ring-purple-400'
                        : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span className="text-[10px]">{b.label}</span>
                  </button>
                ))}
              </div>

              {/* Seletor de Graus Alvo */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-tatame-muted font-semibold">Grau Alvo:</span>
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4].map((deg) => (
                    <button
                      type="button"
                      key={deg}
                      onClick={() => setTargetDegrees(deg)}
                      className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                        targetDegrees === deg
                          ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                          : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {deg} {deg === 1 ? 'grau' : 'graus'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Preview das Duas Faixas Lado a Lado */}
            <div className="p-3 bg-tatame-card rounded-xl border border-tatame-border/70 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-tatame-muted block mb-1">Atual</span>
                <BJJBeltBadge color={currentBeltColor} degrees={currentDegrees} size="md" />
                <span className="text-[10px] font-bold text-gray-300 block mt-1">
                  {formatRankTitle(currentBeltColor, currentDegrees)}
                </span>
              </div>
              <span className="text-purple-400 font-black text-sm">➔</span>
              <div>
                <span className="text-[10px] text-tatame-muted block mb-1">Objetivo</span>
                <BJJBeltBadge color={targetBeltColor} degrees={targetDegrees} size="md" />
                <span className="text-[10px] font-bold text-purple-300 block mt-1">
                  {formatRankTitle(targetBeltColor, targetDegrees)}
                </span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: GRADE SEMANAL CONFIGURÁVEL */}
          <div className="bg-tatame-bg/90 rounded-2xl p-4 border border-tatame-border/80 space-y-4">
            <div className="flex items-center justify-between border-b border-tatame-border/60 pb-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Grade Semanal dos 3 Pilares
              </span>
              <span className="text-[10px] text-tatame-muted">Dias e Horários</span>
            </div>

            {/* 2.1 Dias de Jiu-Jitsu (Tatame) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>Jiu-Jitsu / Tatame ({bjjDays.length}x na semana)</span>
                </label>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <input
                    type="time"
                    value={bjjDefaultTime}
                    onChange={(e) => setBjjDefaultTime(e.target.value)}
                    className="bg-tatame-card border border-tatame-border text-[11px] text-purple-200 px-1.5 py-0.5 rounded font-mono"
                    title="Horário padrão do BJJ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysList.map((day) => {
                  const isChecked = bjjDays.includes(day.id);
                  return (
                    <button
                      type="button"
                      key={day.id}
                      onClick={() => toggleDay(bjjDays, day.id, setBjjDays)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/30'
                          : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2.2 Dias de Musculação / S&C (Samuel Saraiva) */}
            <div className="space-y-2 pt-2 border-t border-tatame-border/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-blue-400" />
                  <span>Musculação S&C Saraiva ({conditioningDays.length}x na semana)</span>
                </label>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysList.map((day) => {
                  const isChecked = conditioningDays.includes(day.id);
                  return (
                    <button
                      type="button"
                      key={day.id}
                      onClick={() => toggleDay(conditioningDays, day.id, setConditioningDays)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/30'
                          : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2.3 Dias de Pilates (Prof. Mirele) */}
            <div className="space-y-2 pt-2 border-t border-tatame-border/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                  <span>Pilates / Prehab ({pilatesDays.length}x na semana)</span>
                </label>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <input
                    type="time"
                    value={pilatesDefaultTime}
                    onChange={(e) => setPilatesDefaultTime(e.target.value)}
                    className="bg-tatame-card border border-tatame-border text-[11px] text-emerald-200 px-1.5 py-0.5 rounded font-mono"
                    title="Horário padrão do Pilates"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysList.map((day) => {
                  const isChecked = pilatesDays.includes(day.id);
                  return (
                    <button
                      type="button"
                      key={day.id}
                      onClick={() => toggleDay(pilatesDays, day.id, setPilatesDays)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                          : 'bg-tatame-card border-tatame-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: DADOS DO ATLETA & DATA ALVO */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Nome do Atleta
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-tatame-bg border border-tatame-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Data-Alvo da Graduação ({formatRankTitle(targetBeltColor, targetDegrees)})
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-tatame-bg border border-tatame-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Notificações PWA */}
          <div className="bg-tatame-bg/90 rounded-xl p-3 border border-tatame-border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">Lembretes Automáticos</span>
                <span className="text-[10px] text-tatame-muted">
                  Aviso para {bjjDefaultTime} (BJJ) e {pilatesDefaultTime} (Pilates)
                </span>
              </div>
            </div>
            {notificationStatus === 'granted' ? (
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold">
                Ativado ✓
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestNotification}
                className="text-[11px] bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded-lg font-bold"
              >
                Permitir
              </button>
            )}
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-tatame-bg border border-tatame-border text-gray-400 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-900/40"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
