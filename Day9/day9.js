import fs from 'fs';

// Helpers
const readFile = file => fs.readFileSync(file, 'utf8').trim();

const parseCoordinates = text =>
  text
    .split(/\r?\n/)
    .map(line => line.split(',').map(Number))
    .filter(([x, y]) => !isNaN(x) && !isNaN(y));

const sortPair = (a, b) => (a < b ? [a, b] : [b, a]);

const rectangleArea = (x1, y1, x2, y2) => (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);

const manhattanDistance = ([x1, y1], [x2, y2]) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

// P1
const findMaxAreaPair = points => 
  points.flatMap((p1, i) =>
    points.slice(i + 1).map(p2 => ({ p1, p2 }))
  ).reduce((max, { p1, p2 }) => {
    const area = rectangleArea(p1[0], p1[1], p2[0], p2[1]);
    return area > max.maxArea ? { maxArea: area, bestPair: [p1, p2] } : max;
  }, { maxArea: 0, bestPair: null });

// P2
class Edge {
  constructor([x1, y1], [x2, y2]) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }
}

const intersects = (edges, minX, minY, maxX, maxY) =>
  edges.some(({ x1, y1, x2, y2 }) => {
    const [iMinX, iMaxX] = sortPair(x1, x2);
    const [iMinY, iMaxY] = sortPair(y1, y2);
    return minX < iMaxX && maxX > iMinX && minY < iMaxY && maxY > iMinY;
  });

const executePart2 = tiles => {
  const edges = tiles.slice(0, -1).map((from, i) => new Edge(from, tiles[i + 1]));
  
  // close polygon
  edges.push(new Edge(tiles[0], tiles[tiles.length - 1]));

  return tiles.flatMap((fromTile, i) =>
    tiles.slice(i).map(toTile => ({ fromTile, toTile }))
  ).reduce((maxArea, { fromTile, toTile }) => {
    const [minX, maxX] = sortPair(fromTile[0], toTile[0]);
    const [minY, maxY] = sortPair(fromTile[1], toTile[1]);
    const dist = manhattanDistance(fromTile, toTile);

    if (dist * dist <= maxArea) return maxArea;
    if (intersects(edges, minX, minY, maxX, maxY)) return maxArea;

    const area = rectangleArea(...fromTile, ...toTile);

    return Math.max(maxArea, area);
  }, 0);
};

const file = 'day9-input.txt';
const points = parseCoordinates(readFile(file));

console.log('P1:', findMaxAreaPair(points).maxArea);
console.log('P2:', executePart2(points));
