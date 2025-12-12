import fs from "fs/promises";
import { init } from "./node_modules/z3-solver";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const parseLine = line => {
  const parts = line.trim().split(/\s+/);
  const indicator = parts.shift();
  const indicators = indicator.replaceAll(/[\[\]]/g, "").split("");
  const bindicators = indicators.map((i) => i === "#");

  const joltage = parts
    .pop()
    .replaceAll(/[\{\}]/g, "")
    .split(",")
    .map(Number);

  const buttons = parts.map((btn) =>
    btn
      .replaceAll(/[\(\)]/g, "")
      .split(",")
      .map(Number)
      .sort((a, b) => a - b)
  );

  const sbuttons = buttons.map((b) =>
    joltage.map((_, i) => (b.includes(i) ? 1 : 0))
  );

  return { indicators, bindicators, buttons, sbuttons, joltage };
}

// linear not working...? 
// Using Z3
async function solveMac(mac, Context) {
  const { Solver, Optimize, Int } = new Context("main");
  const solver = new Optimize();

  // Create variables
  const vars = mac.sbuttons.map((_, i) => {
    const v = Int.const(alphabet[i]);
    solver.add(v.ge(0));
    return v;
  });

  // Add constraints
  mac.joltage.forEach((value, idx) => {
    const condition = mac.sbuttons.reduce(
      (acc, btn, btnIdx) => acc.add(btn[idx] ? vars[btnIdx] : Int.val(0)),
      Int.val(0)
    );
    solver.add(condition.eq(Int.val(value)));
  });

  // Minimize sum of variables
  const sumVars = vars.reduce((acc, v) => acc.add(v), Int.val(0));
  solver.minimize(sumVars);

  const result = await solver.check();
  if (result === "sat") {
    return +solver.model().eval(sumVars).toString();
  }

  return 0;
}

try {
  const data = await fs.readFile("./day10-input.txt", "utf8");

  const cleanData = data
    .trim()
    .split("\n")
    .map(parseLine);

  const { Context } = await init();
  const counts = [];

  for (const mac of cleanData) {
    const count = await solveMac(mac, Context);
    counts.push(count);
  }

  console.log("P2:", counts.reduce((a, c) => a + c, 0));
} catch (err) {
  console.error("Error reading file:", err);
}
