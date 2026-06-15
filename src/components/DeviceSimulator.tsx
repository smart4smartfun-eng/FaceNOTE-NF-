import React from 'react';

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

export default function DeviceSimulator({ children }: DeviceSimulatorProps) {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 md:p-4 font-sans">
      <div className="w-full h-screen md:h-[840px] md:max-w-[420px] bg-slate-900 md:rounded-[36px] shadow-[0_0_50px_rgba(59,130,246,0.15)] md:border md:border-slate-800/80 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}

