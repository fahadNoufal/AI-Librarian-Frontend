import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ShelfProps {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  onViewAll?: () => void;
}

const Shelf: React.FC<ShelfProps> = ({ title, children, highlight, onViewAll }) => {
  return (
    <div className="w-full mb-12 animate-fade-in-up">
      <div className="flex items-baseline justify-between mb-6 px-2">
        <h2 className={`text-xl lg:text-2xl font-serif font-bold ${highlight ? 'text-orange-900' : 'text-slate-700'}`}>
          {title}
        </h2>
        <button 
          onClick={onViewAll}
          className="text-xs font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          Full shelf <ArrowRight size={14} />
        </button>
      </div>
      
      <div className="relative w-full">
        {/* The Books Container */}
        <div className="flex flex-nowrap overflow-x-auto gap-8 lg:gap-12 pb-12 px-4 scrollbar-hide snap-x">
          {children}
        </div>
        
        {/* The Shelf Graphic */}
        <div className="absolute bottom-8 left-0 right-0 h-4 bg-[#EBE6D9] rounded-sm shadow-sm z-[-1] transform translate-y-1/2">
             <div className="absolute top-0 w-full h-[1px] bg-[#D6D0C0]"></div>
             <div className="absolute bottom-0 w-full h-2 bg-[#DED8C9] rounded-b-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Shelf;