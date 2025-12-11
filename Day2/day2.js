const fs = require("fs");

// Get input string and transfer to array
const inputsArr = fs.readFileSync("day2-input.txt", "utf-8")
                    .split(",")
                    .filter(Boolean);

// P1
const isValidRepeatedID1 = (id) => {
  // Digits, even length, one group repeated twice
  return /^(\d+)\1$/.test(id);
}

// P2
const isValidRepeatedID2 = (id) => {
  // Digits, digit-sequence repeated 2+ times
  return /^(\d+)\1+$/.test(id);
}

const finalArr1 = [];
const finalArr2 = [];

for (const pairs of inputsArr) {
    const temp = pairs.split("-").filter(Boolean);
    const start = Number(temp[0]);
    const end = Number(temp[1]);

    if (temp[0][0] === '0'){
        return;
    }

    for (let i = start; i <= end; i++) {
        if (isValidRepeatedID1(i)) {
            finalArr1.push(i);
        }

        if (isValidRepeatedID2(i)) {
            finalArr2.push(i);
        }
    }
}

const finalSum1 = finalArr1.filter(Boolean).reduce((partialSum, a) => partialSum + a, 0);
const finalSum2 = finalArr2.filter(Boolean).reduce((partialSum, a) => partialSum + a, 0);

console.log("finalSum - 1:", finalSum1);
console.log("finalSum - 2:", finalSum2);
