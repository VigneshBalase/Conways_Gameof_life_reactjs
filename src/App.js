import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Flex, Grid, Tooltip } from '@chakra-ui/react';
import { FiPlay, FiPause, FiPlus, FiMinus, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import './App.css';
import { createEmptyGrid, nextGeneration } from './GameOfLife';

const numRows = 30;
const numCols = 30;

const App = () => {
  const [grid, setGrid] = useState(() => createEmptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [cellSize, setCellSize] = useState(20);
  const [generationCount, setGenerationCount] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(prevGrid => {
      const newGrid = nextGeneration(prevGrid);
      setGenerationCount(prev => prev + 1);
      return newGrid;
    });
    setStepCount(prev => prev + 1);
    setTimeout(runSimulation, speedRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      runningRef.current = true;
      runSimulation();
    }
  }, [running, runSimulation]);

  const toggleCell = (row, col) => {
    const newGrid = grid.map((rows, rIdx) =>
      rows.map((cell, cIdx) => (rIdx === row && cIdx === col ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const randomizeGrid = () => {
    const newGrid = createEmptyGrid(numRows, numCols).map(row =>
      row.map(() => Math.random() > 0.7)
    );
    setGrid(newGrid);
    setGenerationCount(0);
    setStepCount(0);
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid(numRows, numCols));
    setGenerationCount(0);
    setStepCount(0);
  };

  return (
    <Flex className="chatgpt-interface">
      <Box className="sidebar" w="250px" bg="#1e1e1e" flexDirection="column">
        <Box className="sidebar-header" p="20px" fontSize="1.5em" bg="#292b2c" textAlign="center">
          Game of Life
        </Box>
        <Box className="sidebar-content" flex="1" p="20px" overflowY="auto">
          <p>Use the controls below to start, stop, and control the game grid.</p>
          <Box p="10px" bg="#292b2c" color="white" mt="20px">
            <strong>Generation Count:</strong> {generationCount}
          </Box>
          <Box p="10px" bg="#292b2c" color="white" mt="10px">
            <strong>Step Count:</strong> {stepCount}
          </Box>
        </Box>
        <Box className="sidebar-footer" p="20px" bg="#292b2c">
          <Tooltip label={running ? 'Stop Simulation' : 'Start Simulation'} placement="right">
            <Button onClick={() => setRunning(!running)} colorScheme="blue" leftIcon={running ? <FiPause /> : <FiPlay />}>
              {running ? 'Stop' : 'Start'}
            </Button>
          </Tooltip>
          <Tooltip label="Clear Grid" placement="right">
            <Button onClick={clearGrid} colorScheme="blue">
              Clear
            </Button>
          </Tooltip>
          <Tooltip label="Randomize Grid" placement="right">
            <Button onClick={randomizeGrid} colorScheme="blue">
              Random
            </Button>
          </Tooltip>
          <Tooltip label="Increase Speed" placement="right">
            <Button onClick={() => setSpeed(speed => Math.max(50, speed - 50))} colorScheme="blue" leftIcon={<FiPlus />}>
              Increase Speed
            </Button>
          </Tooltip>
          <Tooltip label="Decrease Speed" placement="right">
            <Button onClick={() => setSpeed(speed => speed + 50)} colorScheme="blue" leftIcon={<FiMinus />}>
              Decrease Speed
            </Button>
          </Tooltip>
          <Tooltip label="Zoom In" placement="right">
            <Button onClick={() => setCellSize(cellSize => Math.min(40, cellSize + 5))} colorScheme="blue" leftIcon={<FiZoomIn />}>
              Zoom In
            </Button>
          </Tooltip>
          <Tooltip label="Zoom Out" placement="right">
            <Button onClick={() => setCellSize(cellSize => Math.max(10, cellSize - 5))} colorScheme="blue" leftIcon={<FiZoomOut />}>
              Zoom Out
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Box className="chat-container" flex="1" flexDirection="column">
        <Box className="chat-header" p="20px" bg="#292b2c" display="flex" alignItems="center">
          <h2>Game Grid</h2>
        </Box>
        <Box className="chat-messages" flex="1" p="20px" overflowY="auto" bg="#151515">
          <Grid className="grid" margin="20px auto" templateColumns={`repeat(${numCols}, ${cellSize}px)`}>
            {grid.map((rows, rowIndex) =>
              rows.map((col, colIndex) => (
                <Box
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${col ? 'alive' : ''}`}
                  w={`${cellSize}px`}
                  h={`${cellSize}px`}
                  bg={col ? '#007bff' : '#333'}
                  border="1px solid #555"
                  onClick={() => toggleCell(rowIndex, colIndex)}
                />
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
};

export default App;
