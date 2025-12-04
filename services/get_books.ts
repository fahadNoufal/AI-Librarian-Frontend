import { Book, SearchParams, BookCategory, EmotionalTone } from "../types";

// Fallback data in case the local server is down
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
];

/**
 * Helper function to parse Pandas .to_dict() output.
 * Pandas defaults to { colName: { index: value } }, but we need [ { colName: value } ].
 */
const parsePandasResponse = (data: any): any[] => {
  // Case 1: It's already an array (e.g. if you used to_dict(orient='records'))
  if (Array.isArray(data)) return data;

  // Case 2: Backend returned an error message object
  if (data.message) {
    console.warn("Backend returned message:", data.message);
    return [];
  }

  // Case 3: Pandas default dict { "title": {"0": "X"}, "author": {"0": "Y"} }
  const colNames = Object.keys(data);
  if (colNames.length === 0) return [];

  // Grab the keys (indices) from the first column to know how many rows we have
  const firstCol = data[colNames[0]];
  if (typeof firstCol !== 'object' || firstCol === null) return [];
  
  const rowIndices = Object.keys(firstCol);

  // Map indices to objects
  return rowIndices.map(rowIndex => {
    const row: any = {};
    colNames.forEach(col => {
      // safely access data['columnName']['rowIndex']
      row[col] = data[col][rowIndex];
    });
    return row;
  });
};

export const fetchBookRecommendations = async (params: SearchParams): Promise<Book[]> => {
  try {
    // UPDATED: Pointing to the specific endpoint in your python code
    const url = new URL("http://localhost:8000/api/get_books");
    
    // Append Search Parameters
    if (params.query) url.searchParams.append("query", params.query);
    
    // Handle "All" cases by not sending empty strings if your backend checks for them, 
    // or sending them as is if your backend logic expects specific strings.
    // Based on your python code: if query.strip() =='' ... return message
    // So we ensure we send valid strings.
    
    url.searchParams.append("category", params.category);
    url.searchParams.append("tone", params.tone);

    console.log("Fetching from:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("Raw Server Response:", rawData);

    // Parse the Pandas data structure
    const booksArray = parsePandasResponse(rawData);

    // Transform/Validate data for UI
    const mapped_data = booksArray.map((item: any, index: number) => ({
      ...item,
      // Ensure we have an ID
      id: item.id ? String(item.id) : `local-${index}-${Date.now()}`,
      // Ensure we have a cover color if missing
      coverColor: item.coverColor || "#333333",
      // Ensure numeric rating
      rating: Number(item.rating) || 0
    }));

    console.log("Processed UI Data:", mapped_data);
    return mapped_data;

  } catch (error) {
    console.error("Local API Error:", error);
    return DUMMY_BOOKS;
  }
};