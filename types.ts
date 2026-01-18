
export interface LessonModule {
  title: string;
  duration: string;
  keyPoints: string[];
  activity: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface EducationalProject {
  subject: string;
  targetAge: string;
  curriculum: LessonModule[];
  quiz: QuizQuestion[];
  studentAppCode: string;
  themeColor: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface MiniAppPage {
  title: string;
  route: string;
  content: string;
  components: Array<{
    type: 'button' | 'card' | 'input' | 'list' | 'chart';
    label: string;
    details: string;
  }>;
}

export interface MiniAppProject {
  name: string;
  themeColor: string;
  pages: MiniAppPage[];
  fullCode: string;
  botIntegrationGuide: string;
}

/**
 * Interface representing a Telegram bot command configuration
 */
export interface BotCommand {
  command: string;
  description: string;
}

/**
 * Interface representing a Telegram bot's personality and configuration
 */
export interface BotPersonality {
  name: string;
  description: string;
  welcomeMessage: string;
  commands: BotCommand[];
  suggestedFramework: string;
}

/**
 * Interface representing an AI-generated social media post
 */
export interface GeneratedPost {
  text: string;
  hashtags: string[];
  imageUrl?: string;
  imagePrompt: string;
}

/**
 * Interface representing a single lesson within a course
 */
export interface Lesson {
  title: string;
  content: string;
  imageUrl?: string;
  quiz: {
    question: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  };
}

/**
 * Interface representing a complete educational course
 */
export interface Course {
  topic: string;
  description: string;
  lessons: Lesson[];
}
