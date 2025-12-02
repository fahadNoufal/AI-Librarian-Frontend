import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, Heart, Share2, Download, ArrowUpRight, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';

interface BookDetailViewProps {
  book: Book;
  contextBooks: Book[];
  onBack: () => void;
  onSelectBook: (book: Book) => void;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
}

// "Dictionary" object to simulate extra details that might not come from the simple AI response
const STATIC_DETAILS: Record<string, any> = {
  default: {
    editors: "Christopher Reath, Alena Cestabon, Steve Korg",
    language: "Standard English (USA & UK)",
    paperback: "Paper textured, full colour, 345 pages",
    isbn: "ISBN: 987 3 32564 455 B"
  }
};

const BookDetailView: React.FC<BookDetailViewProps> = ({ book, contextBooks, onBack, onSelectBook, isWishlisted, onToggleWishlist }) => {
  // Use book specific details or fall back to default
  const details = STATIC_DETAILS[book.id] || STATIC_DETAILS.default;
  const currentIndex = contextBooks.findIndex(b => b.id === book.id);
  
  const hasNext = currentIndex < contextBooks.length - 1;
  const hasPrev = currentIndex > 0;

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleNext = () => {
    if (hasNext) {
        onSelectBook(contextBooks[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
        onSelectBook(contextBooks[currentIndex - 1]);
    }
  };

  const handleFeatureUnavailable = () => {
    setToastMsg("App is only focused on recommendation");
    setTimeout(() => {
        setToastMsg(null);
    }, 3000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNext();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
        if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, contextBooks]);

  return (
    <div key={book.id} className="w-full min-h-screen bg-[#FDFBF7] p-8 lg:p-16 animate-fade-in relative z-50 flex flex-col">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded-full shadow-lg font-medium animate-fade-in-up">
            {toastMsg}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mb-8 lg:mb-12 animate-slide-up">
        <button 
          onClick={onBack}
          className="group w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-300"
        >
          <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-900" />
        </button>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stephan" alt="User" />
                </div>
                <span className="font-bold text-sm text-slate-800">Alexander Mark</span>
             </div>
             <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center">
                <span className="text-slate-600">🔔</span>
             </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-20">
        
        {/* Left Column - Book Cover */}
        <div className="lg:col-span-5 relative flex flex-col items-center lg:block animate-scale-in delay-200">
           <div className="relative w-[280px] sm:w-[320px] lg:w-[400px] aspect-[2/3] perspective-1000 mx-auto">
               {/* Deep Shadow */}
               <div className="absolute inset-x-8 bottom-0 h-10 bg-black/40 blur-2xl rounded-[50%] opacity-80 z-[-1]"></div>
               
               <div className="w-full h-full rounded-r-lg rounded-l-sm overflow-hidden shadow-2xl relative bg-white transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/40 to-transparent z-20"></div>
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div style={{ backgroundColor: book.coverColor }} className="w-full h-full flex items-center justify-center p-8 text-center">
                        <h1 className="text-white font-serif text-4xl font-bold">{book.title}</h1>
                    </div>
                  )}
               </div>

               {/* Navigation Arrows */}
               <div className="absolute top-1/2 -left-20 -translate-y-1/2 hidden lg:flex flex-col gap-4">
                  <button 
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className={`w-10 h-10 rounded-full bg-transparent border flex items-center justify-center transition-all duration-300
                        ${hasPrev 
                            ? 'border-slate-300 text-slate-500 hover:border-slate-800 hover:text-slate-800 cursor-pointer hover:scale-110' 
                            : 'border-slate-100 text-slate-200 cursor-not-allowed'
                        }`}
                  >
                     <ChevronUp size={20} />
                  </button>
                   <button 
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-all duration-300
                        ${hasNext 
                            ? 'bg-white border-slate-200 text-slate-800 hover:scale-110 cursor-pointer' 
                            : 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed'
                        }`}
                  >
                     <ChevronDown size={20} />
                  </button>
               </div>
           </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-7 space-y-10 pt-4">
           
           {/* Header Info */}
           <div className="space-y-4 animate-slide-up delay-300 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">
                {book.title}
              </h1>
              <p className="text-xl font-medium text-slate-500">{book.author}</p>
              
              <p className="text-slate-500 italic max-w-xl mx-auto lg:mx-0 pt-2 border-l-4 border-orange-200 pl-4">
                  "Get ready to uncover the dark secrets and betrayals in the book. A thrilling adventure awaits you."
              </p>
           </div>

           {/* Action Bar */}
           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-8 pb-8 border-b border-slate-200 animate-slide-up delay-400">
              <button 
                onClick={handleFeatureUnavailable}
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
              >
                 Start reading <ArrowUpRight size={18} />
              </button>
              
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => onToggleWishlist(book)}
                    className={`
                        w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 transform active:scale-90
                        ${isWishlisted 
                            ? 'bg-rose-50 text-rose-500 border-rose-100' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-rose-400'}
                    `}
                    title={isWishlisted ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                </button>
                <button 
                    onClick={handleFeatureUnavailable}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-violet-500 transition-colors"
                >
                    <Share2 size={20} />
                </button>
                <button 
                    onClick={handleFeatureUnavailable}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors"
                >
                    <Download size={20} />
                </button>
              </div>
           </div>

           {/* Description & Metadata Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up delay-500">
              
              <div className="space-y-4">
                 <h3 className="font-serif font-bold text-xl text-slate-800">Description</h3>
                 <p className="text-slate-500 leading-relaxed">
                   {book.description}
                 </p>
                 <p className="text-slate-500 leading-relaxed">
                   With action-packed sequences, shocking twists, and moments of heart-wrenching tragedy, this book is a must-read for any fan of the {book.category} genre.
                 </p>
                 
                 <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" alt="Reviewer" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Roberto Jordan</p>
                        <p className="text-xs text-slate-400">What a delightful and magical book it is!</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h4 className="font-bold text-slate-900 mb-1">Editors</h4>
                    <p className="text-sm text-slate-500">{details.editors}</p>
                 </div>
                 
                 <div>
                    <h4 className="font-bold text-slate-900 mb-1">Language</h4>
                    <p className="text-sm text-slate-500">{details.language}</p>
                 </div>

                 <div>
                    <h4 className="font-bold text-slate-900 mb-1">Paperback</h4>
                    <p className="text-sm text-slate-500">{details.paperback}</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{details.isbn}</p>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Bottom Gallery - "More in this collection" */}
      <div className="max-w-6xl mx-auto w-full pt-10 border-t border-slate-200 animate-slide-up delay-700">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-xl text-slate-800">More in this collection</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {contextBooks.length}</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {contextBooks.map((b, idx) => (
                <button 
                    key={b.id}
                    onClick={() => onSelectBook(b)}
                    className={`
                        relative flex-shrink-0 w-24 aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 snap-start
                        ${b.id === book.id 
                            ? 'ring-4 ring-orange-200 scale-105 shadow-lg' 
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }
                    `}
                >
                    {b.coverUrl ? (
                        <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                        <div style={{ backgroundColor: b.coverColor }} className="w-full h-full"></div>
                    )}
                </button>
            ))}
        </div>
      </div>

    </div>
  );
};

export default BookDetailView;