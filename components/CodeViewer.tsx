
import React, { useState } from 'react';
import { Project } from '../types';
import { combineToSingleHtml } from '../utils/codeParser';

interface CodeViewerProps {
  t: any;
  project: Project;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ t, project }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const combinedHtml = combineToSingleHtml(project.code);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[70vh]">
      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1">
          {(['preview', 'html', 'css', 'js'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition uppercase ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {activeTab !== 'preview' && (
          <button 
            onClick={() => handleCopy(project.code[activeTab], activeTab)}
            className="px-3 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {copyStatus === activeTab ? t.copied : t.copy}
          </button>
        )}
      </div>

      <div className="flex-grow overflow-hidden bg-slate-50 dark:bg-slate-950">
        {activeTab === 'preview' ? (
          <iframe 
            srcDoc={combinedHtml}
            className="w-full h-full border-none bg-white"
            title="Preview"
          />
        ) : (
          <pre className="p-6 font-mono text-sm overflow-auto h-full leading-relaxed">
            <code>{project.code[activeTab]}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;
