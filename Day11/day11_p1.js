import fs from "fs";

const readInput = filePath => fs.readFileSync(filePath, "utf8");

const parseGraph = input =>
  Object.fromEntries(
    input.trim().split("\n").map((line) => {
      const [node, rest] = line.split(":");
      const targets = rest.trim() ? rest.trim().split(/\s+/) : [];
      return [node.trim(), targets];
    })
  );

const findAllPaths = (graph, start = "you", end = "out") => {
  const dfs = (node, path = []) =>
    node === end
      ? [[...path, node]]
      : (graph[node] || [])
          .filter((next) => !path.includes(next))
          .flatMap((next) => dfs(next, [...path, node]));

  return dfs(start);
};

const countPaths = (graph, start = "you", end = "out") =>
  findAllPaths(graph, start, end).length;


const input = readInput("day11-input.txt");
const graph = parseGraph(input);
// console.log("All paths:", findAllPaths(graph));
console.log("P1:", countPaths(graph));
