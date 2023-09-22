/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Square from "./Square";
import { LayersContext } from "../Contexts/LayersContext";

function Block({ vector, h , g, actual }) {  

  const { areVectorsEqual, targetMatrix, done, stack, findVector } = useContext(LayersContext);  

  const [ visited, setVisited ] = useState(false);

  const [ isStack, setIsStack] = useState(false);

  useEffect(() => {
    if (areVectorsEqual(vector, actual)) 
      setVisited(true);
  },[actual]);

  useEffect(() => {
    if (done) {
      stackTrace();
    }
  }, [done]);

  const stackTrace = () => {
    stack.path.forEach(element => {
      if (areVectorsEqual(findVector(element), vector)) {
        setIsStack(true);
      }
    });
  }

  return(
    <div>
      {vector &&
        <div className="flex flex-col text-center pb-5">        
              <span className="text-xs">H:{h} G:{g} F:{h + g}</span>      
              <div className={`flex ${(areVectorsEqual(vector, targetMatrix) || (done && isStack)) ? "bg-green-600" : areVectorsEqual(vector, actual) ? "bg-blue-600" : visited ? "bg-red-600" : ""} flex-row w-14`}>
                <Square value={vector[0][0]}/>
                <Square value={vector[0][1]}/>
                <Square value={vector[0][2]}/>
              </div>
              <div className={`flex ${(areVectorsEqual(vector, targetMatrix) || (done && isStack))  ? "bg-green-600" : areVectorsEqual(vector, actual)? "bg-blue-600" : visited ? "bg-red-600" : ""} flex-row w-14`}>
                <Square value={vector[1][0]}/>
                <Square value={vector[1][1]}/>
                <Square value={vector[1][2]}/>
              </div>
              <div className={`flex ${(areVectorsEqual(vector, targetMatrix) || (done && isStack))  ? "bg-green-600" : areVectorsEqual(vector, actual) ? "bg-blue-600" : visited ? "bg-red-600" : ""} flex-row w-14`}>
                <Square value={vector[2][0]}/>
                <Square value={vector[2][1]}/>
                <Square value={vector[2][2]}/>
              </div>        
        </div>
        }
    </div>
  );
}

export default Block;