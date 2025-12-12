const fs = require("fs");

const bitmask = indices => indices.reduce((m, i) => m | (1 << i), 0);

const parseMachine = line => {
  const indicator = line.match(/\[(.*?)\]/)[1];
  const target = [...indicator].reduce(
    (m, ch, i) => ch === "#" ? (m | (1 << i)) : m,
    0
  );
  const buttons = [...line.matchAll(/\((.*?)\)/g)]
    .map(m => m[1].split(",").filter(Boolean).map(Number))
    .map(bitmask);

  return { target, buttons };
};

// Bidirectional BFS for minimum presses
const solveMachine = ({ target, buttons }) => {
  if (target === 0) return 0;

  let front = new Map([[0, 0]]);
  let back = new Map([[target, 0]]);

  const buttonMasks = buttons;

  while (front.size && back.size) {
    // expand smaller side
    let [curSide, otherSide] =
      front.size < back.size ? [front, back] : [back, front];

    const next = new Map();

    for (const [state, dist] of curSide.entries()) {
      for (const mask of buttonMasks) {
        const nextState = state ^ mask;

        // Found meeting point
        if (otherSide.has(nextState)) {
          return dist + 1 + otherSide.get(nextState);
        }

        if (!curSide.has(nextState) && !next.has(nextState)) {
          next.set(nextState, dist + 1);
        }
      }
    }

    if (curSide === front) {
        front = next;
    } else {
        back = next;
    }
  }

  return Infinity;
};

const solveAllMachines = text =>
  text
    .trim()
    .split(/\n+/)
    .map(parseMachine)
    .map(solveMachine)
    .reduce((a, b) => a + b, 0);

const input = fs.readFileSync("day10-input.txt", "utf8").trim();
console.log("P1:", solveAllMachines(input));