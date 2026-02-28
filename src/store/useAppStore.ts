import { create } from 'zustand';

interface UserProgress {
  lessonId: string;
  completedAt: string;
}

interface DiscoveredPrompt {
  promptId: string;
  exerciseId: string;
  discoveredAt: string;
}

interface AppState {
  hasCompletedOnboarding: boolean;
  hasSubscribed: boolean;
  hasSignedUp: boolean;
  hasSeenUpsell: boolean;

  onboardingAnswers: Record<number, string | string[]>;
  currentOnboardingStep: number;
  userGoal: string;
  dailyTime: string;

  userName: string;
  userEmail: string;

  completedLessons: UserProgress[];
  discoveredPrompts: DiscoveredPrompt[];
  hasAiBundle: boolean;

  setOnboardingAnswer: (step: number, answer: string | string[]) => void;
  setCurrentOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  setUserGoal: (goal: string) => void;
  setDailyTime: (time: string) => void;

  subscribe: () => void;
  signUp: (name: string, email: string) => void;
  markUpsellSeen: () => void;
  purchaseAiBundle: () => void;

  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  discoverPrompt: (promptId: string, exerciseId: string) => void;
  isPromptDiscovered: (promptId: string) => boolean;

  getLessonProgress: (courseId: string, lessons: { id: string }[]) => number;
  reset: () => void;
}

const initialState = {
  hasCompletedOnboarding: false,
  hasSubscribed: false,
  hasSignedUp: false,
  hasSeenUpsell: false,
  onboardingAnswers: {} as Record<number, string | string[]>,
  currentOnboardingStep: 1,
  userGoal: '',
  dailyTime: '',
  userName: '',
  userEmail: '',
  completedLessons: [] as UserProgress[],
  discoveredPrompts: [] as DiscoveredPrompt[],
  hasAiBundle: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setOnboardingAnswer: (step, answer) =>
    set((state) => ({
      onboardingAnswers: { ...state.onboardingAnswers, [step]: answer },
    })),

  setCurrentOnboardingStep: (step) =>
    set({ currentOnboardingStep: step }),

  completeOnboarding: () =>
    set({ hasCompletedOnboarding: true }),

  setUserGoal: (goal) => set({ userGoal: goal }),
  setDailyTime: (time) => set({ dailyTime: time }),

  subscribe: () => set({ hasSubscribed: true }),

  signUp: (name, email) =>
    set({ hasSignedUp: true, userName: name, userEmail: email }),

  markUpsellSeen: () => set({ hasSeenUpsell: true }),

  purchaseAiBundle: () => set({ hasAiBundle: true }),

  completeLesson: (lessonId) =>
    set((state) => ({
      completedLessons: [
        ...state.completedLessons,
        { lessonId, completedAt: new Date().toISOString() },
      ],
    })),

  isLessonCompleted: (lessonId) =>
    get().completedLessons.some((p) => p.lessonId === lessonId),

  discoverPrompt: (promptId, exerciseId) =>
    set((state) => ({
      discoveredPrompts: [
        ...state.discoveredPrompts,
        { promptId, exerciseId, discoveredAt: new Date().toISOString() },
      ],
    })),

  isPromptDiscovered: (promptId) =>
    get().discoveredPrompts.some((p) => p.promptId === promptId),

  getLessonProgress: (_courseId, lessons) => {
    const completed = lessons.filter((l) =>
      get().completedLessons.some((p) => p.lessonId === l.id)
    ).length;
    return lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
  },

  reset: () => set(initialState),
}));
