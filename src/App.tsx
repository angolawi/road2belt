import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getTodayString, useDailySchedule } from './hooks/useDailySchedule';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BJJ_SESSIONS,
  INITIAL_CONDITIONING_SESSIONS,
  INITIAL_NUTRITION_LOGS,
  INITIAL_READINESS_LOGS
} from './data/defaultData';
import {
  UserProfile,
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck
} from './types';
import { Header } from './components/layout/Header';
import { BottomNav, TabType } from './components/layout/BottomNav';
import { DayView } from './components/today/DayView';
import { BJJSessionsList } from './components/bjj/BJJSessionsList';
import { BJJCheckinModal } from './components/bjj/BJJCheckinModal';
import { ConditioningView } from './components/conditioning/ConditioningView';
import { NutritionView } from './components/nutrition/NutritionView';
import { KPIDashboard } from './components/dashboard/KPIDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { BackupModal } from './components/settings/BackupModal';

export function App() {
  const [user, setUser] = useLocalStorage<UserProfile>('bjj_user_profile', INITIAL_USER_PROFILE);
  const [bjjSessions, setBjjSessions] = useLocalStorage<BJJSession[]>('bjj_sessions', INITIAL_BJJ_SESSIONS);
  const [conditioningSessions, setConditioningSessions] = useLocalStorage<ConditioningSession[]>(
    'bjj_conditioning_sessions',
    INITIAL_CONDITIONING_SESSIONS
  );
  const [nutritionLogs, setNutritionLogs] = useLocalStorage<DailyNutrition[]>(
    'bjj_nutrition_logs',
    INITIAL_NUTRITION_LOGS
  );
  const [readinessLogs, setReadinessLogs] = useLocalStorage<ReadinessCheck[]>(
    'bjj_readiness_logs',
    INITIAL_READINESS_LOGS
  );

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals
  const [isBjjModalOpen, setIsBjjModalOpen] = useState(false);
  const [editingBjjSession, setEditingBjjSession] = useState<BJJSession | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const schedule = useDailySchedule(selectedDate, user.scheduleConfig);

  // Current date entities
  const currentBjjSession = bjjSessions.find((s) => s.date === selectedDate);
  const currentConditioningSession = conditioningSessions.find((s) => s.date === selectedDate);
  const currentNutritionLog = nutritionLogs.find((s) => s.date === selectedDate);
  const currentReadinessLog = readinessLogs.find((s) => s.date === selectedDate);

  // Handlers
  const handleSaveBJJSession = (session: BJJSession) => {
    setBjjSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id || (s.date === session.date && s.id.startsWith('bjj-')));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
  };

  const handleDeleteBJJSession = (id: string) => {
    setBjjSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveConditioningSession = (session: ConditioningSession) => {
    setConditioningSessions((prev) => {
      const idx = prev.findIndex((s) => s.date === session.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
  };

  const handleSaveNutritionLog = (log: DailyNutrition) => {
    setNutritionLogs((prev) => {
      const idx = prev.findIndex((n) => n.date === log.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = log;
        return copy;
      }
      return [log, ...prev];
    });
  };

  const handleSaveReadinessLog = (readiness: ReadinessCheck) => {
    setReadinessLogs((prev) => {
      const idx = prev.findIndex((r) => r.date === readiness.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = readiness;
        return copy;
      }
      return [readiness, ...prev];
    });
  };

  const handleImportAll = (data: {
    user: UserProfile;
    bjjSessions: BJJSession[];
    conditioningSessions: ConditioningSession[];
    nutritionLogs: DailyNutrition[];
    readinessLogs: ReadinessCheck[];
  }) => {
    setUser(data.user);
    setBjjSessions(data.bjjSessions);
    setConditioningSessions(data.conditioningSessions);
    setNutritionLogs(data.nutritionLogs);
    setReadinessLogs(data.readinessLogs);
  };

  const handleResetData = () => {
    setUser(INITIAL_USER_PROFILE);
    setBjjSessions(INITIAL_BJJ_SESSIONS);
    setConditioningSessions(INITIAL_CONDITIONING_SESSIONS);
    setNutritionLogs(INITIAL_NUTRITION_LOGS);
    setReadinessLogs(INITIAL_READINESS_LOGS);
  };

  // Nutrition completion %
  const currentMealsCount = [
    currentNutritionLog?.breakfastDone,
    currentNutritionLog?.snackAmDone,
    currentNutritionLog?.lunchDone,
    currentNutritionLog?.snackPmDone,
    currentNutritionLog?.dinnerDone
  ].filter(Boolean).length;
  const nutritionPercentage = Math.round((currentMealsCount / 5) * 100);

  return (
    <div className="min-h-screen bg-tatame-bg text-gray-100 flex flex-col font-sans">
      <Header
        user={user}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      <main className="flex-1 max-w-lg w-full mx-auto px-3.5 pt-4">
        {activeTab === 'today' && (
          <DayView
            selectedDate={selectedDate}
            user={user}
            scheduleConfig={user.scheduleConfig}
            bjjSession={currentBjjSession}
            conditioningSession={currentConditioningSession}
            nutritionLog={currentNutritionLog}
            readinessLog={currentReadinessLog}
            allBjjSessions={bjjSessions}
            allConditioningSessions={conditioningSessions}
            allNutritionLogs={nutritionLogs}
            allReadinessLogs={readinessLogs}
            onOpenBJJCheckin={() => {
              setEditingBjjSession(currentBjjSession);
              setIsBjjModalOpen(true);
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onSaveNutrition={handleSaveNutritionLog}
            onSaveConditioning={handleSaveConditioningSession}
            onSaveReadiness={handleSaveReadinessLog}
          />
        )}

        {activeTab === 'tatame' && (
          <BJJSessionsList
            sessions={bjjSessions}
            scheduleConfig={user.scheduleConfig}
            onOpenCheckin={() => {
              setEditingBjjSession(undefined);
              setIsBjjModalOpen(true);
            }}
            onEditSession={(session) => {
              setEditingBjjSession(session);
              setIsBjjModalOpen(true);
            }}
            onDeleteSession={handleDeleteBJJSession}
          />
        )}

        {activeTab === 'conditioning' && (
          <ConditioningView
            selectedDate={selectedDate}
            sessions={conditioningSessions}
            onSaveSession={handleSaveConditioningSession}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            selectedDate={selectedDate}
            nutritionLog={currentNutritionLog}
            defaultProtocol={schedule.defaultNutritionProtocol}
            onSaveNutrition={handleSaveNutritionLog}
          />
        )}

        {activeTab === 'kpis' && (
          <KPIDashboard
            user={user}
            bjjSessions={bjjSessions}
            conditioningSessions={conditioningSessions}
            nutritionLogs={nutritionLogs}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        bjjTodayDone={!!currentBjjSession}
        nutritionPercentage={nutritionPercentage}
      />

      {/* Modals */}
      <BJJCheckinModal
        isOpen={isBjjModalOpen}
        onClose={() => {
          setIsBjjModalOpen(false);
          setEditingBjjSession(undefined);
        }}
        selectedDate={selectedDate}
        existingSession={editingBjjSession}
        onSaveSession={handleSaveBJJSession}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSaveUser={setUser}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        user={user}
        bjjSessions={bjjSessions}
        conditioningSessions={conditioningSessions}
        nutritionLogs={nutritionLogs}
        readinessLogs={readinessLogs}
        onImportAll={handleImportAll}
        onResetData={handleResetData}
      />
    </div>
  );
}

export default App;
