import React, { useState, useEffect } from "react";
import "./PathFinder.css";

import Node from "../Node/Node";

function PathFinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);

  const startNodeRow = 10;
  const startNodeCol = 15;
  const finishNodeRow = 10;
  const finishNodeCol = 35;

  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  function handleMouseDown(row, col) {
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!isMousePressed) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  }

  const handleMouseUp = () => setIsMousePressed(false);

  return (
    <div>
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isMousePressed={isMousePressed}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  function createNode(col, row) {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  function getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  function toggleWall(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
}

export default PathFinder;
