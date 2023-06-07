/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar(props) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handler = () => setShowMenu(false);

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    }
  });

  function toggleMenu(e) {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  return (
  <div id="NavBar">
    <nav>
      <div className="header">
        <a href="index.html">Pathfinding Visualizer</a>
      </div>
      <ul className="navigation">
        <li className={showMenu ? "dropdown highlight" : "dropdown"}>
          <a href="#" onClick={(e) => {toggleMenu(e)}}>Algorithms <span className="caret"></span></a>
          {showMenu && (
          <ul className="dropdown-menu">
            <li>Dijkstra's Algorithm</li>
            <li>A* Search</li>
            <li>Breadth-first Search</li>
          </ul>
          )}
        </li>
        <li><a href="#">Maze</a></li>
        <li><button id="visualize-button" onClick={props.visualizeDijkstra}>Visualize!</button></li>
        <li><a href="#">Clear Board</a></li>
        <li><a href="#">Clear Walls</a></li>
        <li><a href="#">Clear Path</a></li>
      </ul>
    </nav>
  </div>
  )
}

export default NavBar;
