import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getTodayString, useDailySchedule } from './hooks/useDailySchedule';
import { useCloudSync } from './hooks/useCloudSync';
import { CloudBackupPayload, LAST_UPDATED_STORAGE_KEY } from './services/gistSync';
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
  const [localUpdatedAt, setLocalUpdatedAt] = useLocalStorage<string | null>(
    LAST_UPDATED_STORAGE_KEY,
    null
  );

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals
  const [isBjjModalOpen, setIsBjjModalOpen] = useState(false);
  const [editingBjjSession, setEditingBjjSession] = useState<BJJSession | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const markModified = useCallback(() => {
    setLocalUpdatedAt(new Date().toISOString());
  }, [setLocalUpdatedAt]);

  const handleApplyRemoteData = useCallback(
    (payload: CloudBackupPayload) => {
      setUser(payload.user);
      setBjjSessions(payload.bjjSessions);
      setConditioningSessions(payload.conditioningSessions);
      setNutritionLogs(payload.nutritionLogs);
      setReadinessLogs(payload.readinessLogs);
      setLocalUpdatedAt(payload.updatedAt);
    },
    [
      setUser,
      setBjjSessions,
      setConditioningSessions,
      setNutritionLogs,
      setReadinessLogs,
      setLocalUpdatedAt
    ]
  );

  const {
    config: syncConfig,
    isConfigured: isSyncConfigured,
    syncStatus,
    syncError,
    connectWithToken,
    syncNow,
    forcePull,
    forcePush,
    disconnect: disconnectSync,
    getPairingUrl
  } = useCloudSync({
    user,
    bjjSessions,
    conditioningSessions,
    nutritionLogs,
    readinessLogs,
    localUpdatedAt,
    onApplyRemoteData: handleApplyRemoteData
  });

  const schedule = useDailySchedule(selectedDate, user.scheduleConfig);

  // Current date entities
  const currentBjjSession = bjjSessions.find((s) => s.date === selectedDate);
  const currentConditioningSession = conditioningSessions.find((s) => s.date === selectedDate);
  const currentNutritionLog = nutritionLogs.find((s) => s.date === selectedDate);
  const currentReadinessLog = readinessLogs.find((s) => s.date === selectedDate);

  // Handlers
  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    markModified();
  };

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
    markModified();
  };

  const handleDeleteBJJSession = (id: string) => {
    setBjjSessions((prev) => prev.filter((s) => s.id !== id));
    markModified();
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
    markModified();
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
    markModified();
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
    markModified();
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
    markModified();
  };

  const handleResetData = () => {
    setUser(INITIAL_USER_PROFILE);
    setBjjSessions(INITIAL_BJJ_SESSIONS);
    setConditioningSessions(INITIAL_CONDITIONING_SESSIONS);
    setNutritionLogs(INITIAL_NUTRITION_LOGS);
    setReadinessLogs(INITIAL_READINESS_LOGS);
    markModified();
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
        syncStatus={syncStatus}
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
        onSaveUser={handleSaveUser}
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
        syncConfig={syncConfig}
        isSyncConfigured={isSyncConfigured}
        syncStatus={syncStatus}
        syncError={syncError}
        onConnectToken={connectWithToken}
        onSyncNow={syncNow}
        onForcePull={forcePull}
        onForcePush={forcePush}
        onDisconnectSync={disconnectSync}
        getPairingUrl={getPairingUrl}
      />
    </div>
  );
}

export default App;
