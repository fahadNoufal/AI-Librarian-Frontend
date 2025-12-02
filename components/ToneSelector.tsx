import React from 'react';
import { EmotionalTone, TONE_EMOJIS } from '../types';

interface ToneSelectorProps {
  selectedTone: EmotionalTone;
  onSelect: (tone: EmotionalTone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
        Desired Tone
      </label>
      <div className="flex flex-wrap gap-3">
        {(Object.values(EmotionalTone) as EmotionalTone[]).map((tone) => {
          const isSelected = selectedTone === tone;
          return (
            <button
              key={tone}
              onClick={() => onSelect(tone)}
              type="button"
              className={`
                flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all duration-300
                ${isSelected 
                  ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200 transform scale-105' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/30'
                }
              `}
            >
              <span className="text-lg leading-none filter drop-shadow-sm">{TONE_EMOJIS[tone]}</span>
              <span>{tone}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToneSelector;