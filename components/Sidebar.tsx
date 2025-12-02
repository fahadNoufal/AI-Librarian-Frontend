import React from 'react';
import { Home, Library, LogOut, Info } from 'lucide-react';

interface SidebarProps {
  currentView: 'search' | 'wishlist' | 'about';
  onChangeView: (view: 'search' | 'wishlist' | 'about') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-white border-r border-stone-100 flex flex-col justify-between py-8 z-40 transition-all duration-300">
      <div className="px-0 lg:px-8 flex flex-col items-center lg:items-start w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="text-3xl">🦉</div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 hidden lg:block tracking-tight">Readowl</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 w-full">
          <button
            onClick={() => onChangeView('search')}
            className={`w-full flex items-center gap-4 px-3 lg:px-4 py-3 rounded-2xl transition-all duration-200 group
              ${currentView === 'search' 
                ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
            `}
          >
            <Home size={22} className={currentView === 'search' ? "text-orange-500" : ""} />
            <span className="hidden lg:block">Home</span>
          </button>

          <button
            onClick={() => onChangeView('wishlist')}
            className={`w-full flex items-center gap-4 px-3 lg:px-4 py-3 rounded-2xl transition-all duration-200 group
              ${currentView === 'wishlist' 
                ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
            `}
          >
            <Library size={22} className={currentView === 'wishlist' ? "text-orange-500" : ""} />
            <span className="hidden lg:block">My Library</span>
          </button>

          <button
            onClick={() => onChangeView('about')}
            className={`w-full flex items-center gap-4 px-3 lg:px-4 py-3 rounded-2xl transition-all duration-200 group
              ${currentView === 'about' 
                ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
            `}
          >
            <Info size={22} className={currentView === 'about' ? "text-orange-500" : ""} />
            <span className="hidden lg:block">About</span>
          </button>
        </nav>
      </div>

      {/* User Profile */}
      <div className="px-0 lg:px-6 w-full mt-auto">
        <div className="hidden lg:block mb-6 bg-amber-50 rounded-2xl p-4 relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="font-serif font-bold text-slate-800 mb-1">Continue reading</h4>
                <div className="text-xs text-slate-500 mb-2">Don Quixote</div>
                <div className="h-1 bg-amber-200 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-2/3"></div>
                </div>
             </div>
             <div className="absolute -right-4 top-4 text-6xl opacity-10 rotate-12">📖</div>
        </div>

        <button className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stephan" alt="User" />
          </div>
          <div className="hidden lg:block text-left overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">Stephan</p>
            <p className="text-xs text-slate-400">Free Account</p>
          </div>
          <LogOut size={16} className="ml-auto text-slate-300 hidden lg:block" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;