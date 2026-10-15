import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, CheckCircle2, Info, Sparkles, AlertTriangle, Footprints, HeartPulse, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { ConditioningSession, ConditioningType } from '../../types';
import { SAMUEL_SARAIVA_WEEKS, SAMUEL_SARAIVA_GUIDELINES } from '../../data/samuelSaraivaPlan';
import { formatDisplayDate } from '../../hooks/useDailySchedule';

interface ConditioningViewProps {
  selectedDate: string;
  sessions: ConditioningSession[];
  onSaveSession: (session: ConditioningSession) => void;
}

export const ConditioningView: React.FC<ConditioningViewProps> = ({
  selectedDate,
  sessions,
  onSaveSession
}) => {
  const existingSession = sessions.find((s) => s.date === selectedDate);

  const [activeTab, setActiveTab] = useState<'saraiva' | 'pilates'>('saraiva');
  const [weekCycle, setWeekCycle] = useState<number>(existingSession?.weekCycle || 1);
  const [selectedWorkout, setSelectedWorkout] = useState<'treinoA' | 'treinoB'>(
    existingSession?.type === 'SC_TREINO_B' ? 'treinoB' : 'treinoA'
  );
  const [barefootConfirmed, setBarefootConfirmed] = useState(existingSession?.barefootConfirmed ?? true);
  const [cadenceAdherence, setCadenceAdherence] = useState(existingSession?.cadenceAdherence ?? true);
  const [pseAverage, setPseAverage] = useState(existingSession?.pseAverage || 7);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    if (existingSession?.exercises) {
      const map: Record<string, boolean> = {};
      existingSession.exercises.forEach((ex) => {
        if (ex.completed) map[ex.id] = true;
      });
      return map;
    }
    return {};
  });
  const [notes, setNotes] = useState(existingSession?.notes || '');
  const [showCadenceInfo, setShowCadenceInfo] = useState(false);

  // Pilates state
  const [pilatesStatus, setPilatesStatus] = useState<'ATTENDED' | 'SKIPPED' | 'PASSIVE_REST'>(
    existingSession?.attendanceStatus || 'ATTENDED'
  );
  const [decompressionImpact, setDecompressionImpact] = useState<'HIGH' | 'MODERATE' | 'LOW'>(
    existingSession?.decompressionImpact || 'HIGH'
  );

  const workoutData = SAMUEL_SARAIVA_WEEKS[weekCycle] || SAMUEL_SARAIVA_WEEKS[1];
  const exercises = selectedWorkout === 'treinoA' ? workoutData.treinoA : workoutData.treinoB;

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveSaraiva = () => {
    const session: ConditioningSession = {
      id: existingSession?.id || `cond-${Date.now()}`,
      date: selectedDate,
      type: selectedWorkout === 'treinoA' ? 'SC_TREINO_A' : 'SC_TREINO_B',
      weekCycle,
      completed: true,
      cadenceAdherence,
      pseAverage,
      barefootConfirmed,
      notes,
      exercises: exercises.map((ex) => ({
        ...ex,
        completed: !!completedExercises[ex.id]
      }))
    };
    onSaveSession(session);
  };

  const handleSavePilates = () => {
    const session: ConditioningSession = {
      id: existingSession?.id || `cond-pilates-${Date.now()}`,
      date: selectedDate,
      type: 'PILATES_18H',
      weekCycle,
      completed: pilatesStatus === 'ATTENDED',
      attendanceStatus: pilatesStatus,
      decompressionImpact,
      cadenceAdherence: true,
      pseAverage: 4,
      barefootConfirmed: true,
      notes: notes || 'Sessão de Pilates 18h com foco em descompressão articular.'
    };
    onSaveSession(session);
  };

  const isHighPseWarning = pseAverage >= 9;

  return (
    <div className="space-y-4 pb-20">
      {/* Tab Switcher: Samuel Saraiva S&C vs Pilates 18:00 */}
      <div className="flex bg-tatame-card border border-tatame-border rounded-xl p-1">
        <button
          onClick={() => setActiveTab('saraiva')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'saraiva'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Musculação S&C (Saraiva)</span>
        </button>
        <button
          onClick={() => setActiveTab('pilates')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'pilates'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Pilates 18:00 (Mirele)</span>
        </button>
      </div>

      {activeTab === 'saraiva' ? (
        <div className="space-y-4">
          {/* Header Card Protocolo Samuel Saraiva */}
          <div className="bg-gradient-to-br from-tatame-card to-purple-950/40 border border-tatame-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Protocolo Oficial Samuel Saraiva
                </span>
                <h2 className="text-base font-bold text-white mt-1">Treino de Força para Jiu-Jitsu</h2>
                <p className="text-xs text-tatame-muted">Força funcional transferível pro tatame • 6 Semanas</p>
              </div>
              <button
                onClick={() => setShowCadenceInfo(!showCadenceInfo)}
                className="p-2 text-gray-400 hover:text-purple-300 rounded-lg bg-tatame-bg border border-tatame-border text-xs flex items-center gap-1"
                title="Guia de Cadência e Diretrizes"
              >
                <Info className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] hidden sm:inline">Guia</span>
              </button>
            </div>

            {/* Cadence Info Collapsible */}
            {showCadenceInfo && (
              <div className="mt-3 p-3 bg-tatame-bg/90 rounded-xl border border-tatame-border/70 text-xs text-gray-300 space-y-2 animate-in fade-in">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Como ler as Cadências (Ex: 2011, 20X1, 1010):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-purple-400 font-semibold">1º dígito:</span> Fase Excêntrica (descida/alongamento)
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">2º dígito:</span> Transição no ponto de estiramento
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">3º dígito:</span> Fase Concêntrica (subida; X = explosão máxima)
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">4º dígito:</span> Transição final no topo
                  </div>
                </div>
                <p className="text-[10px] text-tatame-muted italic pt-1 border-t border-tatame-border/50">
                  Diretriz chave: Treinar descalço sempre que possível para ativar a base dos pés.
                </p>
              </div>
            )}

            {/* Week Cycle & Workout Switcher */}
            <div className="mt-4 space-y-3 pt-3 border-t border-tatame-border/60">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1.5">
                  Ciclo Atual (Semanas 1 a 6):
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeekCycle(w)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        weekCycle === w
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-tatame-bg text-gray-400 border-tatame-border hover:text-white'
                      }`}
                    >
                      Sem {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedWorkout('treinoA')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedWorkout === 'treinoA'
                      ? 'bg-purple-900/60 text-purple-200 border-purple-500 shadow-sm'
                      : 'bg-tatame-bg text-gray-400 border-tatame-border hover:text-white'
                  }`}
                >
                  Treino A (Empurrar / Dominância Joelho)
                </button>
                <button
                  onClick={() => setSelectedWorkout('treinoB')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedWorkout === 'treinoB'
                      ? 'bg-purple-900/60 text-purple-200 border-purple-500 shadow-sm'
                      : 'bg-tatame-bg text-gray-400 border-tatame-border hover:text-white'
                  }`}
                >
                  Treino B (Puxar / Cadeia Posterior)
                </button>
              </div>
            </div>
          </div>

          {/* TRAVA DE SEGURANÇA: Aviso Visual se PSE >= 9 */}
          {isHighPseWarning && (
            <div className="bg-red-950/70 border-2 border-red-500 rounded-2xl p-4 animate-bounce-short">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-200 uppercase tracking-wide">
                    ⚠️ TRAVA DE SEGURANÇA: PSE {pseAverage}/10 NA MUSCULAÇÃO
                  </h4>
                  <p className="text-xs text-red-300 mt-1 leading-relaxed">
                    <strong>Atenção Atleta:</strong> Intensidade máxima (PSE 9 ou 10) é reservada exclusivamente ao <strong>tatame de Jiu-Jitsu</strong>. Levar a musculação até a falha gera fadiga do sistema nervoso central e sobrecarrega articulações, comprometendo os rolas do meio-dia. Reduza as cargas e mantenha a intensidade no teto de PSE 8.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Exercise List by Blocks (Blocos Conjugados de 3) */}
          <div className="space-y-4">
            {[1, 2, 3].map((blockNum) => {
              const blockExercises = exercises.filter((ex) => ex.block === blockNum);
              const blockTitle = 
                blockNum === 1 ? 'Bloco 1: Mobilidade & Ativação' :
                blockNum === 2 ? 'Bloco 2: Força Principal' :
                'Bloco 3: Core & Tracionamento Funcional';

              return (
                <div key={blockNum} className="bg-tatame-card border border-tatame-border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-tatame-border/60">
                    <span className="text-xs font-bold text-purple-300">{blockTitle}</span>
                    <span className="text-[10px] text-tatame-muted bg-tatame-bg px-2 py-0.5 rounded border border-tatame-border">
                      3 Exercícios Conjugados
                    </span>
                  </div>

                  <div className="space-y-2">
                    {blockExercises.map((ex) => {
                      const isDone = !!completedExercises[ex.id];

                      return (
                        <div
                          key={ex.id}
                          onClick={() => toggleExercise(ex.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                            isDone
                              ? 'bg-purple-950/30 border-purple-600/70 text-gray-200'
                              : 'bg-tatame-bg/90 border-tatame-border/80 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isDone
                                ? 'bg-purple-600 border-purple-500 text-white'
                                : 'border-gray-600 bg-tatame-card'
                            }`}>
                              {isDone && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{ex.name}</span>
                                {ex.notes && (
                                  <span className="text-[10px] font-normal text-tatame-muted">
                                    ({ex.notes})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1">
                                <span className="bg-tatame-card px-1.5 py-0.5 rounded border border-tatame-border/50 text-gray-300">
                                  {ex.sets} séries × {ex.reps}
                                </span>
                                <span className="text-purple-300 font-mono">
                                  Cad: {ex.cadence}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-1.5 py-0.5 rounded">
                              PSE Alvo {ex.targetPse}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diretrizes & Check de Execução */}
          <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-300">Validações do Protocolo</h3>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2.5 rounded-xl bg-tatame-bg border border-tatame-border/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={barefootConfirmed}
                  onChange={(e) => setBarefootConfirmed(e.target.checked)}
                  className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 w-4 h-4 bg-tatame-card"
                />
                <div className="text-xs">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-purple-400" />
                    Treino Realizado Descalço
                  </span>
                  <span className="text-[10px] text-tatame-muted block">
                    Ativação dos pés e arco plantar, transferível para o tatame.
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-2.5 rounded-xl bg-tatame-bg border border-tatame-border/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cadenceAdherence}
                  onChange={(e) => setCadenceAdherence(e.target.checked)}
                  className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 w-4 h-4 bg-tatame-card"
                />
                <div className="text-xs">
                  <span className="font-bold text-white">Cadências Excêntrica/Concêntrica Respeitadas</span>
                  <span className="text-[10px] text-tatame-muted block">
                    Sem pressa e sem roubar com impulso balístico.
                  </span>
                </div>
              </label>
            </div>

            {/* PSE Geral Médio */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-300">
                  PSE Médio do Treino de Força
                </label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  pseAverage >= 9
                    ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  PSE {pseAverage}/10 {pseAverage >= 9 ? '⚠️ Alto Demais' : '✓ Zona Ideal'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={pseAverage}
                onChange={(e) => setPseAverage(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-tatame-bg rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-tatame-muted mt-1">
                <span>Leve (1-4)</span>
                <span>Alvo S&C (7-8)</span>
                <span className="text-red-400 font-bold">Tatame Only (9-10)</span>
              </div>
            </div>

            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas de carga: ex: Goblet com 26kg; Deadlift sem desconforto lombar..."
              className="w-full bg-tatame-bg border border-tatame-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={handleSaveSaraiva}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Treino de Força ({selectedWorkout === 'treinoA' ? 'Treino A' : 'Treino B'})</span>
            </button>
          </div>
        </div>
      ) : (
        /* PILATES MODULE (Prof. Mirele - 18:00) */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-tatame-card to-blue-950/30 border border-tatame-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Prehab & Descompressão
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">Pilates das 18:00 (Prof. Mirele)</h2>
                <p className="text-xs text-tatame-muted">Mobilidade de quadril, estabilidade de core e alívio espinhal</p>
              </div>
            </div>

            {/* Presença Binária */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Status de Presença no Pilates:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ATTENDED', label: 'Compareceu', desc: 'Sessão completa' },
                  { id: 'SKIPPED', label: 'Pulou', desc: 'Falta no estúdio' },
                  { id: 'PASSIVE_REST', label: 'Descanso', desc: 'Passivo programado' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPilatesStatus(item.id as any)}
                    className={`py-3 px-2 text-center rounded-xl border text-xs transition-all ${
                      pilatesStatus === item.id
                        ? 'bg-blue-950/80 border-blue-500 text-white font-bold shadow-md'
                        : 'bg-tatame-bg border-tatame-border text-gray-400 hover:text-white'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-tatame-muted font-normal mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Impacto na Descompressão Lombar / Torácica */}
            {pilatesStatus === 'ATTENDED' && (
              <div className="space-y-2 pt-2 border-t border-tatame-border/60">
                <label className="text-xs font-semibold text-gray-300 block">
                  Impacto na Descompressão Lombar e Torácica:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'HIGH', label: 'Alívio Alto', desc: 'Coluna leve e solta' },
                    { id: 'MODERATE', label: 'Moderado', desc: 'Melhora padrão' },
                    { id: 'LOW', label: 'Baixo / Rígido', desc: 'Ainda com tensão' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setDecompressionImpact(lvl.id as any)}
                      className={`py-2 px-2 text-center rounded-xl border text-xs transition-all ${
                        decompressionImpact === lvl.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                          : 'bg-tatame-bg border-tatame-border text-gray-400'
                      }`}
                    >
                      <div>{lvl.label}</div>
                      <div className="text-[10px] text-tatame-muted font-normal">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações da sessão de Pilates: ajustes do reformer, abertura de quadril..."
              className="w-full bg-tatame-bg border border-tatame-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSavePilates}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Check-in Pilates</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
