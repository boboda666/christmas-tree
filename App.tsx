import React, { useState } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import { TreeState } from './types';

const App: React.FC = () => {
  // Initial state is SCATTERED for a dramatic entry effect
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene treeState={treeState} />
      </div>

      {/* UI Overlay Layer */}
      <Overlay currentState={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;