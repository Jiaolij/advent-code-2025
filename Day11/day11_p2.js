import fs from "fs";

const parseGraph = input =>
  Object.fromEntries(
    input
      .trim()
      .split("\n")
      .map((line) => {
        const [node, rest] = line.split(":");
        const targets = rest.trim() ? rest.trim().split(/\s+/) : [];
        return [node.trim(), targets];
      })
  );

const countPathsWithRequired = (input, start = "svr", end = "out", required = []) => {
  const graph = parseGraph(input);
  const memo = new Map();
  const requiredSet = new Set(required);

  const dfs = (node, remainingRequired) => {
    if (node === end) return remainingRequired.size === 0 ? 1 : 0;

    const key = `${node}|${[...remainingRequired].sort().join(",")}`;
    if (memo.has(key)) return memo.get(key);

    const count = (graph[node] || [])
      .filter((next) => true)
      .reduce((acc, next) => {
        const newRemaining = new Set(remainingRequired);
        newRemaining.delete(next);
        return acc + dfs(next, newRemaining);
      }, 0);

    memo.set(key, count);
    return count;
  };

  const initialRemaining = new Set(requiredSet);
  // remove start if it is required
  initialRemaining.delete(start);
  return dfs(start, initialRemaining);
};

const input = fs.readFileSync("day11-input.txt", "utf8");
const totalPaths = countPathsWithRequired(input, "svr", "out", ["dac", "fft"]);
console.log("P2:", totalPaths);
