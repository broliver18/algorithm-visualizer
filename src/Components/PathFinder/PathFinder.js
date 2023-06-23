import React, { useState, useEffect } from "react";
import "./PathFinder.css";

import Node from "../Node/Node";
import NavBar from "../NavBar/NavBar";
import Legend from "../Legend/Legend";
import { recursiveDivision } from "../../Algorithms/RecursiveDivision";
import { astar } from "../../Algorithms/astar";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../Algorithms/Dijkstra";

function PathFinder() {
  const [grid, setGrid] = useState([]);
  const [isVisualized, setIsVisualized] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isStartSelected, selectStart] = useState(false);
  const [isTargetSelected, selectTarget] = useState(false);
  const [usedToBeWall, setUsedToBeWall] = useState(false);
  const [startNodeRow, setStartNodeRow] = useState(
    Math.floor(document.documentElement.clientHeight / 78)
  );
  const [startNodeCol, setStartNodeCol] = useState(
    Math.floor(document.documentElement.clientWidth / 100)
  );
  const [targetNodeRow, setTargetNodeRow] = useState(
    Math.floor(document.documentElement.clientHeight / 78)
  );
  const [targetNodeCol, setTargetNodeCol] = useState(
    Math.floor(document.documentElement.clientWidth / 34)
  );

  useEffect(() => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);
  }, []);

  function handleMouseDown(row, col, isStart, isFinish) {
    if (isStart) {
      selectStart(true);
    } else if (isFinish) {
      selectTarget(true);
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
    setIsMousePressed(true);
  }

  function handleMouseEnter(row, col, isStart, isFinish, isWall) {
    if (!isMousePressed) return;
    if (isStart || isFinish) return;
    if (isStartSelected || isTargetSelected) {
      if (isWall) setUsedToBeWall(true);
      const newGrid = moveStartOrFinishEnter(grid, row, col);
      setGrid(newGrid);
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
  }

  function handleMouseLeave(row, col) {
    setUsedToBeWall(false);
    if (!isMousePressed) return;
    if (isStartSelected || isTargetSelected) {
      const newGrid = moveStartOrFinishLeave(grid, row, col);
      setGrid(newGrid);
    }
  }

  function handleMouseUp() {
    setIsMousePressed(false);
    selectStart(false);
    selectTarget(false);
  }

  function clearBoard() {
    const newGrid = getInitialGrid();
    setGrid(newGrid);

    const gridWidth = Math.floor(document.documentElement.clientWidth / 25);
    const gridHeight = Math.floor(document.documentElement.clientHeight / 39);
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
    setIsVisualized(false);
  }

  function clearPath() {
    const newGrid = grid.slice();
    const gridWidth = Math.floor(document.documentElement.clientWidth / 25);
    const gridHeight = Math.floor(document.documentElement.clientHeight / 39);
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const currentNode = newGrid[row][col];
        if (!currentNode.isWall) {
          const newNode = {
            ...currentNode,
            distance: Infinity,
            isVisited: false,
          };
          newGrid[row][col] = newNode;
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    setIsVisualized(false);
  }

  function clearWalls() {
    if (isVisualized) clearBoard();
    else {
      const newGrid = grid.slice();
      const gridWidth = Math.floor(document.documentElement.clientWidth / 25);
      const gridHeight = Math.floor(document.documentElement.clientHeight / 39);
      for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
          const currentNode = newGrid[row][col];
          if (currentNode.isWall) {
            const newNode = {
              ...currentNode,
              isWall: false,
            };
            newGrid[row][col] = newNode;
            document.getElementById(`node-${row}-${col}`).className = "node";
          }
        }
      }
      setGrid(newGrid);
    }
  }

  function visualizeAlgorithm(algorithm) {
    if (isVisualized) clearPath();
    const startNode = grid[startNodeRow][startNodeCol];
    const targetNode = grid[targetNodeRow][targetNodeCol];
    let visitedNodesInOrder;
    if (algorithm === "dijkstra")
      visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    else if (algorithm === "astar")
      visitedNodesInOrder = astar(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    setIsVisualized(true);
  }

  function visualizeMaze() {
    clearWalls();
    const gridWidth = Math.floor(document.documentElement.clientWidth / 25);
    const gridHeight = Math.floor(document.documentElement.clientHeight / 39);
    const nodeWalls = recursiveDivision(
      grid,
      [],
      2,
      gridHeight - 3,
      2,
      gridWidth - 3,
      "horizontal",
      false
    );
    animateMaze(nodeWalls);
  }

  return (
    <div>
      <NavBar
        visualizeAlgorithm={visualizeAlgorithm}
        visualizeMaze={visualizeMaze}
        clearWalls={clearWalls}
        clearBoard={clearBoard}
        clearPath={clearPath}
      />
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
      isFinish: row === targetNodeRow && col === targetNodeCol,
      distance: Infinity,
      totalDistance: Infinity,
      heurisitcDistance: null,
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
    } else if (isTargetSelected) {
      setTargetNodeRow(row);
      setTargetNodeCol(col);
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
      if (usedToBeWall) {
        const newNode = {
          ...node,
          isStart: false,
          isWall: true,
        };
        newGrid[row][col] = newNode;
      } else {
        const newNode = {
          ...node,
          isStart: false,
        };
        newGrid[row][col] = newNode;
      }
    } else if (isTargetSelected) {
      setTargetNodeRow(row);
      setTargetNodeCol(col);
      const node = newGrid[row][col];
      if (usedToBeWall) {
        const newNode = {
          ...node,
          isFinish: false,
          isWall: true,
        };
        newGrid[row][col] = newNode;
      } else {
        const newNode = {
          ...node,
          isFinish: false,
        };
        newGrid[row][col] = newNode;
      }
    }
    return newGrid;
  }

  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
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

  function animateMaze(wallNodes) {
    const newGrid = grid.slice();
    for (let i = 0; i < wallNodes.length; i++) {
      setTimeout(() => {
        const node = wallNodes[i];
        const { row, col } = node;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-maze";
        const currentNode = newGrid[row][col];
        const newNode = {
          ...currentNode,
          isWall: true,
        };
        newGrid[row][col] = newNode;
      }, 10 * i);
    }
    setGrid(newGrid);
  }
}

export default PathFinder;
