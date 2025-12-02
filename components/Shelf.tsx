import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ShelfProps {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  onViewAll?: () => void;
  subtitle?: React.ReactNode;
}

const Shelf: React.FC<ShelfProps> = ({ title, children, highlight, onViewAll, subtitle }) => {
  return (
    <div className="w-full mb-8 lg:mb-12 animate-fade-in-up">
      <div className={`flex items-baseline justify-between px-2 ${subtitle ? 'mb-3' : 'mb-4 lg:mb-6'}`}>
        <h2 className={`text-xl lg:text-2xl font-serif font-bold ${highlight ? 'text-orange-900' : 'text-slate-700'}`}>
          {title}
        </h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Full shelf <ArrowRight size={14} />
          </button>
        )}
      </div>

      {subtitle && (
        <div className="px-2 mb-4 lg:mb-6">
          {subtitle}
        </div>
      )}
      
      <div className="relative w-full">
        {/* The Books Container */}
        {/* Mobile: Grid (2 cols), Desktop: Flex Row */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-2 pb-8 lg:flex lg:flex-nowrap lg:overflow-x-auto lg:gap-12 lg:pb-12 lg:px-4 lg:scrollbar-hide lg:snap-x">
          {children}
        </div>
        
        {/* The Shelf Graphic - Only visible on Desktop where it looks like a shelf */}
        <div className="hidden lg:block absolute bottom-8 left-0 right-0 h-4 bg-[#EBE6D9] rounded-sm shadow-sm z-[-1] transform translate-y-1/2">
             <div className="absolute top-0 w-full h-[1px] bg-[#D6D0C0]"></div>
             <div className="absolute bottom-0 w-full h-2 bg-[#DED8C9] rounded-b-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Shelf;