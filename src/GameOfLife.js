// src/gameOfLife.js

export const createEmptyGrid = (numRows, numCols) => {
    return Array.from({ length: numRows }).map(() => Array.from({ length: numCols }).fill(false));
  };
  
  export const nextGeneration = grid => {
    const numRows = grid.length;
    const numCols = grid[0].length;
  
    const newGrid = createEmptyGrid(numRows, numCols);
  
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const neighbors = countNeighbors(grid, row, col);
  
        if (grid[row][col]) {
          if (neighbors === 2 || neighbors === 3) {
            newGrid[row][col] = true;
          }
        } else {
          if (neighbors === 3) {
            newGrid[row][col] = true;
          }
        }
      }
    }
  
    return newGrid;
  };
  
  const countNeighbors = (grid, row, col) => {
    const numRows = grid.length;
    const numCols = grid[0].length;
  
    let count = 0;
  
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
  
        const newRow = row + i;
        const newCol = col + j;
  
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
          count += grid[newRow][newCol] ? 1 : 0;
        }
      }
    }
  
    return count;
  };
  