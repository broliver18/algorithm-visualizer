import React, { useState, useEffect } from "react";
import "./PathFinder.css";

import Node from "../Node/Node";
import NavBar from "../NavBar/NavBar";
import Legend from "../Legend/Legend";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../Algorithms/Dijkstra";

function PathFinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isStartSelected, selectStart] = useState(false);
  const [isFinishSelected, selectFinish] = useState(false);
  const [startNodeRow, setStartNodeRow] = useState(Math.floor(document.documentElement.clientHeight / 78));
  const [startNodeCol, setStartNodeCol] = useState(Math.floor(document.documentElement.clientWidth / 100));
  const [finishNodeRow, setFinishNodeRow] = useState(Math.floor(document.documentElement.clientHeight / 78));
  const [finishNodeCol, setFinishNodeCol] = useState(Math.floor(document.documentElement.clientWidth / 34));

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

  function visualizeAlgorithm(algorithm) {
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    let visitedNodesInOrder;
    if (algorithm === "dijkstra")
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <div>
      <NavBar visualizeAlgorithm={visualizeAlgorithm} />
      <Legend />
      <table>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <td key={nodeIdx}>
                      <Node
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
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
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
    const gridWidth = Math.floor(document.documentElement.clientWidth / 25);
    const gridHeight = Math.floor(document.documentElement.clientHeight / 39);
  
    for (let row = 0; row < gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < gridWidth; col++) {
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
        isWall: false,
      };
      newGrid[row][col] = newNode;
    } else if (isFinishSelected) {
      setFinishNodeRow(row);
      setFinishNodeCol(col);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isFinish: true,
        isWall: false,
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
