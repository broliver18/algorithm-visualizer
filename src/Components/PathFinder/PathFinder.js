import React, { useState } from 'react';
import './PathFinder.css';

import Node from '../Node/Node';

function PathFinder() {
    const [grid, setGrid] = useState([]);
    const [isMousePressed, setIsMousePressed] = useState(false);

    const startNodeRow = 10;
    const startNodeCol = 15;
    const finishNodeRow = 10;
    const finishNodeCol = 35;

    function createNode(col, row) {
        return {
            col,
            row,
            isStart: row === startNodeRow && col === startNodeCol,
            isFinish: row === finishNodeRow && col === finishNodeCol,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null
        };
    };

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
    };

    

    return (
        <div>

        </div>
    )
}

export default PathFinder;
