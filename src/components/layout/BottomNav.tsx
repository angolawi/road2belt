import React from 'react';
import { LayoutDashboard, Flame, Dumbbell, Apple, LineChart } from 'lucide-react';

export type TabType = 'today' | 'tatame' | 'conditioning' | 'nutrition' | 'kpis';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bjjTodayDone: boolean;
  nutritionPercentage: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  bjjTodayDone,
  nutritionPercentage
}) => {
  const tabs = [
    {
      id: 'today' as TabType,
      label: 'Hoje',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tatame' as TabType,
      label: 'Tatame',
      icon: Flame,
      badge: bjjTodayDone ? '✓' : null,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'conditioning' as TabType,
      label: 'Físico',
      icon: Dumbbell,
      badge: null
    },
    {
      id: 'nutrition' as TabType,
      label: 'Dieta',
      icon: Apple,
      badge: nutritionPercentage === 100 ? '100%' : `${nutritionPercentage}%`,
      badgeColor: nutritionPercentage >= 80 ? 'bg-purple-600' : 'bg-gray-700'
    },
    {
      id: 'kpis' as TabType,
      label: 'KPIs Faixa',
      icon: LineChart,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-tatame-bg/95 backdrop-blur-lg border-t border-tatame-border pb-[var(--safe-bottom)]">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-purple-400 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-purple-400' : ''}`} />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3.5 text-[9px] font-bold text-white px-1 rounded-full ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 ${isActive ? 'text-purple-300 font-bold' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5 shadow-sm shadow-purple-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
