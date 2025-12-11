const fs = require("fs");

const inputsArr = fs.readFileSync("day3-input.txt", "utf-8")
                    .split("\n")
                    .map(line => line.trim())
                    .filter(Boolean);

// P1
const getMaxPair = digitString => {
  const digits = digitString.split('').map(Number);

  // First max
  const firstMaxNum = Math.max(...digits.slice(0, digits.length - 1));
  const firstMaxIndex = digits.indexOf(firstMaxNum);
  // Second max
  const secondMaxNum = Math.max(...digits.slice(firstMaxIndex + 1));

  return firstMaxNum * 10 + secondMaxNum;
}

// P2
const max12Digits = line => {
    const k = 12;
    const digits = [...line].map(Number);
    let toRemove = digits.length - k;
    const stack = [];

    for (const digit of digits) {
        while (toRemove > 0 && stack.length && digit > stack.at(-1)) {
            stack.pop();
            toRemove--;
        }
        stack.push(digit);
    }

    return Number(stack.slice(0, k).join(""));
}

let total = 0;
let total2 = 0;

for (const line of inputsArr) {
    const bestPair = getMaxPair(line);
    total += bestPair;

    const best12Digits = max12Digits(line);
    total2 += best12Digits;
}

console.log("Final total 1 - pair:", total);
console.log("Final total 2 - 12 digits:", total2);