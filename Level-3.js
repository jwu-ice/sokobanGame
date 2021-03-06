// -----------------π 3λ¨κ³: μμ½λ° κ²μ μμ±νκΈ° π----------------

const stageInfo = {
  mapTextUrl: "map.txt",
  saveTextUrl: "saveData.txt",
  stageLevel: 1,
  stageMaxLevel: 1,
  currStageArr: [],
  originStageArr: [],
  turnList: [],
  turnCount: 0,
};

// ------------------- νλ μ΄μ΄ μμ§μ΄κΈ° κ΄λ ¨ ν¨μλ€ ---------------------

function moveController(command) {
  const [y, x] = getPlayerPos(stageInfo.currStageArr);
  const [mY, mX] = [...movePos(command, y, x)]; // κ° μ’νμ λκ°μλ?
  let [behindY, behindX] = [0, 0];

  if (stageInfo.currStageArr[mY][mX] !== "#") {
    [behindY, behindX] = [...movePos(command, mY, mX)]; // κ°κ³ λμ λ€μ μ’νμ λκ°μλ?
  }
  switch (stageInfo.currStageArr[mY][mX]) {
    case "#":
      break;
    case " ":
    case "O":
      checkHasHall(y, x, mY, mX);
      break;
    case "o":
    case "0":
      checkBehindStoneOrHall(y, x, mY, mX, behindY, behindX);
      break;
  }
  printMap(stageInfo.currStageArr);
  isFinish(stageInfo.currStageArr);
}

function movePos(command, y, x) {
  const movePosXY = {
    W: [y - 1, x],
    D: [y, x + 1],
    S: [y + 1, x],
    A: [y, x - 1],
  };
  return movePosXY[command];
}

function getPlayerPos(currStageArr) {
  const y = currStageArr.findIndex((row) => row.includes("P"));
  const x = currStageArr[y].indexOf("P");

  return [y, x];
}

function checkHasHall(y, x, mY, mX) {
  stageInfo.originStageArr[y][x] === "O" ||
  stageInfo.originStageArr[y][x] === "0"
    ? (stageInfo.currStageArr[y][x] = "O")
    : (stageInfo.currStageArr[y][x] = " ");
  stageInfo.currStageArr[mY][mX] = "P";
  stageInfo.turnCount++;
}

