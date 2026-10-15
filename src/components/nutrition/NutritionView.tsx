import React, { useState } from 'react';
import { Apple, Droplets, Check, ShoppingCart, ChevronRight, Sparkles, Plus, Minus, Info } from 'lucide-react';
import { DailyNutrition, NutritionProtocolType } from '../../types';
import { ALINE_MARINHO_PLANS } from '../../data/alineMarinhoPlan';
import { formatDisplayDate } from '../../hooks/useDailySchedule';

interface NutritionViewProps {
  selectedDate: string;
  nutritionLog?: DailyNutrition;
  defaultProtocol: NutritionProtocolType;
  onSaveNutrition: (log: DailyNutrition) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  selectedDate,
  nutritionLog,
  defaultProtocol,
  onSaveNutrition
}) => {
  const currentProtocol = nutritionLog?.protocolType || defaultProtocol;
  const [protocolType, setProtocolType] = useState<NutritionProtocolType>(currentProtocol);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const plan = ALINE_MARINHO_PLANS[protocolType];

  const [breakfastDone, setBreakfastDone] = useState(nutritionLog?.breakfastDone || false);
  const [snackAmDone, setSnackAmDone] = useState(nutritionLog?.snackAmDone || false);
  const [lunchDone, setLunchDone] = useState(nutritionLog?.lunchDone || false);
  const [snackPmDone, setSnackPmDone] = useState(nutritionLog?.snackPmDone || false);
  const [dinnerDone, setDinnerDone] = useState(nutritionLog?.dinnerDone || false);
  const [hydrationLiters, setHydrationLiters] = useState(nutritionLog?.hydrationLiters || 2.5);

  const totalMeals = 5;
  const completedCount = [breakfastDone, snackAmDone, lunchDone, snackPmDone, dinnerDone].filter(Boolean).length;
  const adherencePercent = Math.round((completedCount / totalMeals) * 100);

  const handleUpdateMeal = (mealKey: string, currentVal: boolean) => {
    let b = breakfastDone;
    let sa = snackAmDone;
    let l = lunchDone;
    let sp = snackPmDone;
    let d = dinnerDone;

    if (mealKey === 'breakfast') b = !currentVal;
    if (mealKey === 'snackAm') sa = !currentVal;
    if (mealKey === 'lunch') l = !currentVal;
    if (mealKey === 'snackPm') sp = !currentVal;
    if (mealKey === 'dinner') d = !currentVal;

    setBreakfastDone(b);
    setSnackAmDone(sa);
    setLunchDone(l);
    setSnackPmDone(sp);
    setDinnerDone(d);

    const updated: DailyNutrition = {
      id: nutritionLog?.id || `nutr-${Date.now()}`,
      date: selectedDate,
      protocolType,
      targetKcal: plan.totalKcal,
      targetCarbsG: plan.carbsG,
      targetProteinG: plan.proteinsG,
      targetFatG: plan.fatsG,
      breakfastDone: b,
      snackAmDone: sa,
      lunchDone: l,
      snackPmDone: sp,
      dinnerDone: d,
      hydrationLiters,
      notes: nutritionLog?.notes || ''
    };
    onSaveNutrition(updated);
  };

  const handleAdjustHydration = (delta: number) => {
    const nextVal = Math.max(0, Math.round((hydrationLiters + delta) * 10) / 10);
    setHydrationLiters(nextVal);
    const updated: DailyNutrition = {
      id: nutritionLog?.id || `nutr-${Date.now()}`,
      date: selectedDate,
      protocolType,
      targetKcal: plan.totalKcal,
      targetCarbsG: plan.carbsG,
      targetProteinG: plan.proteinsG,
      targetFatG: plan.fatsG,
      breakfastDone,
      snackAmDone,
      lunchDone,
      snackPmDone,
      dinnerDone,
      hydrationLiters: nextVal,
      notes: nutritionLog?.notes || ''
    };
    onSaveNutrition(updated);
  };

  const mealsList = [
    { key: 'breakfast', done: breakfastDone, data: plan.meals.breakfast },
    { key: 'snackAm', done: snackAmDone, data: plan.meals.snackAm },
    { key: 'lunch', done: lunchDone, data: plan.meals.lunch },
    { key: 'snackPm', done: snackPmDone, data: plan.meals.snackPm },
    { key: 'dinner', done: dinnerDone, data: plan.meals.dinner },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner & Protocol Switcher */}
      <div className="bg-gradient-to-br from-tatame-card to-emerald-950/30 border border-tatame-border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Nutricionista Aline Marinho
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">{plan.title}</h2>
            </div>
          </div>

          <button
            onClick={() => setShowShoppingList(true)}
            className="p-2 text-gray-300 hover:text-white bg-tatame-bg border border-tatame-border rounded-xl text-xs flex items-center gap-1.5"
            title="Lista de Compras"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] hidden sm:inline">Compras</span>
          </button>
        </div>

        {/* Toggle between protocols */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-tatame-border/60">
          <button
            onClick={() => setProtocolType('DIAS_COM_BJJ')}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              protocolType === 'DIAS_COM_BJJ'
                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500 shadow-sm'
                : 'bg-tatame-bg text-gray-400 border-tatame-border'
            }`}
          >
            Dias com Jiu-Jitsu (1.702 kcal)
          </button>
          <button
            onClick={() => setProtocolType('DIAS_SEM_BJJ')}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              protocolType === 'DIAS_SEM_BJJ'
                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500 shadow-sm'
                : 'bg-tatame-bg text-gray-400 border-tatame-border'
            }`}
          >
            Dias sem BJJ (1.598 kcal)
          </button>
        </div>

        {/* Target Macros Breakdown */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-tatame-border/60 text-center">
          <div className="bg-tatame-bg/80 rounded-xl p-2 border border-tatame-border/50">
            <span className="text-[10px] text-tatame-muted block">Calorias</span>
            <span className="text-xs font-extrabold text-white">{plan.totalKcal} kcal</span>
          </div>
          <div className="bg-tatame-bg/80 rounded-xl p-2 border border-tatame-border/50">
            <span className="text-[10px] text-tatame-muted block">Carbo</span>
            <span className="text-xs font-extrabold text-blue-400">{plan.carbsG}g</span>
          </div>
          <div className="bg-tatame-bg/80 rounded-xl p-2 border border-tatame-border/50">
            <span className="text-[10px] text-tatame-muted block">Proteína</span>
            <span className="text-xs font-extrabold text-purple-400">{plan.proteinsG}g</span>
          </div>
          <div className="bg-tatame-bg/80 rounded-xl p-2 border border-tatame-border/50">
            <span className="text-[10px] text-tatame-muted block">Lipídeos</span>
            <span className="text-xs font-extrabold text-amber-400">{plan.fatsG}g</span>
          </div>
        </div>

        {/* Adherence progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-gray-300 font-medium">Adesão Alimentar Hoje:</span>
            <span className="font-bold text-emerald-400">{completedCount} de {totalMeals} refeições ({adherencePercent}%)</span>
          </div>
          <div className="w-full h-2 bg-tatame-bg rounded-full overflow-hidden border border-tatame-border">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-purple-600 transition-all duration-300"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-tatame-card border border-tatame-border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Hidratação do Atleta</h3>
              <p className="text-[10px] text-tatame-muted">Meta: 3.5 Litros (recuperação articular de tatame)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-blue-400">{hydrationLiters.toFixed(1)} L</span>
            <span className="text-[10px] text-tatame-muted block">/ 3.5 L</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={() => handleAdjustHydration(-0.25)}
            className="p-2 rounded-xl bg-tatame-bg border border-tatame-border text-gray-400 hover:text-white"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1 grid grid-cols-3 gap-1.5">
            {[0.25, 0.5, 1.0].map((amount) => (
              <button
                key={amount}
                onClick={() => handleAdjustHydration(amount)}
                className="py-1.5 text-xs font-semibold rounded-lg bg-blue-950/60 border border-blue-800 text-blue-200 hover:bg-blue-900/60 transition-colors"
              >
                +{amount * 1000}ml
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAdjustHydration(0.25)}
            className="p-2 rounded-xl bg-tatame-bg border border-tatame-border text-gray-400 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meals Check-in List (Checkboxes Rápidos <10s) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          Refeições do Dia • Check-in Rápido
        </h3>

        {mealsList.map(({ key, done, data }) => {
          const isExpanded = expandedMeal === key;

          return (
            <div
              key={key}
              className={`rounded-2xl border transition-all ${
                done
                  ? 'bg-tatame-card/70 border-emerald-600/50'
                  : 'bg-tatame-card border-tatame-border hover:border-gray-600'
              }`}
            >
              <div className="p-3.5 flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateMeal(key, done);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      done
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                        : 'border-gray-600 bg-tatame-bg'
                    }`}
                  >
                    {done && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800/60">
                        {data.time}
                      </span>
                      <span className={`text-xs font-bold ${done ? 'text-gray-300 line-through' : 'text-white'}`}>
                        {data.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-tatame-muted mt-0.5 line-clamp-1">
                      {data.options[0]}
                    </p>
                  </div>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {data.kcal} kcal
                  </span>
                  <button
                    onClick={() => setExpandedMeal(isExpanded ? null : key)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded details with options from Aline Marinho */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-tatame-border/60 text-xs space-y-2 animate-in fade-in">
                  <div className="text-tatame-muted text-[11px] italic">
                    {data.description}
                  </div>
                  <div className="space-y-1.5 bg-tatame-bg/90 p-3 rounded-xl border border-tatame-border/70">
                    <span className="font-bold text-emerald-400 text-[11px] block">
                      Opções e Porções Prescritas:
                    </span>
                    {data.options.map((opt, i) => (
                      <div key={i} className="text-gray-200 text-[11px] flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  {data.tips && (
                    <p className="text-[10px] text-purple-300 bg-purple-950/50 p-2 rounded-lg border border-purple-800/40">
                      💡 {data.tips}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-tatame-card border border-tatame-border rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-tatame-border">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Lista de Compras da Dieta</h3>
              </div>
              <button
                onClick={() => setShowShoppingList(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {plan.shoppingList.map((cat, idx) => (
                <div key={idx} className="bg-tatame-bg rounded-xl p-3 border border-tatame-border/70">
                  <h4 className="text-xs font-bold text-purple-400 mb-2">{cat.category}</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.items.map((item, i) => (
                      <span key={i} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowShoppingList(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
            >
              Fechar Lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
