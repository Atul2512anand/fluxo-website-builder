
import React from 'react';

interface HeaderProps {
  t: any;
  theme: string;
  toggleTheme: () => void;
  lang: string;
  toggleLang: () => void;
  openHistory: () => void;
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ t, theme, toggleTheme, lang, toggleLang, openHistory, openSettings }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            F
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">Fluxo</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLang}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium uppercase"
          >
            {lang}
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={t.appearance}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={openHistory}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={t.history}
          >
            🕒
          </button>
          <button 
            onClick={openSettings}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={t.settings}
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
