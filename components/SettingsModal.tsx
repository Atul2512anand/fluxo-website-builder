
import React from 'react';
import { ProviderConfig, ProviderID, AuthScheme } from '../types';
import { DEFAULT_PROVIDERS } from '../constants';

interface SettingsModalProps {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderConfig;
  setProvider: React.Dispatch<React.SetStateAction<ProviderConfig>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ t, isOpen, onClose, provider, setProvider }) => {
  if (!isOpen) return null;

  const handleProviderChange = (id: ProviderID) => {
    const defaults = DEFAULT_PROVIDERS[id];
    setProvider({
      ...provider,
      ...defaults,
      id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t.settings}</h2>
          <button onClick={onClose} className="text-2xl opacity-50 hover:opacity-100">&times;</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-70">Provider</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DEFAULT_PROVIDERS) as ProviderID[]).map(id => (
                <button
                  key={id}
                  onClick={() => handleProviderChange(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    provider.id === id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {DEFAULT_PROVIDERS[id].name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">{t.baseUrlLabel}</label>
                <input
                  type="text"
                  value={provider.baseUrl}
                  onChange={e => setProvider(prev => ({ ...prev, baseUrl: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">Auth Scheme</label>
                <select
                  value={provider.authScheme}
                  onChange={e => setProvider(prev => ({ ...prev, authScheme: e.target.value as AuthScheme }))}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  {Object.values(AuthScheme).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-70">{t.apiKeyLabel}</label>
              <input
                type="password"
                value={provider.apiKey}
                onChange={e => setProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter API Key..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="remember"
                checked={provider.rememberKey}
                onChange={e => setProvider(prev => ({ ...prev, rememberKey: e.target.checked }))}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <label htmlFor="remember" className="text-sm opacity-70">Remember API key and provider in this browser</label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            {t.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
