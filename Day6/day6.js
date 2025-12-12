const fs = require("fs");

const readColumnsFromFile = (filePath) =>
  fs.readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .map(line => line.trim().split(/\s+/))
    .reduce((columns, row) => {
      row.forEach((value, i) => {
        columns[i] = columns[i] || [];
        columns[i].push(value);
      });
      return columns;
    }, []);

const applyOperator = (numbers, operator) =>
  operator === "*"
    ? numbers.reduce((acc, n) => acc * n, 1)
    : numbers.reduce((acc, n) => acc + n, 0);

// P1
const computeColumnResults = (columns) =>
  columns
    .map(col => {
      const operator = col[col.length - 1];
      const numbers = col.slice(0, -1).map(Number);
      return applyOperator(numbers, operator);
    })
    .reduce((sum, val) => sum + val, 0);

const columns = readColumnsFromFile("day6-input.txt");
console.log("P1 - finalSum:", computeColumnResults(columns));

// P2
const solveCephalopodMathTotal_1 = (input) => {
  const lines = input.split("\n");
  const width = Math.max(...lines.map(l => l.length));
  const height = lines.length;
  const paddedRows = lines.map(line => line.padEnd(width, " "));

  let total = 0;
  let currentGroup = [];

  for (let col = 0; col <= width; col++) { // note: <= to flush last group
    const isBlank = col === width || paddedRows.every(row => row[col] === " ");

    if (isBlank) {
      if (currentGroup.length) {
        // Solve this group
        const operator = paddedRows[height - 1][currentGroup[0]];
        const numbers = currentGroup
          .map(c =>
            paddedRows
              .slice(0, height - 1)
              .map(row => row[c])
              .filter(ch => /\d/.test(ch))
              .join("")
          )
          .filter(Boolean)
          .map(Number);

        total += applyOperator(numbers, operator);
        currentGroup = [];
      }
    } else {
      currentGroup.push(col);
    }
  }

  return total;
};

const puzzleInput = fs.readFileSync("day6-input.txt", "utf8").trimEnd();
console.log(solveCephalopodMathTotal_1(puzzleInput));
