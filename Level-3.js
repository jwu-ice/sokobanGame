// -----------------😎 3단계: 소코반 게임 완성하기 😎----------------

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

// ------------------- 플레이어 움직이기 관련 함수들 ---------------------

function moveController(command) {
  const [y, x] = getPlayerPos(stageInfo.currStageArr);
  const [mY, mX] = [...movePos(command, y, x)]; // 갈 좌표에 누가있니?
  let [behindY, behindX] = [0, 0];

  if (stageInfo.currStageArr[mY][mX] !== "#") {
    [behindY, behindX] = [...movePos(command, mY, mX)]; // 가고나서 뒤의 좌표에 누가있니?
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
            전체 게임을 클리어하셨습니다!
            축하드립니다!
            `);
      return rl.close();
    }

    console.log(`
        빠밤 Stage ${stageInfo.stageLevel - 1} 클리어 !
        턴수: ${stageInfo.turnCount}
        `);

    resetStage(stageInfo.stageLevel);
  }
}

// ------------------- 초기화 함수 ---------------------

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

// ------------------- 출력 함수 ---------------------

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

// ------------------- 지도파일 2차원배열에서 객체로 변환하기 ---------------------

function setStageFileObject(mapText) {
  let sokobanStagesArr = [];
  let sokobanStagesObj = {};

  // 1차원 배열로 만들고 빈공간 없애기
  readStageFile(mapText).forEach((v) => {
    sokobanStagesArr.push(v.split("\r\n").filter((a) => a !== ""));
  });
  // 2차원 배열로 만든 후 빈 객체에 넣기
  sokobanStagesArr.forEach((stage) => {
    let splStage = stage.slice(1).map((a) => a.split(""));
    sokobanStagesObj[stage.slice(0, 1)] = splStage;
  });

  return sokobanStagesObj;
}

// ------------------- 지도파일 가져오기 ---------------------

function readStageFile(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8").split("=====");
  return mapStr;
}

// ------------------ 세이브 & 로드 함수 --------------------

function saveCurrentArray(line) {
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  const levelObj = { stageLevel: stageInfo.stageLevel };

  const saveNum = `${line[0]}번`;
  saveObj[saveNum] = [levelObj, ...stageInfo.currStageArr];
  saveDataFile(saveObj);
}

function loadSaveArray(line) {
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  const saveNum = `${line[0]}번`;
  if (!saveObj[saveNum]) {
    return console.log(`${saveNum}에는 데이터가 없습니다!`);
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
  const saveObj = loadDataFile(stageInfo.saveTextUrl);
  for (let key in saveObj) {
    console.log(`\n${key}\n`);
    console.table(saveObj[key].slice(1));
  }
}

// ------------------- node.js 입력받기 ---------------------

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "SOKOBAN> ",
});

rl.prompt();
rl.on("line", (someLine) => {
  const line = someLine.toUpperCase();
  if (/^Q$/.test(line)) {
    console.log("Bye~");
    rl.close();
  }
  if (/^[WASD]$/.test(line)) {
    moveController(line);
  } else if (/^\?$/.test(line)) {
    console.log(`
                                Stage:     ${stageInfo.stageLevel}
                                TurnCount: ${stageInfo.turnCount}
                ↑
                W               Q:      Exit
            ← A   D →           R:      Refresh
                S               [1-5]S: Save 
                ↓               [1-5]L: Load
                                L:      Saved List

    -   Only one letter allow   -
    -   Does not matter uppercase or lowercase   -

      `);
    printMap(stageInfo.currStageArr);
  } else if (/^R$/.test(line)) {
    console.log(`\n--- Stage Reset ---`);
    resetStage(stageInfo.stageLevel);
  } else if (/^[1-5]S$/.test(line)) {
    console.log(`${line[0]}번에 저장되었습니다.`);
    saveCurrentArray(line);
  } else if (/^[1-5]L$/.test(line)) {
    console.log(`${line[0]}번을 불러옵니다.`);
    loadSaveArray(line);
  } else if (/^L$/.test(line)) {
    console.log(`저장된 리스트를 불러옵니다.`);
    printSaveList();
  } else if (/^u$/.test(someLine)) {
    // 한턴 되돌리기
    // revertTurn();
  } else if (/^U$/.test(line)) {
    // 되돌리기 취소
    // cancelRevertTurn();
  } else {
    console.log(`\nTry again! Only one letter \n*hint: ?`);
    printMap(stageInfo.currStageArr);
  }
  rl.prompt();
}).on("close", function () {
  process.exit();
});

// ------------------- 처음 실행 함수 ---------------------

function init() {
  stageInfo.stageMaxLevel = readStageFile(stageInfo.mapTextUrl).length;
  console.log(
    `\n소코반의 세계에 오신 것을 환영합니다!\n^오^\nmade by jwu\nMax Stage: ${stageInfo.stageMaxLevel}\n`
  );
  // 초기화 함수
  resetStage(stageInfo.stageLevel);
}

init();
