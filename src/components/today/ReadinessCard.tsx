import React from 'react';
import { Moon, Activity, Zap, Check, AlertCircle } from 'lucide-react';
import { ReadinessCheck } from '../../types';

interface ReadinessCardProps {
  readiness?: ReadinessCheck;
  onSaveReadiness: (readiness: ReadinessCheck) => void;
  selectedDate: string;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  readiness,
  onSaveReadiness,
  selectedDate
}) => {
  const sleepHours = readiness?.sleepHours ?? 7.5;
  const jointSoreness = readiness?.jointSoreness ?? 2;
  const energyLevel = readiness?.energyLevel ?? 4;
  const lumbarNeckStatus = readiness?.lumbarNeckStatus ?? 'NORMAL';

  const updateField = (field: keyof ReadinessCheck, value: any) => {
    const updated: ReadinessCheck = {
      id: readiness?.id || `read-${Date.now()}`,
      date: selectedDate,
      sleepHours,
      jointSoreness,
      energyLevel,
      lumbarNeckStatus,
      [field]: value
    };
    onSaveReadiness(updated);
  };

  const statusLabels = {
    OPTIMAL: { label: 'Ótimo', color: 'bg-emerald-950 border-emerald-500 text-emerald-300' },
    NORMAL: { label: 'Normal', color: 'bg-blue-950 border-blue-500 text-blue-300' },
    STIFF: { label: 'Rígido', color: 'bg-amber-950 border-amber-500 text-amber-300' },
    PAIN: { label: 'Com Dor', color: 'bg-red-950 border-red-500 text-red-300' },
  };

  return (
    <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4 space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-tatame-border/60">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Readiness & Recuperação Neural
          </h3>
        </div>
        <span className="text-[10px] text-tatame-muted bg-tatame-bg px-2 py-0.5 rounded border border-tatame-border">
          Prontidão p/ o Tatame
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Horas de Sono */}
        <div className="bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-blue-400" /> Sono
            </span>
            <span className="font-extrabold text-blue-400">{sleepHours}h</span>
          </div>
          <input
            type="range"
            min="4"
            max="10"
            step="0.5"
            value={sleepHours}
            onChange={(e) => updateField('sleepHours', Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-tatame-card rounded-lg mt-1"
          />
        </div>

        {/* Nível de Energia */}
        <div className="bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energia
            </span>
            <span className="font-extrabold text-amber-400">{energyLevel} / 5</span>
          </div>
          <div className="flex space-x-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => updateField('energyLevel', lvl)}
                className={`flex-1 py-1 text-[10px] font-bold rounded ${
                  energyLevel >= lvl
                    ? 'bg-amber-500 text-black'
                    : 'bg-tatame-card text-gray-500 border border-tatame-border'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dor Articular (dedos, coluna, joelhos) */}
      <div className="bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-300 font-semibold">
            Dor Articular (Dedos, Joelhos, Coluna)
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
            jointSoreness >= 4 ? 'bg-red-950 text-red-300 border border-red-700' :
            jointSoreness === 3 ? 'bg-amber-950 text-amber-300 border border-amber-700' :
            'bg-emerald-950 text-emerald-300 border border-emerald-700'
          }`}>
            Nível {jointSoreness} / 5 {jointSoreness <= 2 ? '(Normal/Leve)' : '(Atenção)'}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={jointSoreness}
          onChange={(e) => updateField('jointSoreness', Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer h-1.5 bg-tatame-card rounded-lg mt-1"
        />
      </div>

      {/* Status Lombar / Torácica / Pescoço */}
      <div>
        <label className="text-[11px] font-semibold text-gray-400 block mb-1.5">
          Estado da Coluna Lombar / Cervical:
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['OPTIMAL', 'NORMAL', 'STIFF', 'PAIN'] as const).map((st) => (
            <button
              key={st}
              onClick={() => updateField('lumbarNeckStatus', st)}
              className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-all ${
                lumbarNeckStatus === st
                  ? statusLabels[st].color
                  : 'bg-tatame-bg border-tatame-border text-gray-400 hover:text-white'
              }`}
            >
              {statusLabels[st].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
