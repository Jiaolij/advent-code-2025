const fs = require("fs");

// Helpers
const getDistance = (c1, c2) => {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const dz = c1.z - c2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const unionFind = (map, g1, g2) => {
  for (let [coord, group] of map.entries()) {
    if (group === g1) map.set(coord, g2);
  }
};

const parseInput = (filename) => {
  const input = fs.readFileSync(filename, "utf-8").trim().split("\n");

  const coords = [];
  const map = new Map();

  input.forEach((line, i) => {
    const [x, y, z] = line.split(",").map(Number);
    const coord = { x, y, z };
    coords.push(coord);
    map.set(coord, i);
  });

  return { coords, map };
};

const calculateDistances = coords => {
  const dist = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const distVal = getDistance(coords[i], coords[j]);
      dist.push({ c1: coords[i], c2: coords[j], dist: distVal });
    }
  }

  dist.sort((a, b) => a.dist - b.dist);
  return dist;
};

// P1
const solvePart1 = (map, dist) => {
  const mapCopy = new Map(map);

  // Union-find on the smallest 1000 connections
  for (let i = 0; i < 1000; i++) {
    const { c1, c2 } = dist[i];
    const g1 = mapCopy.get(c1);
    const g2 = mapCopy.get(c2);
    if (g1 !== g2) {
      unionFind(mapCopy, g1, g2);
    }
  }

  // Count the size of each group
  const sizes = [...mapCopy.values()].reduce((acc, group) => {
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const sizeList = Object.values(sizes).sort((a, b) => b - a);

  return sizeList[0] * sizeList[1] * sizeList[2];
};

// P2
const solvePart2 = (map, dist) => {
  const mapCopy = new Map(map);

  let connectedCount = new Set(mapCopy.values()).size;
  let lastConnected = null;

  // Union-find until all junction boxes are in one circuit
  for (let i = 0; i < dist.length; i++) {
    const { c1, c2 } = dist[i];
    const g1 = mapCopy.get(c1);
    const g2 = mapCopy.get(c2);

    if (g1 !== g2) {
      unionFind(mapCopy, g1, g2);
      connectedCount--;
      lastConnected = { c1, c2 };

      if (connectedCount === 1) {
        break;
      }
    }
  }

  return lastConnected.c1.x * lastConnected.c2.x;
};

const { coords, map } = parseInput("day8-input.txt");
const dist = calculateDistances(coords);

console.log("P1", solvePart1(map, dist));
console.log("P2", solvePart2(map, dist));
