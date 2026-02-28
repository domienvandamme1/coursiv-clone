export interface OnboardingOption {
  emoji?: string;
  text: string;
}

export interface OnboardingQuestion {
  step: number;
  type: 'single-select' | 'multi-select' | 'interstitial';
  title: string;
  subtitle?: string;
  body?: string;
  autoAdvance?: boolean;
  buttonText?: string;
  showLogo?: boolean;
  badge?: string;
  storeAs?: string;
  options?: OnboardingOption[];
}

export interface OnboardingContent {
  questions: OnboardingQuestion[];
  totalSteps: number;
}

export interface PromptTemplate {
  id?: string;
  name: string;
  template: string;
  aiTool: string;
  tags: string[];
  category?: string;
}

export interface Exercise {
  id: string;
  type: 'fill_in_blank' | 'multiple_choice';
  scenario: string;
  promptTemplate: string;
  blankIndex: number;
  correctAnswer: string;
  wrongAnswers: string[];
  aiResponse: string;
  prompt: PromptTemplate;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  contentType: 'read' | 'listen' | 'video';
  content: string;
  exercises: Exercise[];
}

export interface Level {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  levels: Level[];
}

export interface CoursesContent {
  courses: Course[];
}

export interface PromptsContent {
  prompts: PromptTemplate[];
}
