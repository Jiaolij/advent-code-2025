const fs = require("fs");

const rawInput = fs.readFileSync("day5-input.txt", "utf8").trim();
const [rangeInputs, idsInputs] = rawInput.split(/\n\s*\n/);

const parseRanges = text => {
  return text
    .trim()
    .split(/\n+/)
    .map(line => {
      const [start, end] = line.split("-").map(Number);
      return { start, end };
    });
}

const parseIds = text => text.trim().split(/\n+/).map(Number);

// P1
const countFreshIngredients = (rangeInputs, idsInputs) => {
  const ranges = parseRanges(rangeInputs);
  const ids = parseIds(idsInputs);

  const isFresh = id => ranges.some(r => id >= r.start && id <= r.end);

  return ids.filter(isFresh).length;
}

console.log("P1:", countFreshIngredients(rangeInputs, idsInputs));



// P2
const countFreshIDs = rangeInput => {
  const ranges = parseRanges(rangeInput);
  ranges.sort((a, b) => a.start - b.start);

  // Merge overlapping/touching ranges
  const merged = [];
  let current = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const nextRange = ranges[i];

    const overlapsOrTouches = nextRange.start <= current.end + 1;

    if (overlapsOrTouches) {
      current.end = Math.max(current.end, nextRange.end);
    } else {
      merged.push(current);
      current = nextRange;
    }
  }
  merged.push(current);

  let total = 0;
  for (const range of merged) {
    const count = range.end - range.start + 1;
    total += count;
  }

  return total;
}

console.log("P2:", countFreshIDs(rangeInputs));
