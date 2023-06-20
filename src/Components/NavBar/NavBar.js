/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState();

  const initializeSearch = (algorithm) => props.visualizeAlgorithm(algorithm);

  useEffect(() => {
    const handler = () => setShowMenu(false);

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  function toggleMenu(e) {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  function renderAction(algorithm) {
    if (algorithm === undefined)
      return <button id="visualize-button">Select Algorithm</button>;
    else if (algorithm === "dijkstra")
      return (
        <button
          id="visualize-button"
          onClick={() => initializeSearch("dijkstra")}
        >
          Visualize Dijkstra's!
        </button>
      );
  }

  return (
    <div id="NavBar">
      <nav>
        <div className="header">
          <a href="index.html">Pathfinding Visualizer</a>
        </div>
        <ul className="navigation">
          <li className={showMenu ? "dropdown highlight" : "dropdown"}>
            <a
              href="#"
              onClick={(e) => {
                toggleMenu(e);
              }}
            >
              Algorithms <span className="caret"></span>
            </a>
            {showMenu && (
              <ul className="dropdown-menu">
                <li onClick={() => setSelectedAlgorithm("dijkstra")}>
                  Dijkstra's Algorithm
                </li>
                <li>A* Search</li>
                <li>Breadth-first Search</li>
              </ul>
            )}
          </li>
          <li>
            <a href="#">Create Maze</a>
          </li>
          <li>{renderAction(selectedAlgorithm)}</li>
          <li>
            <a href="#" onClick={props.clearBoard}>Clear Board</a>
          </li>
          <li>
            <a href="#" onClick={props.clearWalls}>
              Clear Walls
            </a>
          </li>
          <li>
            <a href="#" onClick={props.clearPath}>Clear Path</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
