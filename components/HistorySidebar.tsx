
import React from 'react';
import { Project } from '../types';

interface HistorySidebarProps {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  history: Project[];
  onSelect: (p: Project) => void;
  onReset: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ t, isOpen, onClose, history, onSelect, onReset }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div 
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{t.history}</h2>
          <button onClick={onClose} className="text-2xl opacity-50">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-center opacity-50 py-10">{t.noHistory}</p>
          ) : (
            history.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition group"
              >
                <div className="font-semibold line-clamp-2 group-hover:text-indigo-600 transition">{p.prompt}</div>
                <div className="text-xs opacity-50 mt-1 flex justify-between">
                  <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                  <span className="uppercase">{p.provider} · {p.model}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onReset}
            className="w-full py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            {t.resetData}
          </button>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
