const fs = require("fs");

// Helpers
const parseGrid = input => input.trim().split("\n").map(row => [...row]);

const findStartPosition = grid =>
  grid.flatMap((rowCells, rowIndex) => rowCells.map((cellValue, colIndex) => cellValue === "S" ? { col: colIndex, row: rowIndex } : null))
      .find(Boolean) ?? { col: 0, row: 0 };

const isInsideGrid = (grid, columnIndex, rowIndex) => {
  const rowIsValid = rowIndex >= 0 && rowIndex < grid.length;
  const colIsValid = columnIndex >= 0 && columnIndex < grid[0].length;
  return rowIsValid && colIsValid;
};

const locationKey = (col, row) => `${col},${row}`;


// P1: count splits
const countBeamSplits = input => {
  const grid = parseGrid(input);
  const { col: startColumn, row: startRow } = findStartPosition(grid);

  let activeBeams = [{ col: startColumn, row: startRow + 1 }];
  const visitedCells = new Set();

  let totalSplits = 0;

  while (activeBeams.length > 0) {
    // Generate the next set of beams from the current beams
    const nextBeams = activeBeams.flatMap(({ col: beamCol, row: beamRow }) => {
      if (!isInsideGrid(grid, beamCol, beamRow)) return [];

      const cellKey = locationKey(beamCol, beamRow);
      if (visitedCells.has(cellKey)) return [];

      visitedCells.add(cellKey);

      const currentTile = grid[beamRow][beamCol];

      switch (currentTile) {
        case "^":
          totalSplits++;
          return [
            // beam splits left
            { col: beamCol - 1, row: beamRow + 1 },
            // beam splits right
            { col: beamCol + 1, row: beamRow + 1 }
          ];

        case ".":
        case "S":
          // beam continues straight
          return [{ col: beamCol, row: beamRow + 1 }];

        default:
          // empty for any other tiles
          return [];
      }
    });

    activeBeams = nextBeams;
  }

  return totalSplits;
}


// P2: count time line
const countAllTimelines = input => {
  const grid = parseGrid(input);
  const height = grid.length;
  const width = grid[0].length;
  const { col: startColumn, row: startRow } = findStartPosition(grid);

  // Initialize timeline counts grid
  let timelines = Array.from({ length: height + 1 }, () =>
    Array(width).fill(0)
  );
  timelines[startRow + 1][startColumn] = 1;

  let completedTimelineCount = 0;

  const addTimelineOrComplete = (col, row, amount) => {
    if (isInsideGrid(grid, col, row)) {
      timelines[row][col] += amount;
    } else {
      completedTimelineCount += amount;
    }
  };

  // Process each row of timelines
  timelines = timelines.map((rowTimelines, rowIndex) =>
    rowTimelines.map((timelineCount, colIndex) => {
      if (timelineCount === 0 || rowIndex === 0) return timelineCount;

      const currentTile = grid[rowIndex][colIndex];
      const nextRow = rowIndex + 1;

      switch (currentTile) {
        case ".":
        case "S":
          addTimelineOrComplete(colIndex, nextRow, timelineCount);
          break;

        case "^":
          addTimelineOrComplete(colIndex - 1, nextRow, timelineCount);
          addTimelineOrComplete(colIndex + 1, nextRow, timelineCount);
          break;
      }

      return timelineCount;
    })
  );

  return completedTimelineCount;
}


// ---------- Run ---------- //
const inputData = fs.readFileSync("day7-input.txt", "utf8");
console.log("P1 - countBeamSplits", countBeamSplits(inputData));
console.log("P2 - countAllTimelines", countAllTimelines(inputData));
