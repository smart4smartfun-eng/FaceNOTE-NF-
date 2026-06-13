import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

export type DeviceType = 'ios' | 'android' | 'desktop';

export default function DeviceSimulator({ children }: DeviceSimulatorProps) {
  const [device, setDevice] = useState<DeviceType>('ios');

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 md:p-8 font-sans transition-colors duration-300">
      
      {/* Simulation Controls Dashboard */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            FaceNOTE <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full font-mono">STABLE v1.2</span>
          </h1>
          <p className="text-xs text-slate-400">
            Multi-platform high-converting layout engine • Android & iOS Compliant
          </p>
        </div>

        {/* Device Selection Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            id="device-btn-ios"
            onClick={() => setDevice('ios')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              device === 'ios'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iOS Frame (iPhone 15)
          </button>
          <button
            id="device-btn-android"
            onClick={() => setDevice('android')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              device === 'android'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android Frame (S24)
          </button>
          <button
            id="device-btn-desktop"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              device === 'desktop'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Responsive Desktop
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full flex justify-center items-center flex-1">
        {device === 'ios' && (
          <div className="relative w-[395px] h-[835px] bg-slate-900 rounded-[56px] p-3 shadow-[0_0_80px_rgba(30,58,138,0.25)] border-[10px] border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ring-4 ring-slate-800/40">
            {/* Dynamic Island notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3 text-[10px] text-white/50">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
            </div>
            
            {/* Status Bar */}
            <div className="h-6 w-full flex justify-between items-center px-6 pt-1 text-[11px] font-semibold text-white/90 z-40 bg-slate-950/80 backdrop-blur-md">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-blue-600/30 text-blue-400 px-1 rounded-sm">5G</span>
                {/* Battery icon */}
                <div className="w-5 h-2.5 border border-white/40 rounded-[4px] p-0.5 flex items-center bg-transparent">
                  <div className="h-full w-[90%] bg-emerald-400 rounded-[2px]" />
                </div>
              </div>
            </div>

            {/* Inner App Content Screen */}
            <div className="flex-1 w-full bg-slate-950 rounded-[46px] overflow-hidden flex flex-col relative">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/70 rounded-full z-50 pointer-events-none" />
          </div>
        )}

        {device === 'android' && (
          <div className="relative w-[405px] h-[845px] bg-slate-900 rounded-[40px] p-2 hover:shadow-[0_0_80px_rgba(16,185,129,0.15)] border-[8px] border-neutral-800 flex flex-col overflow-hidden transition-all duration-300">
            {/* Pin hole camera notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50" />
            
            {/* Status Bar */}
            <div className="h-6 w-full flex justify-between items-center px-6 pt-1 text-[10.5px] font-medium text-white/95 z-40 bg-neutral-950/80 backdrop-blur-md">
              <span className="font-semibold">09:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400">LTE</span>
                <span className="text-[9px]">🔋 98%</span>
              </div>
            </div>

            {/* Inner App Content Screen */}
            <div className="flex-1 w-full bg-neutral-950 rounded-[32px] overflow-hidden flex flex-col relative">
              {children}
            </div>

            {/* Minimal Android Navigation Line */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
          </div>
        )}

        {device === 'desktop' && (
          <div className="w-full max-w-6xl h-[840px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 relative">
            {/* Window bar */}
            <div className="h-10 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-40 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
                <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block" />
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
              </div>
              <div className="bg-slate-900 border border-slate-800 px-6 py-1 rounded-md text-[11px] text-slate-400 font-mono w-1/3 text-center truncate">
                https://facenote-social.network/app/hub
              </div>
              <div className="w-16" />
            </div>

            {/* Inner App Content Screen */}
            <div className="flex-1 w-full bg-slate-950 overflow-hidden flex flex-col relative">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
