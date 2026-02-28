import { useAppStore } from '../src/store/useAppStore';

describe('App Store', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it('should have correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.hasSubscribed).toBe(false);
    expect(state.hasSignedUp).toBe(false);
    expect(state.hasSeenUpsell).toBe(false);
    expect(state.completedLessons).toHaveLength(0);
    expect(state.discoveredPrompts).toHaveLength(0);
  });

  it('should set onboarding answers', () => {
    const { setOnboardingAnswer } = useAppStore.getState();
    setOnboardingAnswer(1, 'Always');
    setOnboardingAnswer(2, 'I struggle a lot');

    const state = useAppStore.getState();
    expect(state.onboardingAnswers[1]).toBe('Always');
    expect(state.onboardingAnswers[2]).toBe('I struggle a lot');
  });

  it('should complete onboarding', () => {
    useAppStore.getState().completeOnboarding();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('should handle subscription', () => {
    useAppStore.getState().subscribe();
    expect(useAppStore.getState().hasSubscribed).toBe(true);
  });

  it('should handle signup', () => {
    useAppStore.getState().signUp('Test User', 'test@example.com');
    const state = useAppStore.getState();
    expect(state.hasSignedUp).toBe(true);
    expect(state.userName).toBe('Test User');
    expect(state.userEmail).toBe('test@example.com');
  });

  it('should track lesson completion', () => {
    const { completeLesson, isLessonCompleted } = useAppStore.getState();
    expect(isLessonCompleted('chatgpt-1-1')).toBe(false);

    completeLesson('chatgpt-1-1');
    expect(useAppStore.getState().isLessonCompleted('chatgpt-1-1')).toBe(true);
  });

  it('should track discovered prompts', () => {
    const { discoverPrompt, isPromptDiscovered } = useAppStore.getState();
    expect(isPromptDiscovered('prompt-email')).toBe(false);

    discoverPrompt('prompt-email', 'exercise-1');
    expect(useAppStore.getState().isPromptDiscovered('prompt-email')).toBe(true);
  });

  it('should calculate lesson progress', () => {
    const { completeLesson, getLessonProgress } = useAppStore.getState();
    const mockLessons = [{ id: 'l1' }, { id: 'l2' }, { id: 'l3' }, { id: 'l4' }];

    expect(getLessonProgress('course-1', mockLessons)).toBe(0);

    completeLesson('l1');
    completeLesson('l2');
    expect(useAppStore.getState().getLessonProgress('course-1', mockLessons)).toBe(50);
  });

  it('should handle AI bundle purchase', () => {
    useAppStore.getState().purchaseAiBundle();
    expect(useAppStore.getState().hasAiBundle).toBe(true);
  });

  it('should reset to initial state', () => {
    const store = useAppStore.getState();
    store.signUp('Test', 'test@test.com');
    store.completeOnboarding();
    store.subscribe();

    useAppStore.getState().reset();
    const state = useAppStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.hasSignedUp).toBe(false);
    expect(state.userName).toBe('');
  });
});
