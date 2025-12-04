const fs = require("fs");

const grid = fs.readFileSync("day4-input.txt", "utf-8").trim().split("\n").map(row => row.split(""));

const ROWS = grid.length;
const COLS = grid[0].length;
const NEIGHBORS = [
    [-1,-1], [-1,0], [-1,1],
    [ 0,-1],         [ 0,1],
    [ 1,-1], [ 1,0], [ 1,1],
];

const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

const countNeighbors = (r, c, g) => {
    let count = 0;
    for (const [dr, dc] of NEIGHBORS) {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc) && g[nr][nc] === "@") {
            count++;
        }
    }
    return count;
};

// P1
let accessible = 0;
const toRemove = [];

for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        if (grid[r][c] !== "@") continue;

        const neighbors = countNeighbors(r, c, grid);
        if (neighbors < 4) {
            accessible++;
            toRemove.push([r, c]);
        }
    }
}

console.log("Part 1:", accessible);

// P2
let removedTotal = 0;
const gridCopy = grid.map(row => [...row]);

while (toRemove.length > 0) {
    const newToRemove = [];
    removedTotal += toRemove.length;

    for (const [r, c] of toRemove) {
        // Remove roll
        gridCopy[r][c] = ".";
    }

    // Check neighbors of removed positions
    for (const [r, c] of toRemove) {
        for (const [dr, dc] of NEIGHBORS) {
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc) && gridCopy[nr][nc] === "@") {
                const neighbors = countNeighbors(nr, nc, gridCopy);
                if (neighbors < 4) {
                    newToRemove.push([nr, nc]);
                }
            }
        }
    }

    // Check and remove duplicates
    const seen = new Set();
    toRemove.length = 0;

    for (const pos of newToRemove) {
        const key = pos.join(",");
        if (!seen.has(key)) {
            seen.add(key);
            toRemove.push(pos);
        }
    }
}

console.log("Part 2:", removedTotal);
