import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Loader2, Sparkles, ArrowRight, Library, HelpCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Shelf from './components/Shelf';
import BookCard from './components/BookCard';
import BookDetailView from './components/BookDetailView';
import AboutView from './components/AboutView';
import ToneSelector from './components/ToneSelector';
import CategorySelector from './components/CategorySelector';
import { Book, SearchParams, BookCategory, EmotionalTone } from './types';
import { fetchBookRecommendations } from './services/get_books';
import './app.css';
import gsap from 'gsap';

// Fallback data for initial view
const TRENDING_BOOKS: Book[] = [
  {
    "id": "init-1",
    "title": "The Midnight Library",
    "authors": "Matt Haig",
    "categories": "Fiction",
    "thumbnail": "https://imgs.search.brave.com/JjM_FmhR8L3A26PhqsjbacqryK2PjFK-BzLfl8LxXGU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzYx/M2I1Y2YxNjc3NTBi/NDJiNDgwZGEyYi9h/ZjZmN2E1NC0zY2M3/LTQ0NzgtODA2NC1i/ODlhOGViNWQ0NmQv/bWlkbmlnaHQrbGli/K2NvdmVyKzIuanBl/Zw?auto=format&fit=crop&q=80&w=400",
    "description": "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    "average_rating": 4.5,
    "published_year": 2020,
    "num_pages": 304,
    "ratings_count": 52000,
    "simple_categories": "Fiction"
  },
  {
    "id": "init-2",
    "title": "Atomic Habits",
    "authors": "James Clear",
    "description": "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
    "categories": "Non-Fiction",
    "average_rating": 4.9,
    "thumbnail": "https://imgs.search.brave.com/KOvy-umQwEox6GtkUn0MS3xP3iI3h6MVkLGjEuGv_bk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcz/Lm9kLWNkbi5jb20v/SW1hZ2VUeXBlLTEw/MC8xMTkxLTEvJTdC/N0FENUVERkEtQzU0/NC00QjY5LTgwQTIt/OTM1NkJCOTlFMTMx/JTdESW1nMTAwLmpw/Zw?auto=format&fit=crop&q=80&w=400",
    "published_year": 2018,
    "num_pages": 319,
    "ratings_count": 350000,
    "simple_categories": "Non-Fiction"
  },
  {
    "id": "init-3",
    "title": "Project Hail Mary",
    "authors": "Andy Weir",
    "description": "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    "categories": "Science Fiction",
    "average_rating": 4.8,
    "thumbnail": "https://imgs.search.brave.com/Kv5WppJrqtWbIYPgHId8HsPZerjOBkyPF_cGbGmdwGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saXZl/LnN0YXRpY2ZsaWNr/ci5jb20vNjU1MzUv/NTQ0NDMwODMzNTBf/Mzc5OWFmMzYwNF9j/LmpwZw?auto=format&fit=crop&q=80&w=400",
    "published_year": 2021,
    "num_pages": 496,
    "ratings_count": 180000,
    "simple_categories": "Fiction"
  },
  {
    "id": "init-4",
    "title": "Sapiens",
    "authors": "Yuval Noah Harari",
    "description": "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution.",
    "categories": "Non-Fiction",
    "average_rating": 4.7,
    "thumbnail": "https://imgs.search.brave.com/dCVagdBlz6uwJ9kjHehcm-uwD7-0kxKRMOcAgDGtjyg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eW5oYXJhcmkuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzAxL1NhcGllbnMt/QWxiYW5pYW4yLnBu/Zw?auto=format&fit=crop&q=80&w=400",
    "published_year": 2014,
    "num_pages": 443,
    "ratings_count": 140000,
    "simple_categories": "Non-Fiction"
  },
  {
    "id": "init-5",
    "title": "Educated",
    "authors": "Tara Westover",
    "description": "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.",
    "categories": "Memoir",
    "average_rating": 4.6,
    "thumbnail": "https://imgs.search.brave.com/cjYKyrSoes5PfalbrwjCgh3XQRRohiEPBBegAagrixc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vc2hlcnJl/eW1leWVyLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxOS8w/Ny9FZHVjYXRlZC5q/cGc_cmVzaXplPTMx/NSw0NzUmc3NsPTE?auto=format&fit=crop&q=80&w=400",
    "published_year": 2018,
    "num_pages": 352,
    "ratings_count": 190000,
    "simple_categories": "Non-Fiction"
  },
  {
    "id": "init-6",
    "title": "The Silent Patient",
    "authors": "Alex Michaelides",
    "description": "Alicia Berenson's life is seemingly perfect until she shoots her husband five times and then never speaks another word.",
    "categories": "Thriller",
    "average_rating": 4.0,
    "thumbnail": "https://imgs.search.brave.com/mhHLjsntXEQpkrroInTJSrs-XCYp0Uzh0J_Pw7VOpOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LmFw/bmlib29rLmluL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzA5/L1RoZS1zaWxlbnQt/UGF0aWVudC5qcGc_/Zml0PTExNzAsMTgw/NSZzc2w9MQ?auto=format&fit=crop&q=80&w=400",
    "published_year": 2019,
    "num_pages": 323,
    "ratings_count": 250000,
    "simple_categories": "Fiction"
  },
  {
    "id": "init-7",
    "title": "Where the Crawdads Sing",
    "authors": "Delia Owens",
    "description": "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove. When Chase Andrews is found dead, the locals immediately suspect Kya Clark.",
    "categories": "Mystery",
    "average_rating": 4.4,
    "thumbnail": "https://imgs.search.brave.com/HlzBnsjxJDNFHyaA2aI0S3xj_qgNZzC7TBvLaSDbmbc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTEzcXZtSE5kR0wu/anBn?auto=format&fit=crop&q=80&w=400",
    "published_year": 2018,
    "num_pages": 384,
    "ratings_count": 480000,
    "simple_categories": "Fiction"
  },
  {
    "id": "init-8",
    "title": "The 7 Habits of Highly Effective People",
    "authors": "Stephen Covey",
    "description": "A paradigm-shifting guide to personal and professional effectiveness based on timeless, universal principles.",
    "categories": "Self-Help",
    "average_rating": 4.1,
    "thumbnail": "https://imgs.search.brave.com/2hU9xJJ9V3kwqCS407Y4a_r6t6u2YzV-b1T89lEExDY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGV0/cmVhc3VyZXRyb3Zl/LmluL3Byb2R1Y3Rz/L3RveXMvdGh1bWIv/U3RlcGhlbiUyMFIu/JTIwQ292ZXktJTIw/VGhlJTIwNyUyMEhh/Yml0cyUyMG9mJTIw/SGlnaGx5JTIwRWZm/ZWN0aXZlJTIwUGVv/cGxlLmpwZw?auto=format&fit=crop&q=80&w=400",
    "published_year": 1989,
    "num_pages": 381,
    "ratings_count": 85000,
    "simple_categories": "Non-Fiction"
  },
  {
    "id": "init-9",
    "title": "Circe",
    "authors": "Madeline Miller",
    "description": "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born: Circe, who discovers she possesses the power of witchcraft.",
    "categories": "Fantasy",
    "average_rating": 4.2,
    "thumbnail": "https://imgs.search.brave.com/fDq7P6rlkcfQ96CU5y2uXfvadv0Bxor97SN-plb6z2g/rs:fit:860:0:0:0/g:ce/aHR0cDovL21hZGVs/aW5lbWlsbGVyLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/MS8wOC9jaXJjZS1t/YWRlbGluZS1taWxs/ZXIuanBn?auto=format&fit=crop&q=80&w=400",
    "published_year": 2018,
    "num_pages": 393,
    "ratings_count": 310000,
    "simple_categories": "Fiction"
  }
];

