import React from 'react';
import Board from './Components/Board';
import { LayersProvider } from './Contexts/LayersContext';

function App() {
  return (
    <div className="h-auto w-screen flex flex-col justify-center items-center ">
    <LayersProvider>
      <Board/>
    </LayersProvider>
    </div>
  );
}

export default App;
