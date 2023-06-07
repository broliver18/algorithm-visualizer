import React, { useState, useEffect } from "react";
import "./PathFinder.css";

import Node from "../Node/Node";
import NavBar from "../NavBar/NavBar";
import { dijkstra, getNodesInShortestPathOrder } from "../../Algorithms/Dijkstra";

function PathFinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isStartSelected, selectStart] = useState(false);
  const [isFinishSelected, selectFinish] = useState(false);
  const [startNodeRow, setStartNodeRow] = useState(10);
  const [startNodeCol, setStartNodeCol] = useState(15);
  const [finishNodeRow, setFinishNodeRow] = useState(10);
  const [finishNodeCol, setFinishNodeCol] = useState(35);

  useEffect(() => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);
  }, []);

  function handleMouseDown(row, col, isStart, isFinish) {
    if (isStart) {
      selectStart(true);
    } else if (isFinish) {
      selectFinish(true);
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
    setIsMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!isMousePressed) return;
    if (isStartSelected || isFinishSelected) {
      const newGrid = moveStartOrFinishEnter(grid, row, col);
      setGrid(newGrid);
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
  }

  function handleMouseLeave(row, col) {
    if (!isMousePressed) return;
    if (isStartSelected || isFinishSelected) {
      const newGrid = moveStartOrFinishLeave(grid, row, col);
      setGrid(newGrid);
    }
  }

  function handleMouseUp() {
    setIsMousePressed(false);
    selectStart(false);
    selectFinish(false);
  }

  function visualizeDijkstra() {
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <div>
      <NavBar visualizeDijkstra={visualizeDijkstra}/>
      <div id="grid">
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
                    onMouseLeave={handleMouseLeave}
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

  function createNode(row, col) {
    return {
      row,
      col,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  function getInitialGrid() {
    const newGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(row, col));
      }
      newGrid.push(currentRow);
    }
    return newGrid;
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

  function moveStartOrFinishEnter(grid, row, col) {
    const newGrid = grid.slice();
    if (isStartSelected) {
      setStartNodeRow(row);
      setStartNodeCol(col);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isStart: true,
      };
      newGrid[row][col] = newNode;
    } else if (isFinishSelected) {
      setFinishNodeRow(row);
      setFinishNodeCol(col);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isFinish: true,
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }

  function moveStartOrFinishLeave(grid, row, col) {
    const newGrid = grid.slice();
    if (isStartSelected) {
      setStartNodeRow(row);
      setStartNodeCol(col);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isStart: false,
      };
      newGrid[row][col] = newNode;
    } else if (isFinishSelected) {
      setFinishNodeRow(row);
      setFinishNodeCol(col);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isFinish: false,
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }
}

export default PathFinder;
