import React, { useState } from 'react';
import { X, Flame, Shield, Award, Clock, MessageSquare, Check, Sparkles } from 'lucide-react';
import { BJJSession, BJJArenaFocus } from '../../types';

interface BJJCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  existingSession?: BJJSession;
  onSaveSession: (session: BJJSession) => void;
}

export const BJJCheckinModal: React.FC<BJJCheckinModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  existingSession,
  onSaveSession
}) => {
  if (!isOpen) return null;

  const [startTime, setStartTime] = useState(existingSession?.startTime || '12:00');
  const [durationMinutes, setDurationMinutes] = useState(existingSession?.durationMinutes || 75);
  const [focusArea, setFocusArea] = useState<BJJArenaFocus>(existingSession?.focusArea || 'GUARD_RETENTION');
  const [roundsRolled, setRoundsRolled] = useState(existingSession?.roundsRolled || 6);
  const [rpe, setRpe] = useState(existingSession?.rpe || 8);
  const [techniqueNotes, setTechniqueNotes] = useState(existingSession?.techniqueNotes || '');
  const [partnersFeedback, setPartnersFeedback] = useState(existingSession?.partnersFeedback || '');

  const focusOptions: { id: BJJArenaFocus; label: string; desc: string }[] = [
    { id: 'GUARD_RETENTION', label: 'Guarda & Retenção', desc: 'De La Riva, Laço, Meia, Fechada' },
    { id: 'PASSING', label: 'Passagem de Guarda', desc: 'Toreando, Leg Drag, Smash Pass' },
    { id: 'SUBMISSIONS', label: 'Finalizações', desc: 'Triângulos, Armbars, Estrangulamentos' },
    { id: 'TAKEDOWN', label: 'Quedas & Wrestling', desc: 'Single/Double leg, Ippon, sprawl' },
    { id: 'SPARRING_ONLY', label: 'Rolas Intensos', desc: 'Volume e ritmo competitivo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session: BJJSession = {
      id: existingSession?.id || `bjj-${Date.now()}`,
      date: selectedDate,
      startTime,
      durationMinutes,
      focusArea,
      roundsRolled,
      rpe,
      techniqueNotes,
      partnersFeedback,
      createdAt: existingSession?.createdAt || new Date().toISOString()
    };
    onSaveSession(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-tatame-card border border-tatame-border rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-tatame-card/95 backdrop-blur-md px-5 py-4 border-b border-tatame-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Check-in Tatame (BJJ)</h2>
              <p className="text-xs text-tatame-muted">Treino 12:00 • Alinhamento Rumo à Roxa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-tatame-border/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Horário e Duração */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Início do Treino
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-tatame-bg border border-tatame-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Duração (minutos)
              </label>
              <div className="flex items-center space-x-1.5">
                {[60, 75, 90].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDurationMinutes(d)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      durationMinutes === d
                        ? 'bg-purple-900/60 text-purple-200 border-purple-500'
                        : 'bg-tatame-bg text-gray-400 border-tatame-border hover:border-gray-600'
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Volume de Rolas (Rounds Rolled) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Volume de Rolas (Sparring)
              </label>
              <span className="text-sm font-bold text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800">
                {roundsRolled} rolas {roundsRolled >= 6 ? '🔥 (Padrão Roxa)' : ''}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[3, 4, 5, 6, 7, 8, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRoundsRolled(num)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    roundsRolled === num
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40 scale-105'
                      : 'bg-tatame-bg text-gray-300 border-tatame-border hover:bg-tatame-border/40'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-tatame-muted mt-1.5">
              Meta Semanal: ≥18 a 24 rounds/semana (6 a 8 rolas por treino).
            </p>
          </div>

          {/* PSE / RPE Tatame (1 a 10) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-300">
                Intensidade / PSE (1 a 10)
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                rpe >= 9
                  ? 'bg-red-950/80 text-red-300 border-red-700'
                  : rpe >= 7
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                  : 'bg-blue-950/80 text-blue-300 border-blue-700'
              }`}>
                PSE {rpe}/10 • {rpe >= 9 ? 'Guerra / Exaustão' : rpe >= 7 ? 'Ritmo Forte' : 'Técnico / Suave'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-tatame-bg rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>1 (Leve)</span>
              <span>5 (Moderado)</span>
              <span>8 (Forte)</span>
              <span>10 (Exaustão)</span>
            </div>
          </div>

          {/* Foco Técnico do Dia */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Foco Técnico Principal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {focusOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFocusArea(opt.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    focusArea === opt.id
                      ? 'bg-purple-950/70 border-purple-500 text-white shadow-sm'
                      : 'bg-tatame-bg border-tatame-border text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{opt.label}</span>
                    {focusArea === opt.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div className="text-[10px] text-tatame-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notas do A-Game */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>A-Game & Ajustes Técnicos do Dia</span>
            </label>
            <textarea
              rows={2}
              value={techniqueNotes}
              onChange={(e) => setTechniqueNotes(e.target.value)}
              placeholder="Ex: Guarda De La Riva com raspagem de gancho; escape de montada com cotovelo firme..."
              className="w-full bg-tatame-bg border border-tatame-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Feedback dos Graduados */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Feedback dos Graduados / Faixas Roxas/Marrons/Pretas</span>
            </label>
            <textarea
              rows={2}
              value={partnersFeedback}
              onChange={(e) => setPartnersFeedback(e.target.value)}
              placeholder="Ex: Professor recomendou fechar o cotovelo antes de inverter; rola duro com faixa roxa..."
              className="w-full bg-tatame-bg border border-tatame-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold text-gray-400 bg-tatame-bg hover:bg-tatame-border/40 border border-tatame-border rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-900/50 flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Check-in BJJ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
