import { GoogleGenAI, Type } from "@google/genai";
import { Book, SearchParams, BookCategory, EmotionalTone } from "../types";

// Fallback data in case API key is missing or fails (as per "Dummy Books" request)
const DUMMY_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Hidden Life of Trees",
    author: "Peter Wohlleben",
    description: "In this illuminating work, Peter Wohlleben draws on groundbreaking scientific discoveries to reveal the amazing social network of the forest. He describes how trees communicate, care for their sick, and support one another in a way that will change how you see nature forever.",
    category: "Non-Fiction",
    tone: "Happy",
    rating: 4.8,
    coverColor: "#2d6a4f",
    coverUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "2",
    title: "The Great Alone",
    author: "Kristin Hannah",
    description: "In the wild, unpredictable landscape of 1970s Alaska, a family seeks a new beginning only to find that the dangers outside are nothing compared to the turmoil within their own cabin. As winter tightens its grip, thirteen-year-old Leni must learn that love can be both a salvation and a trap in this harrowing tale of survival.",
    category: "Fiction",
    tone: "Suspenseful",
    rating: 4.6,
    coverColor: "#1d3557",
    coverUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "3",
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    description: "Max, a wild and naughty boy, is sent to bed without his supper by his exhausted mother. In his room, a mysterious, wild forest grows out of his imagination, and Max sails across the sea to become King of the Wild Things.",
    category: "Children's Fiction",
    tone: "Surprising",
    rating: 4.9,
    coverColor: "#e63946",
    coverUrl: "https://images.unsplash.com/photo-1628498804332-90a6183e8787?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "4",
    title: "Tiny T. Rex and the Impossible Hug",
    author: "Jonathan Stutzman",
    description: "Tiny T. Rex has a HUGE problem. His friend Pointy needs cheering up and only a hug will do. But with his short stature and teeny T. Rex arms, is a hug impossible? Not if Tiny has anything to say about it!",
    category: "Children's Fiction",
    tone: "Happy",
    rating: 4.7,
    coverColor: "#f4a261",
    coverUrl: "https://images.unsplash.com/photo-1569420822601-52a382173f49?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "5",
    title: "Gone Girl",
    author: "Gillian Flynn",
    description: "On the morning of his fifth wedding anniversary, Nick Dunne's wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they aren't his. And then there are the persistent calls on his mobile phone. So what really did happen to Nick's beautiful wife?",
    category: "Fiction",
    tone: "Suspenseful",
    rating: 4.2,
    coverColor: "#000000",
    coverUrl: "https://images.unsplash.com/photo-1505243542579-da5adfe8338f?auto=format&fit=crop&q=80&w=600"
  }
];

export const fetchBookRecommendations = async (params: SearchParams): Promise<Book[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API_KEY found. Returning dummy data.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return DUMMY_BOOKS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct prompt to handle "All" cases efficiently
    const categoryPrompt = params.category === BookCategory.ALL ? "Any Category" : params.category;
    const tonePrompt = params.tone === EmotionalTone.ALL ? "Any Emotional Tone" : params.tone;

    const prompt = `
      Recommend 10 real books based on the following criteria:
      Topic/Query: "${params.query}"
      Category: "${categoryPrompt}"
      Emotional Tone: "${tonePrompt}"
      
      Return a JSON array of books. Each book should have a title, author, a synopsis (2-3 sentences long), category (Must be one of: Fiction, Non-Fiction, Children's Fiction, Children's Non-Fiction), tone (Must be one of: Happy, Surprising, Angry, Suspenseful, Sad), and a rating (1-5).
      Also provide a 'coverColor' hex code that matches the mood of the book.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              description: { type: Type.STRING, description: "A 2-3 sentence synopsis of the book." },
              category: { type: Type.STRING },
              tone: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              coverColor: { type: Type.STRING, description: "A hex color code representing the book mood" }
            },
            required: ["title", "author", "description", "category", "tone"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((item: any, index: number) => ({
        ...item,
        id: `gen-${index}-${Date.now()}`
      }));
    }

    return DUMMY_BOOKS;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return DUMMY_BOOKS;
  }
};