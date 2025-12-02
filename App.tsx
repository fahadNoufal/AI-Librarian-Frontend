import React, { useState, useMemo } from 'react';
import { Search, Loader2, Sparkles, ArrowRight, Library, Info, Cpu, Heart, ScanSearch, Tags, BrainCircuit, BookOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Shelf from './components/Shelf';
import BookCard from './components/BookCard';
import BookDetailView from './components/BookDetailView';
import ToneSelector from './components/ToneSelector';
import CategorySelector from './components/CategorySelector';
import { Book, SearchParams, BookCategory, EmotionalTone } from './types';
import { fetchBookRecommendations } from './services/geminiService';

// Fallback data for initial view
const TRENDING_BOOKS: Book[] = [
  {
    id: "init-1",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    category: "Fiction",
    tone: "Happy",
    rating: 4.5,
    coverColor: "#2a9d8f",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "init-2",
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
    category: "Non-Fiction",
    tone: "Happy",
    rating: 4.9,
    coverColor: "#e9c46a",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "init-3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    category: "Fiction",
    tone: "Suspenseful",
    rating: 4.8,
    coverColor: "#264653",
    coverUrl: "https://images.unsplash.com/photo-1614726365723-49cfae92782f?auto=format&fit=crop&q=80&w=400"
  },
   {
    id: "init-4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution.",
    category: "Non-Fiction",
    tone: "Surprising",
    rating: 4.7,
    coverColor: "#f4a261",
    coverUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400"
  },
  {
      id: "init-5",
      title: "Educated",
      author: "Tara Westover",
      description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.",
      category: "Non-Fiction",
      tone: "Sad",
      rating: 4.6,
      coverColor: "#e76f51",
      coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400"
  }
];

const App: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    query: '',
    category: BookCategory.ALL,
    tone: EmotionalTone.ALL
  });
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentView, setCurrentView] = useState<'search' | 'wishlist' | 'about'>('search');
  const [showAllResults, setShowAllResults] = useState(false);
  
  // New state for book detail view
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedContext, setSelectedContext] = useState<Book[]>([]);

  // Memoize classics list to keep IDs stable
  const classicsBooks = useMemo(() => {
    return [...TRENDING_BOOKS].reverse().map((book, i) => ({
        ...book, 
        id: `classic-${i}` // distinct IDs
    }));
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!params.query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setShowAllResults(false);
    setCurrentView('search'); 
    setSelectedBook(null); 

    try {
      const results = await fetchBookRecommendations(params);
      setSearchResults(results);
      // Scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-shelf');
        if(resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (book: Book) => {
    setWishlist(prev => {
      const exists = prev.find(b => b.id === book.id);
      if (exists) {
        return prev.filter(b => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const isBookInWishlist = (bookId: string) => {
    return wishlist.some(b => b.id === bookId);
  };

  const handleBookClick = (book: Book, contextList: Book[]) => {
    setSelectedBook(book);
    setSelectedContext(contextList);
  };

  // Determine which results to display based on "Full Shelf" state
  const displayedResults = showAllResults ? searchResults : searchResults.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex font-sans">
      
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setSelectedBook(null); // Close detail view on nav change
        }} 
      />

      <main className="flex-1 ml-0 lg:ml-64 min-h-screen flex flex-col relative">
        
        {/* Detail Overlay / View */}
        {selectedBook ? (
            <BookDetailView 
                book={selectedBook} 
                contextBooks={selectedContext}
                onBack={() => setSelectedBook(null)}
                onSelectBook={(book) => setSelectedBook(book)}
            />
        ) : (
            <>
                {/* Top Search / Hero Section - Only show if NOT on About page */}
                {currentView !== 'about' && (
                    <div className="pl-8 lg:pl-16 pt-12 pb-8 max-w-[1200px] animate-fade-in">
                        {/* Header Text */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                                    <Sparkles size={12} /> AI Librarian
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 mb-3 leading-tight tracking-tight">
                                Find your perfect story.
                            </h2>
                            <p className="text-slate-500 text-lg max-w-xl font-medium">
                                Describe the plot, genre, or mood you're looking for.
                            </p>
                        </div>

                        {/* Search Interface */}
                        <form onSubmit={handleSearch} className="space-y-6">
                            
                            {/* Search Bar - Floating Style */}
                            <div className="relative group max-w-2xl">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={params.query}
                                    onChange={(e) => setParams({ ...params, query: e.target.value })}
                                    placeholder="e.g. A mystery set in 1920s Paris..."
                                    className="block w-full pl-12 pr-14 py-4 bg-white rounded-2xl text-lg font-medium text-slate-800 placeholder:text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:outline-none transition-all duration-300"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading || !params.query.trim()}
                                    className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-violet-600 text-white w-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col gap-6 max-w-4xl pt-2">
                                <div className="flex flex-col gap-3">
                                    <CategorySelector 
                                        selectedCategory={params.category}
                                        onSelect={(cat) => setParams(prev => ({ ...prev, category: cat }))} 
                                    />
                                </div>
                                <div className="h-px bg-slate-100 w-full max-w-xl"></div>
                                <div className="flex flex-col gap-3">
                                    <ToneSelector 
                                        selectedTone={params.tone}
                                        onSelect={(t) => setParams(prev => ({ ...prev, tone: t }))}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 pl-8 lg:pl-16 pr-8 py-10 w-full max-w-[1600px]">
                
                {currentView === 'about' ? (
                    <div className="animate-slide-up max-w-5xl pb-20">
                         <div className="flex items-end gap-4 mb-10 pl-2 border-b border-slate-100 pb-6">
                            <h2 className="text-4xl font-serif font-bold text-slate-900">About BookMood</h2>
                            <span className="text-slate-400 font-medium pb-1.5 text-base">v1.0</span>
                        </div>

                        {/* Intro Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xl text-slate-700 font-serif leading-relaxed mb-6">
                                    Readowl is an AI-powered book discovery engine designed to help you find your next great read based on not just genre, but specific topics and emotional resonance.
                                </p>
                                <p className="text-slate-500 leading-relaxed">
                                    Traditional search engines rely on keywords. Readowl understands the <em>feeling</em> of a story. Whether you want something "suspenseful set in space" or "happy and heartwarming about baking", our AI librarian curates a personalized shelf just for you.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="bg-violet-50 p-6 rounded-3xl flex-1 border border-violet-100 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Cpu className="text-violet-600" size={24} />
                                        <h3 className="font-bold text-slate-900">Powered by Gemini</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed">Leveraging Google's advanced language models for deep semantic understanding.</p>
                                </div>
                                <div className="bg-rose-50 p-6 rounded-3xl flex-1 border border-rose-100 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Heart className="text-rose-600" size={24} />
                                        <h3 className="font-bold text-slate-900">Made for Readers</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed">Crafted with love for bookworms who cherish the magic of storytelling.</p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Roadmap */}
                        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-100">
                             <h3 className="text-2xl font-serif font-bold text-slate-900 mb-12 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">🛠️</span>
                                How it works
                             </h3>

                             <div className="relative pl-4 lg:pl-10">
                                {/* Connecting Line */}
                                <div className="absolute left-[39px] lg:left-[63px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"></div>

                                {/* Step 1: Query Analysis */}
                                <div className="relative flex gap-8 mb-16 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-violet-500 group-hover:text-violet-600 transition-all duration-500 shadow-sm group-hover:shadow-violet-100 group-hover:scale-110">
                                        <Search size={24} className="lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="pt-1 lg:pt-3">
                                        <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-violet-700 transition-colors">1. Semantic Understanding</h4>
                                        <p className="text-slate-500 leading-relaxed max-w-xl">
                                            The AI doesn't just look for keywords. It analyzes your query (e.g., "{params.query || 'A cozy mystery...'}") to understand the underlying themes, plot structures, and narrative elements you desire.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2: Vector Search */}
                                <div className="relative flex gap-8 mb-16 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-500 shadow-sm group-hover:shadow-blue-100 group-hover:scale-110">
                                        <ScanSearch size={24} className="lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="pt-1 lg:pt-3">
                                        <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">2. Vector Search</h4>
                                        <p className="text-slate-500 leading-relaxed max-w-xl">
                                            Your request is converted into a high-dimensional vector. The system scans a vast embedding space to find books that are semantically "close" to your description, discovering hidden connections between distinct titles.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3: Classification */}
                                <div className="relative flex gap-8 mb-16 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-amber-500 group-hover:text-amber-600 transition-all duration-500 shadow-sm group-hover:shadow-amber-100 group-hover:scale-110">
                                        <Tags size={24} className="lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="pt-1 lg:pt-3">
                                        <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">3. Category Classification</h4>
                                        <p className="text-slate-500 leading-relaxed max-w-xl">
                                            Candidate books are filtered through a rigid classification layer. This ensures that if you asked for <strong>{params.category}</strong>, we strictly filter out other genres while maintaining relevance to your plot.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4: Sentiment Analysis */}
                                <div className="relative flex gap-8 mb-16 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-rose-500 group-hover:text-rose-600 transition-all duration-500 shadow-sm group-hover:shadow-rose-100 group-hover:scale-110">
                                        <BrainCircuit size={24} className="lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="pt-1 lg:pt-3">
                                        <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-700 transition-colors">4. Sentiment Analysis</h4>
                                        <p className="text-slate-500 leading-relaxed max-w-xl">
                                            Finally, the emotional arc of each book is analyzed. We match the book's "vibe" to your desired tone (<strong>{params.tone}</strong>), ensuring you get a {params.tone.toLowerCase()} experience rather than a jarring one.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 5: Result */}
                                <div className="relative flex gap-8 group">
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200 ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen size={24} className="lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="pt-1 lg:pt-3">
                                        <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">5. Your Curated Shelf</h4>
                                        <p className="text-slate-500 leading-relaxed max-w-xl">
                                            The result is a personalized shelf of books, complete with AI-generated synopses explaining exactly <em>why</em> they fit your specific request.
                                        </p>
                                    </div>
                                </div>

                             </div>
                        </div>

                    </div>
                ) : currentView === 'wishlist' ? (
                    <div className="animate-fade-in">
                        <div className="flex items-end gap-4 mb-10 pl-2 border-b border-slate-100 pb-6 max-w-5xl">
                            <h2 className="text-3xl font-serif font-bold text-slate-900">My Library</h2>
                            <span className="text-slate-400 font-medium pb-2 text-base">{wishlist.length} books</span>
                        </div>
                        
                        {wishlist.length > 0 ? (
                            <Shelf title="Saved Collection">
                                {wishlist.map((book, i) => (
                                    <BookCard 
                                        key={book.id} 
                                        book={book} 
                                        index={i} 
                                        isWishlisted={true} 
                                        onToggleWishlist={toggleWishlist}
                                        onClick={(b) => handleBookClick(b, wishlist)}
                                    />
                                ))}
                            </Shelf>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-3xl">
                                <Library className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 text-lg">Your shelves are currently empty.</p>
                                <button onClick={() => setCurrentView('search')} className="text-violet-600 font-bold mt-2 hover:underline">Go discover some books</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-16 pb-20">
                    {/* Loading State */}
                    {loading && (
                        <div className="w-full flex flex-col items-center justify-center py-10 opacity-70">
                                <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
                                <p className="font-serif text-xl text-slate-500 animate-pulse">Consulting the archives...</p>
                        </div>
                    )}

                    {/* Search Results */}
                    {!loading && hasSearched && (
                        <div id="results-shelf" className="scroll-mt-6">
                            {searchResults.length > 0 ? (
                                <Shelf 
                                    title={`Curated for "${params.query}"`} 
                                    highlight 
                                    onViewAll={() => setShowAllResults(true)}
                                >
                                        {displayedResults.map((book, i) => (
                                            <BookCard 
                                                key={book.id} 
                                                book={book} 
                                                index={i} 
                                                isWishlisted={isBookInWishlist(book.id)} 
                                                onToggleWishlist={toggleWishlist}
                                                onClick={(b) => handleBookClick(b, searchResults)}
                                            />
                                        ))}
                                </Shelf>
                            ) : (
                                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-3xl">
                                        <p className="text-slate-500 text-lg">No books found for that specific combination.</p>
                                        <button onClick={() => setHasSearched(false)} className="text-violet-600 font-bold mt-2 hover:underline">Clear Search</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Default/Dashboard Shelves */}
                    <Shelf title="Trending Now">
                            {TRENDING_BOOKS.map((book, i) => (
                                <BookCard 
                                    key={`trend-${i}`} 
                                    book={book} 
                                    index={i} 
                                    isWishlisted={isBookInWishlist(book.id)} 
                                    onToggleWishlist={toggleWishlist}
                                    onClick={(b) => handleBookClick(b, TRENDING_BOOKS)}
                                />
                            ))}
                    </Shelf>

                    <Shelf title="Classics Reimagined">
                            {classicsBooks.map((book, i) => (
                                <BookCard 
                                    key={book.id} 
                                    book={book} 
                                    index={i} 
                                    isWishlisted={isBookInWishlist(book.id)} 
                                    onToggleWishlist={toggleWishlist}
                                    onClick={(b) => handleBookClick(b, classicsBooks)}
                                />
                            ))}
                    </Shelf>

                    </div>
                )}
                </div>
            </>
        )}
      </main>
    </div>
  );
};

export default App;