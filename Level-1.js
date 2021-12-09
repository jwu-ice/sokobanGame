// --------------😎 1. 맵 text 입력받아 문자열로 처리 😎------------------

function readMap(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8");
  return mapStr;
}

// ---------------- 2. 숫자값으로 변환, 2차원 배열로 변환 후 객체 안에 저장 --------------------

function setNumberArray(mapStr) {
  const numMapStr = mapStr
    .replace(/#/g, "0")
    .replace(/O/g, "1")
    .replace(/o/g, "2")
    .replace(/P/g, "3")
    .replace(/=/g, "4");

  const numArray = setTwoDimensionalArray(numMapStr, "44444");

  return setArrayInObject(numArray);
}

// ----------------  stage가 키 값인 객체 안에 2차원 배열 넣기 ---------------

function setArrayInObject(mapStr, stagesObj = {}) {
  mapStr.forEach((stage) => {
    stagesObj[stage.slice(0, 1)] = [];
    stage.forEach((v, i) => {
      if (i === 0) return;
      stagesObj[stage.slice(0, 1)].push(v);
    });
  });
  return stagesObj;
}

// ----------------- 2차원 배열 만들기 ----------------------

function setTwoDimensionalArray(currArr, splitStr) {
  const twoDimensionalArray = currArr
    .split(splitStr)
    .map((v) => v.split("\r\n").filter((a) => a !== ""));
  return twoDimensionalArray;
}
// ---------------- 3. 스테이지 정보 출력 ------------------

function printStageInfo(mapStr) {
  const stagesObj = setArrayInObject(setTwoDimensionalArray(mapStr, "====="));

  let printStr = "";
  for (const key in stagesObj) {
    printStr += key + "\n\n";
    printStr += stagesObj[key].join("\r\n") + "\n";
    printStr += printStageDetailInfo(stagesObj[key]);
  }

  return printStr;
}

// ------------------- 스테이지 세부정보 구하기 함수---------------------

function printStageDetailInfo(stageObj) {
  return `
  가로크기: ${getWidth(stageObj)}
  세로크기: ${getHeight(stageObj)}
  구멍의 수:  ${getHallCount(stageObj)}
  공의 수:  ${getBallCount(stageObj)}
  플레이어 위치 (${getPlayerPos(stageObj)})\n\n`;
}

function getWidth(stageObj) {
  const stageWidthLengthArray = stageObj.map((v) => v.length);
  return Math.max(...stageWidthLengthArray);
}

function getHeight(stageObj) {
  return stageObj.length;
}

function getHallCount(stageObj, arr = []) {
  stageObj.forEach((v) => {
    arr.push(v.match(/O/g));
  });
  return arr.flat().filter((v) => v !== null).length;
}

function getBallCount(stageObj, arr = []) {
  stageObj.forEach((v) => {
    arr.push(v.match(/o/g));
  });
  return arr.flat().filter((v) => v !== null).length;
}

function getPlayerPos(stageObj) {
  const y = stageObj.findIndex((row) => row.includes("P"));
  const x = stageObj[y].indexOf("P");

  return [y, x];
}

// ------------------- 실행 함수 ---------------------

function init(mapText) {
  const inputMap = readMap(mapText);

  // 1
  // console.log(inputMap);
  // 2
  // console.log(setNumberArray(inputMap));
  // 3
  console.log(printStageInfo(inputMap));
}

init("testMap.txt");