const App: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    query: '',
    category: "All",
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

  // Refs for animation
  const headerTextRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  // Memoize classics list to keep IDs stable
  const classicsBooks = useMemo(() => {
    return [...TRENDING_BOOKS].reverse().map((book, i) => ({
        ...book, 
        id: `classic-${i}` // distinct IDs
    }));
  }, []);
  
  // GSAP Typewriter Animation
  useEffect(() => {
    // Only run if we are in search view, no book is selected (so header is visible), and element ref exists
    if (currentView === 'search' && !selectedBook && headerTextRef.current) {
      // If animation has already played once, skip it and show final state
      if (hasAnimatedRef.current) {
        headerTextRef.current.innerText = "Tell me what you’re looking for?";
        if (subTextRef.current) {
            gsap.set(subTextRef.current, { opacity: 1 });
        }
        return;
      }

      // Mark as animated for future renders
      

      const phrases = ["Hi There,", "I am your curated AI librarian", "Tell me what you’re looking for?"];
      const masterTl = gsap.timeline({ repeat: 0 });
      const textEl = headerTextRef.current;
      const sub = subTextRef.current;

      // Reset
      textEl.innerText = "";
      if (sub) gsap.set(sub, { opacity: 0 });

      phrases.forEach((phrase, index) => {
        const isLast = index === phrases.length - 1;
        const tl = gsap.timeline();
        const proxy = { len: 0 };
        
        // Typing
        tl.to(proxy, {
            len: phrase.length,
            duration: phrase.length * 0.05, // Typing speed
            ease: "none",
            onUpdate: () => {
                textEl.innerText = phrase.substring(0, Math.ceil(proxy.len));
            }
        });

        // Pause after typing
        tl.to({}, { duration: isLast ? 0 : 0.8 });

        // Backspace (if not last phrase)
        if (!isLast) {
            tl.to(proxy, {
                len: 0,
                duration: phrase.length * 0.025, // Backspace speed
                ease: "none",
                onUpdate: () => {
                    textEl.innerText = phrase.substring(0, Math.ceil(proxy.len));
                }
            });
            // Small pause before next word starts
            tl.to({}, { duration: 0.2 });
        } else {
             // If last, reveal subtext
             tl.to(sub, { opacity: 1, duration: 1 ,onComplete:()=>{hasAnimatedRef.current = true;}}, "+=0.2");
        }

        masterTl.add(tl);
      });

      return () => {
        masterTl.kill();
      };
    }
  }, [currentView, selectedBook]); // Added selectedBook dependency to restore text when returning from details

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
      console.log(results)
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
  const displayedResults = showAllResults ? searchResults : searchResults.slice(0, 8);
  
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex font-sans overflow-x-hidden">
      
      {/* Sidebar - Handles Hamburger Logic internally */}
      <Sidebar 
        currentView={currentView} 
        
        onChangeView={(view) => {
          setCurrentView(view);
          setSelectedBook(null); // Close detail view on nav change
        }} 
        no_of_books= {wishlist.length}
      />

      <main className="flex-1 ml-0 lg:ml-64 min-h-screen flex flex-col relative pt-16 lg:pt-0 w-full">
        
        {/* Detail Overlay / View */}
        {selectedBook ? (
            <BookDetailView 
                book={selectedBook} 
                contextBooks={selectedContext}
                onBack={() => setSelectedBook(null)}
                onSelectBook={(book) => setSelectedBook(book)}
                isWishlisted={isBookInWishlist(selectedBook.id)}
                onToggleWishlist={toggleWishlist}
            />
        ) : (
            <>
                {/* Top Search / Hero Section - Only show if NOT on About page */}
                {currentView !== 'about' && (
                    <div className="px-4 lg:pl-16 lg:pr-8 pt-8 lg:pt-12 pb-8 max-w-[1200px] animate-fade-in w-full">
                        {/* Header Text */}
                        <div className=" header-text mb-6 min-h-[120px] lg:min-h-[140px] flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-[14px] font-bold tracking-wider uppercase flex items-center gap-1">
                                    <Sparkles size={12} /> AI Librarian
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 mb-3 leading-tight tracking-tight min-h-[1.2em] break-words">
                                <span ref={headerTextRef}></span><span className="cursor-blink text-violet-500">_</span>
                            </h2>
                            <p ref={subTextRef} className="text-slate-500 text-base lg:text-lg max-w-xl font-medium opacity-0 break-words">
                                Describe the plot, genre, or mood you're looking for.
                            </p>
                        </div>

                        {/* Search Interface */}
                        <form onSubmit={handleSearch} className="space-y-6 w-full">
                            
                            {/* Search Bar - Floating Style */}
                            <div className="relative group w-full max-w-2xl">
                                <div className="absolute inset-y-0 left-0 pl-4 lg:pl-5 flex items-center pointer-events-none">
                                    <Search className="text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={params.query}
                                    onChange={(e) => setParams({ ...params, query: e.target.value })}
                                    placeholder="e.g. a detective book with clever puzzles..."
                                    className="block w-full pl-11 lg:pl-12 pr-12 lg:pr-14 py-3 lg:py-4 bg-white rounded-2xl text-base lg:text-lg font-medium text-slate-800 placeholder:text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:outline-none transition-all duration-300"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading || !params.query.trim()}
                                    className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-violet-600 text-white w-9 lg:w-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col gap-6 max-w-4xl pt-2 w-full">
                                <div className="flex flex-col gap-3 w-full">
                                    
                                    <CategorySelector 
                                        selectedCategory={params.category}
                                        onSelect={(cat) => setParams(prev => ({ ...prev, category: cat }))} 
                                    />
                                </div>
                                <div className="h-px bg-slate-100 w-full max-w-xl"></div>
                                <div className="flex flex-col gap-3 w-full">
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
                <div className="flex-1 px-4 lg:pl-16 lg:pr-8 py-6 lg:py-10 w-full max-w-[1600px] overflow-hidden">
                
                {currentView === 'about' ? (
                    <AboutView />
                ) : currentView === 'wishlist' ? (
                    <div className="animate-fade-in pt-4 lg:pt-12 px-1 lg:px-0">
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
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-3xl mx-2">
                                <Library className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 text-lg">Your shelves are currently empty.</p>
                                <button onClick={() => setCurrentView('search')} className="text-violet-600 font-bold mt-2 hover:underline">Go discover some books</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 lg:space-y-16 pb-20">
                    {/* Loading State */}
                    {loading && (
                        <div className="w-full flex flex-col items-center justify-center py-10 opacity-70">
                                <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
                                <p className="font-serif text-xl text-slate-500 animate-pulse">Consulting the archives...</p>
                        </div>
                    )}

                    {/* Search Results */}
                    {!loading && hasSearched && (
                        <div id="results-shelf" className="scroll-mt-6 lg:scrollbar-hide">
                          
                            {searchResults.length > 0 ? (
                                <Shelf 
                                    title={`Curated for "${params.query}"`} 
                                    highlight 
                                    onViewAll={() => setShowAllResults(true)}
                                    subtitle={
                                        <div>
                                          <div className='Note mb-8'>
                                          <span className='font-bold opacity-50'>
                                            Note : 
                                          </span>
                                          <span className='font-light opacity-50 pl-2'>
                                            Our book database is limited, but we’ll do our best to find your preferred book.
                                          </span>
                                        </div>


                                        <button 
                                            onClick={() => setCurrentView('about')}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-bold hover:bg-violet-200 transition-colors"
                                        >
                                            <HelpCircle size={16} />
                                            Show how it works
                                        </button>
                                        </div>
                                    }
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
                                <div className="p-8 lg:p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-3xl mx-2">
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