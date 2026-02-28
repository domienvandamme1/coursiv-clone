import onboardingContent from '../content/onboarding.json';
import coursesContent from '../content/courses.json';
import promptsContent from '../content/prompts.json';

describe('Onboarding Content', () => {
  it('should have 20 questions', () => {
    expect(onboardingContent.questions).toHaveLength(20);
    expect(onboardingContent.totalSteps).toBe(20);
  });

  it('should have sequential step numbers', () => {
    onboardingContent.questions.forEach((q, i) => {
      expect(q.step).toBe(i + 1);
    });
  });

  it('should have valid question types', () => {
    const validTypes = ['single-select', 'multi-select', 'interstitial'];
    onboardingContent.questions.forEach((q) => {
      expect(validTypes).toContain(q.type);
    });
  });

  it('should have options for selection questions', () => {
    onboardingContent.questions
      .filter((q) => q.type !== 'interstitial')
      .forEach((q) => {
        expect(q.options).toBeDefined();
        expect(q.options!.length).toBeGreaterThan(0);
      });
  });

  it('should have a goal question (step 19)', () => {
    const goalQ = onboardingContent.questions.find((q) => q.storeAs === 'goal');
    expect(goalQ).toBeDefined();
    expect(goalQ!.step).toBe(19);
  });

  it('should have a dailyTime question (step 20)', () => {
    const timeQ = onboardingContent.questions.find((q) => q.storeAs === 'dailyTime');
    expect(timeQ).toBeDefined();
    expect(timeQ!.step).toBe(20);
  });
});

describe('Courses Content', () => {
  it('should have at least 5 courses', () => {
    expect(coursesContent.courses.length).toBeGreaterThanOrEqual(5);
  });

  it('should have unique course IDs', () => {
    const ids = coursesContent.courses.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have required fields for each course', () => {
    coursesContent.courses.forEach((course) => {
      expect(course.id).toBeTruthy();
      expect(course.title).toBeTruthy();
      expect(course.description).toBeTruthy();
      expect(course.icon).toBeTruthy();
      expect(course.levels).toBeDefined();
      expect(course.levels.length).toBeGreaterThan(0);
    });
  });

  it('should have lessons with exercises', () => {
    const firstCourse = coursesContent.courses[0];
    const lessons = firstCourse.levels[0].lessons;
    expect(lessons.length).toBeGreaterThan(0);

    lessons.forEach((lesson) => {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.content).toBeTruthy();
      expect(lesson.exercises).toBeDefined();
      expect(lesson.exercises.length).toBeGreaterThan(0);
    });
  });

  it('should have valid exercise structure', () => {
    const firstLesson = coursesContent.courses[0].levels[0].lessons[0];
    const exercise = firstLesson.exercises[0];

    expect(exercise.type).toBe('fill_in_blank');
    expect(exercise.promptTemplate).toContain('[___]');
    expect(exercise.correctAnswer).toBeTruthy();
    expect(exercise.wrongAnswers.length).toBeGreaterThan(0);
    expect(exercise.aiResponse).toBeTruthy();
    expect(exercise.prompt).toBeDefined();
    expect(exercise.prompt.name).toBeTruthy();
    expect(exercise.prompt.template).toBeTruthy();
    expect(exercise.prompt.tags.length).toBeGreaterThan(0);
  });
});

describe('Prompts Content', () => {
  it('should have prompts', () => {
    expect(promptsContent.prompts.length).toBeGreaterThan(0);
  });

  it('should have unique prompt IDs', () => {
    const ids = promptsContent.prompts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have required fields', () => {
    promptsContent.prompts.forEach((prompt) => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.name).toBeTruthy();
      expect(prompt.template).toBeTruthy();
      expect(prompt.aiTool).toBeTruthy();
      expect(prompt.tags.length).toBeGreaterThan(0);
    });
  });
});
