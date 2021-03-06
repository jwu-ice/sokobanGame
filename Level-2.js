// -----------------๐ 2๋จ๊ณ: ํ๋ ์ด์ด ์ด๋ ๊ตฌํํ๊ธฐ ๐-----------------

const currArr = setTwoDimensionalArray(readMap("testMap.txt"));
console.log(readMap("testMap.txt") + "\n");

// ------------------- ์ปค๋งจ๋ ๋์ ---------------------

function moveController(command) {
  const [y, x] = getPlayerPos(currArr);
  const movePos = getMovePos(y, x);
  const [mY, mX] = [movePos[command][0], movePos[command][1]];
  switch (currArr[mY][mX]) {
    case " ":
      currArr[y][x] = " ";
      currArr[mY][mX] = "P";
      console.log(`${command}: ${movePos[command][2]}์ผ๋ก ์ด๋ํฉ๋๋ค.\n`);
      break;
    case "#":
    case "O":
    case "o":
    default:
      console.log(`${command}: (๊ฒฝ๊ณ !) ํด๋น ๋ช๋ น์ ์ํํ  ์ ์์ต๋๋ค!`);
      break;
  }
  printStage(currArr);
}

function getMovePos(y, x) {
  return {
    W: [y - 1, x, "์์ชฝ"],
    D: [y, x + 1, "์ค๋ฅธ์ชฝ"],
    S: [y + 1, x, "์๋์ชฝ"],
    A: [y, x - 1, "์ผ์ชฝ"],
  };
}

function getPlayerPos(currArr) {
  const y = currArr.findIndex((row) => row.includes("P"));
  const x = currArr[y].indexOf("P");

  return [y, x];
}

// ------------------- ๋ ๋ฒ์งธ ์คํ์ด์ง ๊ฐ์ ธ์ค๊ธฐ ------------------

function readMap(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8").split("=====")[1];
  return mapStr;
}

// ------------------- ์ฒ์ ์คํ์ด์ง๋งต => 2์ฐจ์ ๋ฐฐ์ด --------------------

function setTwoDimensionalArray(stage) {
  const stageArray = stage.split("\r\n").slice(2);
  const array = stageArray.map((v) => v.split(""));
  return array;
}

// ------------------- 2์ฐจ์๋ฐฐ์ด => str & ์ถ๋ ฅ --------------------

function printStage(currArr) {
  let resArr = "";
  for (let i = 0; i < currArr.length; i++) {
    resArr += currArr[i].join("") + "\n";
  }
  console.log("\n" + resArr);
}

// ------------------- node.js ์๋ ฅ๋ฐ๊ธฐ ---------------------

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "SOKOBAN> ",
});

rl.prompt();
rl.on("line", function (someline) {
  const line = someline.toUpperCase();

  if (line === "Q") {
    console.log("Bye~");
    rl.close();
  }

  for (let i = 0; i < line.length; i++) {
    if (/[WDSA]/.test(line[i])) {
      moveController(line[i]);
    }
  }

  rl.prompt();
}).on("close", function () {
  process.exit();
});
