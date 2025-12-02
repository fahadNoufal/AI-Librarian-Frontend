import React, { useState } from 'react';
import { Home, Library, Info, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentView: 'search' | 'wishlist' | 'about';
  onChangeView: (view: 'search' | 'wishlist' | 'about') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'search' | 'wishlist' | 'about') => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-stone-200 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🦉</div>
          <h1 className="text-xl font-serif font-bold text-slate-800 tracking-tight">Readowl</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-50 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-100 flex flex-col justify-between py-8 z-[60] transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:z-40
      `}>
        <div className="px-6 flex flex-col h-full">
          
          {/* Header (Desktop: Logo, Mobile: Close Button) */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🦉</div>
              <h1 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Readowl</h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 w-full">
            <button
              onClick={() => handleNavClick('search')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${currentView === 'search' 
                  ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Home size={22} className={currentView === 'search' ? "text-orange-500" : ""} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('wishlist')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${currentView === 'wishlist' 
                  ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Library size={22} className={currentView === 'wishlist' ? "text-orange-500" : ""} />
              <span>My Library</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${currentView === 'about' 
                  ? 'bg-orange-50/80 text-orange-900 font-semibold' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Info size={22} className={currentView === 'about' ? "text-orange-500" : ""} />
              <span>About</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-8 border-t border-stone-50">
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
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Stephan</p>
                <p className="text-xs text-slate-400">Free Account</p>
              </div>
              <LogOut size={16} className="ml-auto text-slate-300" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;