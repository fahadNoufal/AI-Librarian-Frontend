export interface Book {
  id: string;
  title: string;
  authors: string;
  categories: string;
  thumbnail: string,
  description: string;
  published_year:number;
  average_rating:number;
  num_pages:number;
  ratings_count:number;
  simple_categories:string;
  // 'title and subtitle':string;
  // tone: string;
  // rating?: number;
  // coverColor?: string; // Hex code for a generated placeholder
}

export enum BookCategory {
  ALL = 'All',
  FICTION = 'Fiction',
  NON_FICTION = 'NonFiction',
  CHILDRENS_FICTION = "Children's Fiction",
  CHILDRENS_NON_FICTION = "Children's NonFiction"
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