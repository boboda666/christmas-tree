import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  currentState: TreeState;
  onToggle: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ currentState, onToggle }) => {
  const isTree = currentState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl md:text-5xl font-thin tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          ARIX <span className="font-bold text-sky-200">SIGNATURE</span>
        </h1>
        <div className="h-px w-24 bg-gradient-to-r from-sky-400 to-transparent" />
        <p className="text-sky-100/60 text-sm tracking-[0.2em] uppercase font-light">
          Interactive Holiday Experience
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col items-center md:items-end pointer-events-auto">
        <div className="flex flex-col items-center gap-4 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-sky-100/80 text-xs tracking-widest uppercase">
            Current State: <span className={isTree ? "text-sky-300 font-bold" : "text-gray-400"}>
              {isTree ? "Formed" : "Scattered"}
            </span>
          </p>

          <button
            onClick={onToggle}
            className={`
              group relative px-8 py-3 overflow-hidden rounded-full transition-all duration-500 ease-out
              ${isTree 
                ? "bg-gradient-to-r from-sky-900/80 to-slate-900/80 border border-sky-500/30 hover:border-sky-400" 
                : "bg-white text-black border border-white hover:bg-sky-50"
              }
            `}
          >
            <span className={`
              absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700
            `} />
            
            <span className={`
              relative text-sm font-medium tracking-widest uppercase
              ${isTree ? "text-sky-100" : "text-slate-900"}
            `}>
              {isTree ? "Release Energy" : "Gather Shape"}
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center md:text-left text-white/20 text-xs tracking-widest">
        &copy; 2024 ARIX DESIGN LABS. WEBGL EXPERIENCE.
      </footer>
    </div>
  );
};

export default Overlay;