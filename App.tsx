
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ProviderConfig, 
  ProviderID, 
  PromptConfig, 
  WebsiteCode, 
  Project, 
  Language, 
  AppView, 
  AuthScheme 
} from './types';
import { DEFAULT_PROVIDERS, DEFAULT_MODELS, TRANSLATIONS } from './constants';
import { generateWebsite } from './services/llmClient';
import { combineToSingleHtml } from './utils/codeParser';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PromptForm from './components/PromptForm';
import SettingsModal from './components/SettingsModal';
import HistorySidebar from './components/HistorySidebar';
import CodeViewer from './components/CodeViewer';
import EditorView from './components/EditorView';

export default function App() {
  // State
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<AppView>(AppView.PROMPT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [provider, setProvider] = useState<ProviderConfig>({
    ...DEFAULT_PROVIDERS.gemini as ProviderConfig,
    id: 'gemini',
    apiKey: '',
    extraHeaders: {},
    rememberKey: true,
  });

  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    prompt: '',
    model: DEFAULT_MODELS.gemini[0],
    temperature: 0.7,
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [history, setHistory] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    const savedConfig = localStorage.getItem('fluxo_provider');
    const savedHistory = localStorage.getItem('fluxo_history');
    const savedTheme = localStorage.getItem('fluxo_theme');
    const savedLang = localStorage.getItem('fluxo_lang');

    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setProvider(parsed);
      if (DEFAULT_MODELS[parsed.id as ProviderID]) {
        setPromptConfig(prev => ({ ...prev, model: DEFAULT_MODELS[parsed.id as ProviderID][0] }));
      }
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setTheme(savedTheme as any);
    if (savedLang) setLang(savedLang as Language);
  }, []);

  useEffect(() => {
    localStorage.setItem('fluxo_provider', JSON.stringify(provider));
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('fluxo_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('fluxo_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fluxo_lang', lang);
  }, [lang]);

  const t = TRANSLATIONS[lang];

  // Actions
  const handleGenerate = async () => {
    // Check if an API key is available either from settings or environment
    const effectiveKey = provider.apiKey || process.env.API_KEY;
    if (!effectiveKey) {
      setError("Please set your API key in settings first.");
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const code = await generateWebsite(provider, promptConfig);
      const newProject: Project = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: promptConfig.prompt,
        code,
        provider: provider.id,
        model: promptConfig.model,
      };
      setCurrentProject(newProject);
      setHistory(prev => [newProject, ...prev]);
      setView(AppView.RESULT);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!currentProject) return;
    setIsGenerating(true);
    setError(null);
    try {
      const updatedCode = await generateWebsite(provider, { ...promptConfig, prompt: refinementPrompt }, true, currentProject.code);
      const updatedProject = { ...currentProject, code: updatedCode };
      setCurrentProject(updatedProject);
      setHistory(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm("Clear all data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header 
        t={t} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        lang={lang}
        toggleLang={() => setLang(l => l === 'en' ? 'id' : 'en')}
        openHistory={() => setIsSidebarOpen(true)}
        openSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">&times;</button>
          </div>
        )}

        {view === AppView.PROMPT && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-lg opacity-70">{t.subtitle}</p>
            </div>
            
            <PromptForm 
              t={t} 
              config={promptConfig} 
              setConfig={setPromptConfig} 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              providerId={provider.id}
            />
          </div>
        )}

        {view === AppView.RESULT && currentProject && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setView(AppView.PROMPT)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:opacity-80 transition"
              >
                ← {t.backToPrompt}
              </button>
              <button 
                onClick={() => setView(AppView.EDITOR)}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
              >
                {t.editMode}
              </button>
            </div>
            <CodeViewer t={t} project={currentProject} />
          </div>
        )}

        {view === AppView.EDITOR && currentProject && (
          <EditorView 
            t={t} 
            project={currentProject} 
            setProject={setCurrentProject}
            onBack={() => setView(AppView.RESULT)}
            onRefine={handleRefine}
            isGenerating={isGenerating}
          />
        )}
      </main>

      <Footer t={t} />

      <HistorySidebar 
        t={t} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        history={history}
        onSelect={(p) => {
          setCurrentProject(p);
          setView(AppView.RESULT);
          setIsSidebarOpen(false);
        }}
        onReset={handleReset}
      />

      <SettingsModal 
        t={t} 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        provider={provider}
        setProvider={(p) => {
          if (typeof p === 'function') {
            setProvider(prev => {
              const next = p(prev);
              if (next.id !== prev.id) {
                setPromptConfig(pc => ({ ...pc, model: DEFAULT_MODELS[next.id][0] || 'custom' }));
              }
              return next;
            });
          } else {
            setProvider(p);
            setPromptConfig(pc => ({ ...pc, model: DEFAULT_MODELS[p.id][0] || 'custom' }));
          }
        }}
      />

      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-bold">{t.generating}</p>
          </div>
        </div>
      )}
    </div>
  );
}
