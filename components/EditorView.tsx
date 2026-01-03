
import React, { useState, useEffect } from 'react';
import { Project, WebsiteCode } from '../types';
import { combineToSingleHtml } from '../utils/codeParser';

interface EditorViewProps {
  t: any;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onBack: () => void;
  onRefine: (p: string) => void;
  isGenerating: boolean;
}

const EditorView: React.FC<EditorViewProps> = ({ t, project, setProject, onBack, onRefine, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [localCode, setLocalCode] = useState<WebsiteCode>(project.code);
  const [refinementPrompt, setRefinementPrompt] = useState('');

  // Update local code when project changes (from AI refinement)
  useEffect(() => {
    setLocalCode(project.code);
  }, [project.code]);

  const handleLocalChange = (val: string) => {
    setLocalCode(prev => ({ ...prev, [activeTab]: val }));
  };

  const handleSave = () => {
    setProject({ ...project, code: localCode });
    alert("Saved locally!");
  };

  const handleExportZip = async () => {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    zip.file("index.html", localCode.html);
    zip.file("styles.css", localCode.css);
    zip.file("script.js", localCode.js);
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluxo-website-${project.id}.zip`;
    a.click();
  };

  const handleExportHtml = () => {
    const combined = combineToSingleHtml(localCode);
    const blob = new Blob([combined], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={onBack} className="text-sm font-semibold opacity-60 hover:opacity-100 flex items-center gap-2">
          ← {t.backToPrompt}
        </button>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-lg hover:bg-green-700">
            💾 Save
          </button>
          <button onClick={handleExportHtml} className="px-4 py-2 text-sm font-bold bg-slate-700 text-white rounded-lg hover:bg-slate-800">
            📄 {t.exportHtml}
          </button>
          <button onClick={handleExportZip} className="px-4 py-2 text-sm font-bold bg-slate-700 text-white rounded-lg hover:bg-slate-800">
            📦 {t.exportZip}
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Editor Side */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {(['html', 'css', 'js'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-grow py-3 text-xs font-bold uppercase transition ${
                  activeTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-600' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <textarea
            value={localCode[activeTab]}
            onChange={e => handleLocalChange(e.target.value)}
            className="flex-grow p-4 font-mono text-sm bg-slate-950 text-slate-100 outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          
          {/* AI Refine Area */}
          <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={refinementPrompt}
                onChange={e => setRefinementPrompt(e.target.value)}
                placeholder={t.editAIPrompt}
                className="flex-grow p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                disabled={isGenerating || !refinementPrompt.trim()}
                onClick={() => {
                  onRefine(refinementPrompt);
                  setRefinementPrompt('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isGenerating ? '...' : t.editWithAI}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
          <iframe 
            srcDoc={combineToSingleHtml(localCode)}
            className="w-full h-full border-none bg-white"
            title="Live Preview"
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg font-bold animate-pulse">
                Updating...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorView;
