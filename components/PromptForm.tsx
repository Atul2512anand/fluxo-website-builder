
import React from 'react';
import { PromptConfig, ProviderID } from '../types';
import { DEFAULT_MODELS } from '../constants';

interface PromptFormProps {
  t: any;
  config: PromptConfig;
  setConfig: React.Dispatch<React.SetStateAction<PromptConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  providerId: ProviderID;
}

const PromptForm: React.FC<PromptFormProps> = ({ t, config, setConfig, onGenerate, isGenerating, providerId }) => {
  const models = DEFAULT_MODELS[providerId] || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold opacity-70">Prompt</label>
        <textarea
          value={config.prompt}
          onChange={e => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
          placeholder={t.promptPlaceholder}
          className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold opacity-70">{t.modelLabel}</label>
          <div className="space-y-2">
            <select
              value={config.model}
              onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
              <option value="custom">{t.customModel}</option>
            </select>
            {config.model === 'custom' && (
              <input 
                type="text" 
                placeholder="Model string..." 
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold opacity-70">{t.tempLabel} ({config.temperature})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={e => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold opacity-70">{t.refImage}</label>
        <div className="flex items-center gap-4">
          <label className="flex-grow flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition">
            <span className="text-sm opacity-60">{config.image ? 'Image Selected' : t.refImageHint}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          {config.image && (
            <div className="relative group">
              <img src={config.image} alt="Ref" className="w-24 h-24 object-cover rounded-xl border" />
              <button 
                onClick={() => setConfig(prev => ({ ...prev, image: undefined }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
              >✕</button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !config.prompt.trim()}
        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
      >
        {isGenerating ? t.generating : t.generateBtn}
      </button>
    </div>
  );
};

export default PromptForm;
