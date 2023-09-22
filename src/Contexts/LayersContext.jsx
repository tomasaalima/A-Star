/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";


const LayersContext = createContext({});

function LayersProvider({ children }) {
 
  const origin = [
    [1, 2, 3], 
    [9, 4, 8],
    [6, 5, 7],
  ];

  const targetMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  function Node(vector, xFather, yFather) {
    this.vector = vector;
    this.xFather = xFather;
    this.yFather = yFather;
  }
  
  Node.prototype.getFather = function() {
    return [this.xFather, this.yFather];
  };
  

  const [ actual, setActual ] = useState(origin);

  const [ stack, setstack ] = useState({path: [], vector: null, father: null})

  const [ run, setRun ] = useState(false);

  const [ done, setDone ] = useState(false);

  const [actualCoords, setCoords ] = useState({x:0, y:0});

  const [ visited, setVisited ] = useState([[origin],]);

  const [ known, setKnown ] = useState([[origin],]);

  const [ layers, setLayers ] = useState([[origin],]);

  const [ borns, setBorns ] = useState([new Node(origin, "n/a", "n/a")]);

  
  useEffect(() => {
    if (layers.length > 1) {
      const data = getNext();

      const newKnown = known.map((linha, linhaIndex) => {
        if (linhaIndex === data.x) {
          if (data.y === 99) {
            return linha;
          }
          return linha.filter((elemento, colunaIndex) => colunaIndex !== data.y);
        }
        return linha;
      });

      const vector = known[data.x][data.y];

      if (!visited.some(element => areVectorsEqual(element, vector))) {
        setActual(vector); 
        setCoords({x: data.x, y: data.y});    
        setVisited([...visited, vector]);
        setKnown(newKnown);
      }
    }
  }, [layers]);

  useEffect(() => {
    if (areVectorsEqual(actual, targetMatrix)){
      setstack(data => ({
        ...data,
        vector: targetMatrix,
        father: findFather(targetMatrix)
      }));
      setRun(true);
    }
  }, [actual]);

  useEffect(() => {
    if (run) {
      if (!areVectorsEqual(stack.vector, origin)) {
        doThis();
      } else {
        setDone(true);
      }
    }
  }, [run, stack]);

  useEffect(() => {
    if (done) {
      setstack(data => ({
        ...data,
        path: removeDuplicates(stack.path),
      }));

    }
  }, [done]);

  const removeDuplicates = (array) => {
    const uniqueArray = [];
    array.forEach(value => {
      const isDuplicate = uniqueArray.some(item =>
        item.every((val, index) => val === value[index])
      );
      if (!isDuplicate) {
        uniqueArray.push(value);
      }
    });
    return uniqueArray;
  }

  const doThis = () => {    
      setstack({
        path: [...stack.path, stack.father],
        vector: findVector(stack.father),
        father: findFather(stack.vector),
      });
  }

  const findFather = (vector) => {
      let fatherCoords =  [];
      
      borns.forEach(object => {
        if (areVectorsEqual(object.vector, vector)) {
          fatherCoords = [object.xFather, object.yFather];
        }
      });

      return fatherCoords;
    };

    const findVector = (vector) => {
      return layers[vector[0]][vector[1]] ? layers[vector[0]][vector[1]] : "N/A";
    }
  

  const getNext = () => {

    let data =  {
      x: 0,
      y: 0,
      distance: 9999,
    };

    known.forEach((subarray, line) => {

      if (!subarray[0] || line === 0  ) {
        return 0;
      }

      if (!subarray[0][0][0]) {
        if (!visited.some(element => areVectorsEqual(element, subarray))) {
          const distance = calculateManhattanDistance(subarray, targetMatrix) + line;
  
          if (distance <= data.distance) {
            data.x = line;
            data.y = 99;
            data.distance = distance;
          }
        }

      } else {
        subarray.forEach((vector, column) => {    
          
          if (!visited.some(element => areVectorsEqual(element, vector))) {
            const distance = calculateManhattanDistance(vector, targetMatrix) + line;

            if (distance <= data.distance) {
              data.x = line;
              data.y = column;
              data.distance = distance;
            }
          }

        })
      }
    });

    return data;
  }

  //VECTOR COMPARE
  function areVectorsEqual(vector1, vector2) {
    if (vector1.length !== vector2.length) {
      return false;
    }
  
    for (let row = 0; row < vector1.length; row++) {
      if (vector1[row].length !== vector2[row].length) {
        return false;
      }
      
      for (let col = 0; col < vector1[row].length; col++) {
        if (vector1[row][col] !== vector2[row][col]) {
          return false;
        }
      }
    }
  
    return true;
  }

  //LAYER EXPLORER
  const layerExplore = (vector) => {
    var blocks = [];
    var blankCoords = [];

    vector.forEach(((set, l) => {
      set.forEach((element, c) => element === 9 ? blankCoords = [l,c] : null)

    }));

    //ABOVE
    const above = blankCoords[0] > 0 ? vector[blankCoords[0] - 1][blankCoords[1]] : null;

    if (above !== null) {
      const copy = deepClone(vector);

      copy[blankCoords[0] - 1][blankCoords[1]] = 9;
      copy[blankCoords[0]][blankCoords[1]] = above; 

      if (!visited.some(vector => areVectorsEqual(vector, copy))) {
        blocks.push([...copy]);
      }
    }

    //BELOW
    const below = blankCoords[0] < vector.length - 1 ? vector[blankCoords[0] + 1][blankCoords[1]] : null;

    if (below !== null) {
      const copy = deepClone(vector);

      copy[blankCoords[0] + 1][blankCoords[1]] = 9;
      copy[blankCoords[0]][blankCoords[1]] = below;
    
      if (!visited.some(vector => areVectorsEqual(vector, copy))) {
        blocks.push([...copy]);
      }
    }

    //LEFT
    const left = blankCoords[1] > 0 ? vector[blankCoords[0]][blankCoords[1] - 1] : null;

    if (left !== null) {
      const copy = deepClone(vector);

      copy[blankCoords[0]][blankCoords[1] - 1] = 9;
      copy[blankCoords[0]][blankCoords[1]] = left;
    
      if (!visited.some(vector => areVectorsEqual(vector, copy))) {
        blocks.push([...copy]);
      }
    }

    //RIGHT
    const right = blankCoords[1] < vector[0].length - 1 ? vector[blankCoords[0]][blankCoords[1] + 1] : null;

    if (right !== null) {
      const copy = deepClone(vector);

      copy[blankCoords[0]][blankCoords[1] + 1] = 9;
      copy[blankCoords[0]][blankCoords[1]] = right;

      if (!visited.some(vector => areVectorsEqual(vector, copy))) {
        blocks.push([...copy]);
      }
    }

    const blocksArray = blocks.filter(vector => !areVectorsEqual(vector, [...origin]));

    const newBorns = blocksArray.map(vector => new Node(vector, actualCoords.x, actualCoords.y));

    setBorns(borns.concat(...newBorns));
    
    const amendment = layers.map((set, line) => {
      if (line !== actualCoords.x + 1) {
        return set;
      } else {
        let copy = [...set];
        blocksArray.forEach(element => copy.push(element));
        
        return copy;
      }
    });

    let newLayer = [];

    if (amendment.length === actualCoords.x + 1 ) {
      newLayer = [...amendment, blocksArray ];
    } else {
      newLayer = [...amendment];
    }

    const knownAmendment = known.map((set, line) => {
      if (line !== actualCoords.x + 1) {
        return set;
      } else {
        let copy = [...set];
        blocksArray.forEach(element => copy.push(element));
        
        return copy;
      }
    });

    let newKnown = [];

    if (knownAmendment.length === actualCoords.x + 1 ) {
      newKnown = [...knownAmendment, blocksArray ];
    } else {
      newKnown = [...knownAmendment];
    }

    setLayers(newLayer);
    setKnown(newKnown);
  }

  //DEEP CLONE
  function deepClone(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => deepClone(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = deepClone(obj[key]);
      }
      return newObj;
    } else {
      return obj;
    }
  }

  //FIND POSITION
  function findNumberPosition(matrix, number) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === number) {
          return [row, col];
        }
      }
    }
    return null; 
  }

  //DISTANCE CALCULATION
  function manhattanDistance(position1, position2) {
    const dx = Math.abs(position1[0] - position2[0]);
    const dy = Math.abs(position1[1] - position2[1]);
    return dx + dy;
  }
  
  function calculateManhattanDistance(matrix, targetMatrix) {
    let totalDistance = 0;
  
    for (let num = 0; num < matrix.length * matrix[0].length; num++) {
      const currentPosition = findNumberPosition(matrix, num);
      const targetPosition = findNumberPosition(targetMatrix, num);
  
      if (currentPosition && targetPosition) {
        totalDistance += manhattanDistance(currentPosition, targetPosition);
      }
    }
  
    return totalDistance;
  }

  return (
    <LayersContext.Provider value={{actual, layers, layerExplore, calculateManhattanDistance, areVectorsEqual, targetMatrix, done, stack, findVector}}>
      {children}
    </LayersContext.Provider>
  );
}

export { LayersContext, LayersProvider };