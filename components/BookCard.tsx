import React from 'react';
import { Book } from '../types';
import { Heart, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
  onClick?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, index, isWishlisted, onToggleWishlist, onClick }) => {
  
  function limitChars(text: string, n: number): string {
    if (text.length <= n) return text;
    return text.slice(0, n) + " …";
  }

  return (
    <div 
      className="group relative flex-shrink-0 w-full lg:w-52 snap-center flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="text-[10px] lg:text-xs opacity-40 font-medium uppercase py-2  tracking-widest">{book.categories}</span>
      {/* Clickable Area for Details */}
      <div 
        className="cursor-pointer mb-1"
        onClick={() => onClick && onClick(book)}
      >
        {/* 3D Book Cover Container */}
        <div className="relative w-full aspect-[2/3] mb-3 lg:mb-4 perspective-1000 group-hover:-translate-y-4 transition-transform duration-500 ease-out">
          
          {/* The Book Itself */}
          <div className="relative w-full h-full rounded-r-md rounded-l-sm shadow-md lg:shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
            
            {/* Spine Highlight (Left edge) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-1.5 bg-gradient-to-r from-white/40 to-transparent z-20"></div>
            
            {book.thumbnail ? (
              <img 
                src={book.thumbnail} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex flex-col p-2 lg:p-4 items-center justify-center text-center"
                style={{ backgroundColor: '#ccc' }}
              >
                 <span className="font-serif font-black text-white/90 text-3xl lg:text-4xl mb-2">{book.title.charAt(0)}</span>
                 <span className="text-[10px] lg:text-xs text-white/80 font-bold uppercase tracking-widest">{book.categories}</span>
              </div>
            )}
          </div>

          {/* Shadow under the book */}
          <div className="hidden lg:block absolute -bottom-2 left-2 right-2 h-4 bg-black/20 blur-md rounded-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]"></div>
        </div>

        {/* Book Info */}
        <div className="px-1 space-y-1">
          <h3 className="font-bold text-slate-800 leading-tight text-sm lg:text-base line-clamp-2 group-hover:text-violet-700 transition-colors">
            {limitChars(book.title, 30)}
            <span className=' text-xs px-2 opacity-60'>
              {book.published_year}
            </span>
          </h3>
          <p className="text-xs lg:text-sm text-slate-400 font-medium truncate">
            {book.authors.split(";")[0].trim()}
            {book.authors.split(";").length > 1 && " and others"}
          </p>
        </div>
      </div>

      {/* Footer Actions Row */}
      <div className="mt-auto px-1 pt-2 lg:pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="inline-flex items-center text-[10px] lg:text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-md">
                  <Star size={10} className="mr-1 text-orange-400 fill-orange-400" /> {book.average_rating}
             </span>
             <span className=' text-xs opacity-40'>
                {book.ratings_count}
             </span>
          </div>

          <button
              onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(book);
              }}
              className={`
                  w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-90 border
                  ${isWishlisted 
                    ? 'bg-rose-50 text-rose-500 border-rose-100' 
                    : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-50 hover:text-rose-400'}
              `}
              title={isWishlisted ? "Remove from favorites" : "Add to favorites"}
           >
              <Heart size={16} className={`lg:w-[18px] lg:h-[18px] ${isWishlisted ? "fill-current" : ""}`} />
           </button>
      </div>
    </div>
  );
};

export default BookCard;