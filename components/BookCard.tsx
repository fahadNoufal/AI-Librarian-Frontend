import React from 'react';
import { Book } from '../types';
import { Heart, CheckCircle, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
  onClick?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, index, isWishlisted, onToggleWishlist, onClick }) => {
  
  return (
    <div 
      className="group relative flex-shrink-0 w-40 sm:w-48 lg:w-52 snap-center cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onClick && onClick(book)}
    >
      {/* 3D Book Cover Container */}
      <div className="relative w-full aspect-[2/3] mb-4 perspective-1000 group-hover:-translate-y-4 transition-transform duration-500 ease-out">
        
        {/* The Book Itself */}
        <div className="relative w-full h-full rounded-r-md rounded-l-sm shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
          
          {/* Spine Highlight (Left edge) */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-white/40 to-transparent z-20"></div>
          
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col p-4 items-center justify-center text-center"
              style={{ backgroundColor: book.coverColor || '#ccc' }}
            >
               <span className="font-serif font-black text-white/90 text-4xl mb-2">{book.title.charAt(0)}</span>
               <span className="text-xs text-white/80 font-bold uppercase tracking-widest">{book.category}</span>
            </div>
          )}

          {/* Hover Overlay with Action */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30 backdrop-blur-[2px]">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(book);
                }}
                className={`
                    w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-all duration-300 delay-75
                    ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-800 hover:bg-orange-500 hover:text-white'}
                `}
             >
                {isWishlisted ? <CheckCircle size={20} /> : <Heart size={20} />}
             </button>
          </div>
        </div>

        {/* Shadow under the book */}
        <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/20 blur-md rounded-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]"></div>
      </div>

      {/* Book Info */}
      <div className="px-1 space-y-1">
        <h3 className="font-bold text-slate-800 leading-tight text-base line-clamp-2 group-hover:text-orange-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-400 font-medium truncate">{book.author}</p>
        
        <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                <Star size={10} className="mr-1 text-orange-400 fill-orange-400" /> {book.rating}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide border border-slate-100 px-1.5 rounded-md">
                {book.tone}
            </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
