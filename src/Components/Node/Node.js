import React from "react";
import "./Node.css";

function TargetIcon() {
  return (
    <svg viewBox="0 0 512 512" version="1.1" fill="#000000" stroke="#000000">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>circle-dot</title> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="drop" fill="#420863" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C331.15408,3.55271368e-14 426.666667,95.5125867 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 3.55271368e-14,331.15408 3.55271368e-14,213.333333 C3.55271368e-14,95.5125867 95.5125867,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.076736,42.6666667 42.6666667,119.076736 42.6666667,213.333333 C42.6666667,307.589931 119.076736,384 213.333333,384 C307.589931,384 384,307.589931 384,213.333333 C384,119.076736 307.589931,42.6666667 213.333333,42.6666667 Z M213.333333,106.666667 C272.243707,106.666667 320,154.42296 320,213.333333 C320,272.243707 272.243707,320 213.333333,320 C154.42296,320 106.666667,272.243707 106.666667,213.333333 C106.666667,154.42296 154.42296,106.666667 213.333333,106.666667 Z" id="Combined-Shape"> 
    </path> </g> </g> </g></svg>
  )
}

function Node(props) {
  const {
    col,
    row,
    isFinish,
    isStart,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = props;

  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";

    function renderAction() {
      if (isFinish) return <TargetIcon/>
    }

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col, isStart, isFinish)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
      onMouseUp={() => onMouseUp()}
    >{renderAction()}</div>
  );
}

export default Node;
