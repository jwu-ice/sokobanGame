// -----------------😎 2단계: 플레이어 이동 구현하기 😎-----------------

const currArr = setTwoDimensionalArray(readMap("testMap.txt"));
console.log(readMap("testMap.txt") + "\n");

// ------------------- 커맨드 동작 ---------------------

function moveController(command) {
  const [y, x] = getPlayerPos(currArr);
  const movePos = getMovePos(y, x);
  const [mY, mX] = [movePos[command][0], movePos[command][1]];
  switch (currArr[mY][mX]) {
    case " ":
      currArr[y][x] = " ";
      currArr[mY][mX] = "P";
      console.log(`${command}: ${movePos[command][2]}으로 이동합니다.\n`);
      break;
    case "#":
    case "O":
    case "o":
    default:
      console.log(`${command}: (경고!) 해당 명령을 수행할 수 없습니다!`);
      break;
  }
  printStage(currArr);
}

function getMovePos(y, x) {
  return {
    W: [y - 1, x, "위쪽"],
    D: [y, x + 1, "오른쪽"],
    S: [y + 1, x, "아래쪽"],
    A: [y, x - 1, "왼쪽"],
  };
}

function getPlayerPos(currArr) {
  const y = currArr.findIndex((row) => row.includes("P"));
  const x = currArr[y].indexOf("P");

  return [y, x];
}

// ------------------- 두 번째 스테이지 가져오기 ------------------

function readMap(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8").split("=====")[1];
  return mapStr;
}

// ------------------- 처음 스테이지맵 => 2차원 배열 --------------------

function setTwoDimensionalArray(stage) {
  const stageArray = stage.split("\r\n").slice(2);
  const array = stageArray.map((v) => v.split(""));
  return array;
}

// ------------------- 2차원배열 => str & 출력 --------------------

function printStage(currArr) {
  let resArr = "";
  for (let i = 0; i < currArr.length; i++) {
    resArr += currArr[i].join("") + "\n";
  }
  console.log("\n" + resArr);
}

// ------------------- node.js 입력받기 ---------------------

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
