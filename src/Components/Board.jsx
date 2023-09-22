import React, { useContext, useEffect, useRef } from "react";
import { LayersContext } from "../Contexts/LayersContext";
import Block from "./Block";

function Board() { 

  const buttonRef = useRef(null);
  
  const { layers, layerExplore, actual, calculateManhattanDistance, targetMatrix, areVectorsEqual } = useContext(LayersContext);

  return (
    <div className="flex flex-col justify-center items-center">
      {layers && layers.map((layer, indexa) => (
    <div key={indexa} className="flex flex-row gap-5 justify-center">
      {Array.isArray(layer) ? (
        layer.map((value, index) => (
          <div key={index} className="flex">
            <Block vector={value} h={calculateManhattanDistance(value, targetMatrix)} g={indexa} actual={actual}/>
          </div>
        ))
      ) : (
        <div key={indexa}>Not an array</div>
      )}
    </div>
  ))}
      <button ref={buttonRef} className="mt-5 p-1 rounded-sm text-white bg-gray-800 w-40" onClick={() => !areVectorsEqual(targetMatrix, actual) ? layerExplore(actual) : null}>
        Advance
      </button>
    </div>
  );
}

export default Board;