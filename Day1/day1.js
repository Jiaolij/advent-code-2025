const fs = require("fs");

// Load rotations from a file (one per line)
const rotations = fs.readFileSync("day1-input.txt", "utf-8")
                    .split("\n")
                    .map(line => line.trim())
                    .filter(Boolean);

// Starting position
let dial = 50;
let countZeros_1 = 0;
let countZeros_2 = 0;
const maxNum = 100;

const getZerosP1 = (direction, distance) => {
    if (direction === "L") {
        dial = (dial - distance + maxNum) % maxNum;
    } else if (direction === "R") {
        dial = (dial + distance) % maxNum;
    }

    if (dial === 0) {
        countZeros_1++;
    }
}

const getZerosP2 = (direction, distance) => {
    const step = direction === "R" ? 1 : -1;

    for (let i = 0; i < distance; i++) {
        dial = (dial + step + 100) % 100;
        if (dial === 0) countZeros_2++;
    }
}

for (const move of rotations) {
    const direction = move[0];
    const distance = parseInt(move.slice(1), 10);

    getZerosP1(direction, distance);
    getZerosP2(direction, distance);
}

console.log("Password (number of times dial points at 0):", countZeros_1);
console.log("Password (method 0x434C49434B):", countZeros_2);
