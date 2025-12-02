export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  tone: string;
  rating?: number;
  coverColor?: string; // Hex code for a generated placeholder
  coverUrl?: string; // URL for a real image
}

export enum BookCategory {
  ALL = 'All',
  FICTION = 'Fiction',
  NON_FICTION = 'Non-Fiction',
  CHILDRENS_FICTION = "Children's Fiction",
  CHILDRENS_NON_FICTION = "Children's Non-Fiction"
}

export enum EmotionalTone {
  ALL = 'All',
  HAPPY = 'Happy',
  SURPRISING = 'Surprising',
  ANGRY = 'Angry',
  SUSPENSEFUL = 'Suspenseful',
  SAD = 'Sad'
}

export interface SearchParams {
  query: string;
  category: BookCategory;
  tone: EmotionalTone;
}

export const TONE_EMOJIS: Record<EmotionalTone, string> = {
  [EmotionalTone.ALL]: '✨',
  [EmotionalTone.HAPPY]: '😊',
  [EmotionalTone.SURPRISING]: '😲',
  [EmotionalTone.ANGRY]: '😠',
  [EmotionalTone.SUSPENSEFUL]: '😱',
  [EmotionalTone.SAD]: '😢',
};

export const CATEGORY_ICONS: Record<BookCategory, string> = {
  [BookCategory.ALL]: '📚',
  [BookCategory.FICTION]: '📖',
  [BookCategory.NON_FICTION]: '🧠',
  [BookCategory.CHILDRENS_FICTION]: '🦄',
  [BookCategory.CHILDRENS_NON_FICTION]: '🦖',
};