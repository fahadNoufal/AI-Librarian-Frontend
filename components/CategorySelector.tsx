import React from 'react';
import { BookCategory, CATEGORY_ICONS } from '../types';

interface CategorySelectorProps {
  selectedCategory: BookCategory;
  onSelect: (category: BookCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
        Preferred Category
      </label>
      <div className="flex flex-wrap gap-2 lg:gap-3">
        {(Object.values(BookCategory) as BookCategory[]).map((cat) => {
          const isSelected = selectedCategory === cat;
          // console.log(BookCategory)
          // console.log(selectedCategory)

          // console.log(isSelected)
          
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              type="button"
              className={`
                px-4 py-2 lg:px-5 lg:py-3 rounded-2xl border text-xs lg:text-sm font-bold transition-all duration-300
                ${isSelected 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 transform scale-105' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/30'
                }
              `}
            >
              <span className="mr-2 text-base lg:text-lg">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;