function checkBehindStoneOrHall(y, x, mY, mX, behindY, behindX) {
  if (/[#o0]/.test(stageInfo.currStageArr[behindY][behindX])) {
    return;
  }
  if (stageInfo.currStageArr[behindY][behindX] === "O") {
    checkHasHall(y, x, mY, mX);
    stageInfo.currStageArr[behindY][behindX] = "0";
    return;
  }
  checkHasHall(y, x, mY, mX);
  stageInfo.currStageArr[behindY][behindX] = "o";
  return;
}

function isFinish(currStageArr) {
  if (!currStageArr.flat().find((v) => v === "o")) {
    stageInfo.stageLevel++;

    if (stageInfo.stageLevel > stageInfo.stageMaxLevel) {
      console.log(`
            μ μ²΄ κ²μμ ν΄λ¦¬μ΄νμ¨μ΅λλ€!
            μΆνλλ¦½λλ€!
            `);
      return rl.close();
    }

    console.log(`
        λΉ λ°€ Stage ${stageInfo.stageLevel - 1} ν΄λ¦¬μ΄ !
        ν΄μ: ${stageInfo.turnCount}
        `);

    resetStage(stageInfo.stageLevel);
  }
}

// ------------------- μ΄κΈ°ν ν¨μ ---------------------

function resetStage(level, load) {
  if (!load) stageInfo.currStageArr = setStageArray(level);
  stageInfo.originStageArr = setStageArray(level);
  stageInfo.turnCount = 0;
  stageInfo.turnList = [];

  console.log(`Stage: ${level}`);
  printMap(stageInfo.currStageArr);
}

function setStageArray(level) {
  return setStageFileObject(stageInfo.mapTextUrl)[`Stage ${level}`];
}

// ------------------- μΆλ ₯ ν¨μ ---------------------

function printMap(map) {
  let printStrMap = "";
  map.forEach((v) => {
    if (v.stageLevel) return;

    v.forEach((a) => {
      printStrMap += a;
    });
    printStrMap += "\n";
  });

  console.log("\n" + printStrMap);
}

// ------------------- μ§λνμΌ 2μ°¨μλ°°μ΄μμ κ°μ²΄λ‘ λ³ννκΈ° ---------------------

function setStageFileObject(mapText) {
  let sokobanStagesArr = [];
  let sokobanStagesObj = {};

  // 1μ°¨μ λ°°μ΄λ‘ λ§λ€κ³  λΉκ³΅κ° μμ κΈ°
  readStageFile(mapText).forEach((v) => {
    sokobanStagesArr.push(v.split("\r\n").filter((a) => a !== ""));
  });
  // 2μ°¨μ λ°°μ΄λ‘ λ§λ  ν λΉ κ°μ²΄μ λ£κΈ°
  sokobanStagesArr.forEach((stage) => {
    let splStage = stage.slice(1).map((a) => a.split(""));
    sokobanStagesObj[stage.slice(0, 1)] = splStage;
  });

  return sokobanStagesObj;
}

// ------------------- μ§λνμΌ κ°μ Έμ€κΈ° ---------------------

function readStageFile(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8").split("=====");
  return mapStr;
}

// ------------------ μΈμ΄λΈ & λ‘λ ν¨μ --------------------

function saveCurrentArray(line) {
  console.log(`${line[0]}λ²μ μ μ₯λμμ΅λλ€.`);
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  const levelObj = { stageLevel: stageInfo.stageLevel };

  const saveNum = `${line[0]}λ²`;
  saveObj[saveNum] = [levelObj, ...stageInfo.currStageArr];
  saveDataFile(saveObj);
}

function loadSaveArray(line) {
  console.log(`${line[0]}λ²μ λΆλ¬μ΅λλ€.`);
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  const saveNum = `${line[0]}λ²`;
  if (!saveObj[saveNum]) {
    return console.log(`${saveNum}μλ λ°μ΄ν°κ° μμ΅λλ€!`);
  }
  stageInfo.currStageArr = saveObj[saveNum].slice(1);
  stageInfo.stageLevel = saveObj[saveNum][0].stageLevel;
  resetStage(stageInfo.stageLevel, true);
}

function saveDataFile(saveObj) {
  const fs = require("fs");
  return fs.writeFileSync(stageInfo.saveTextUrl, JSON.stringify(saveObj));
}

function loadDataFile(dataStr) {
  const fs = require("fs");
  return JSON.parse(fs.readFileSync(dataStr, "utf-8"));
}

function printSaveList() {
  console.log(`μ μ₯λ λ¦¬μ€νΈλ₯Ό λΆλ¬μ΅λλ€.`);
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  for (let key in saveObj) {
    console.log(`\n${key}\n`);
    console.table(saveObj[key].slice(1));
  }
}

// ------------------- node.js μλ ₯λ°κΈ° ---------------------

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "SOKOBAN> ",
});

rl.prompt();
rl.on("line", (someLine) => {
  const line = someLine.toUpperCase();

  switch (true) {
    case /^Q$/.test(line):
      console.log("Bye~");
      rl.close();
      break;

    case /^[WASD]$/.test(line):
      moveController(line);
      break;

    case /^\?$/.test(line):
      console.log(`
                        Stage:     ${stageInfo.stageLevel}
                        TurnCount: ${stageInfo.turnCount}
        β
        W               Q:      Exit
    β A   D β           R:      Refresh
        S               [1-5]S: Save
        β               [1-5]L: Load
                        L:      Saved List

-   Only one letter allow   -
-   Does not matter uppercase or lowercase   -

`);
      printMap(stageInfo.currStageArr);
      break;

    case /^R$/.test(line):
      console.log(`\n--- Stage Reset ---`);
      resetStage(stageInfo.stageLevel);
      break;

    case /^[1-5]S$/.test(line):
      saveCurrentArray(line);
      break;

    case /^[1-5]L$/.test(line):
      loadSaveArray(line);
      break;

    case /^L$/.test(line):
      printSaveList();
      break;

    case /^u$/.test(someLine):
      // νν΄ λλλ¦¬κΈ°
      // revertTurn();
      break;

    case /^U$/.test(line):
      // λλλ¦¬κΈ° μ·¨μ
      // cancelRevertTurn();
      break;

    default:
      console.log(`\nTry again! Only one letter \n*hint: ?`);
      printMap(stageInfo.currStageArr);
  }
  rl.prompt();
}).on("close", function () {
  process.exit();
});

// ------------------- μ²μ μ€ν ν¨μ ---------------------

function init() {
  stageInfo.stageMaxLevel = readStageFile(stageInfo.mapTextUrl).length;
  console.log(
    `\nμμ½λ°μ μΈκ³μ μ€μ  κ²μ νμν©λλ€!\n^μ€^\nmade by jwu\nMax Stage: ${stageInfo.stageMaxLevel}\n`
  );
  // μ΄κΈ°ν ν¨μ
  resetStage(stageInfo.stageLevel);
}

init();
