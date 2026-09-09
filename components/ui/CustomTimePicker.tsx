'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';

interface CustomTimePickerProps {
  value: string; // "HH:MM" in 24hr format, e.g. "09:00" or "18:30"
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  quickPresets?: string[]; // e.g. ["08:30", "09:00", "09:30", "13:00", "14:00", "18:00"]
}

const DEFAULT_PRESETS = ['08:30', '09:00', '09:30', '13:00', '14:00', '17:30', '18:00', '18:30'];

function format12Hour(time24: string): string {
  if (!time24) return '--:--';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

export function CustomTimePicker({
  value = '09:00',
  onChange,
  label,
  required = false,
  className = '',
  quickPresets = DEFAULT_PRESETS,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // Parse 24hr into 12hr parts
  const [h24, mStr = '00'] = (value || '09:00').split(':');
  const hNum = parseInt(h24, 10) || 9;
  const isPM = hNum >= 12;
  const h12 = hNum % 12 || 12;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetTime = (newH12: number, newMin: string, newPM: boolean) => {
    let finalH24 = newH12 % 12;
    if (newPM) finalH24 += 12;
    const finalStr = `${String(finalH24).padStart(2, '0')}:${newMin}`;
    onChange(finalStr);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block font-mono uppercase text-slate-300 mb-1.5 text-xs">
          {label} {required && <span className="text-[#2384ba]">*</span>}
        </label>
      )}

      {/* Visual Display Input with Trigger */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border border-white/15 hover:border-[#2384ba]/60 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#2384ba] transition-all text-left shadow-sm group"
        >
          <div className="flex items-center space-x-2.5">
            <Clock className="h-4 w-4 text-[#2384ba] group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white tracking-wide">
              {format12Hour(value)}
            </span>
            <span className="text-[11px] text-slate-400 font-sans">
              ({value} 24h)
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 group-hover:bg-[#2384ba]/20 group-hover:text-[#2384ba] transition-colors">
            SELECT
          </span>
        </button>

        {/* Hidden but functional native input with dark scheme */}
        <input
          ref={nativeInputRef}
          type="time"
          required={required}
          value={value || '09:00'}
          onChange={handleNativeChange}
          style={{ colorScheme: 'dark' }}
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      {/* Interactive Dropdown Picker */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-slate-950 border border-white/20 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fadeIn space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-[#2384ba] font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Time Selector</span>
            </span>
            <button
              type="button"
              onClick={() => {
                try {
                  nativeInputRef.current?.showPicker?.();
                } catch (e) {}
              }}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Native Picker
            </button>
          </div>

          {/* 12-Hour Selector Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase text-slate-400">HOUR</span>
            <div className="grid grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleSetTime(hour, mStr, isPM)}
                  className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                    h12 === hour
                      ? 'bg-[#2384ba] text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {String(hour).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Minute Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase text-slate-400">MINUTE</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['00', '15', '30', '45'].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleSetTime(h12, min, isPM)}
                  className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                    mStr === min
                      ? 'bg-[#2384ba] text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  :{min}
                </button>
              ))}
            </div>
          </div>

          {/* AM / PM Toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={() => handleSetTime(h12, mStr, false)}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                !isPM
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-white/5'
              }`}
            >
              AM (Morning)
            </button>
            <button
              type="button"
              onClick={() => handleSetTime(h12, mStr, true)}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                isPM
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-white/5'
              }`}
            >
              PM (Evening)
            </button>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <span className="text-[10px] uppercase text-slate-500">QUICK PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                    value === preset
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {format12Hour(preset)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase transition-colors"
          >
            Confirm Time
          </button>
        </div>
      )}
    </div>
  );
}
