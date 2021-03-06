// --------------๐ 1. ๋งต text ์๋ ฅ๋ฐ์ ๋ฌธ์์ด๋ก ์ฒ๋ฆฌ ๐------------------

function readMap(mapText) {
  const fs = require("fs");
  const mapStr = fs.readFileSync(`./${mapText}`, "UTF-8");
  return mapStr;
}

// ---------------- 2. ์ซ์๊ฐ์ผ๋ก ๋ณํ, 2์ฐจ์ ๋ฐฐ์ด๋ก ๋ณํ ํ ๊ฐ์ฒด ์์ ์ ์ฅ --------------------

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

// ----------------  stage๊ฐ ํค ๊ฐ์ธ ๊ฐ์ฒด ์์ 2์ฐจ์ ๋ฐฐ์ด ๋ฃ๊ธฐ ---------------

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

// ----------------- 2์ฐจ์ ๋ฐฐ์ด ๋ง๋ค๊ธฐ ----------------------

function setTwoDimensionalArray(currArr, splitStr) {
  const twoDimensionalArray = currArr
    .split(splitStr)
    .map((v) => v.split("\r\n").filter((a) => a !== ""));
  return twoDimensionalArray;
}
// ---------------- 3. ์คํ์ด์ง ์ ๋ณด ์ถ๋ ฅ ------------------

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

// ------------------- ์คํ์ด์ง ์ธ๋ถ์ ๋ณด ๊ตฌํ๊ธฐ ํจ์---------------------

function printStageDetailInfo(stageObj) {
  return `
  ๊ฐ๋กํฌ๊ธฐ: ${getWidth(stageObj)}
  ์ธ๋กํฌ๊ธฐ: ${getHeight(stageObj)}
  ๊ตฌ๋ฉ์ ์:  ${getHallCount(stageObj)}
  ๊ณต์ ์:  ${getBallCount(stageObj)}
  ํ๋ ์ด์ด ์์น (${getPlayerPos(stageObj)})\n\n`;
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

// ------------------- ์คํ ํจ์ ---------------------

function init(mapText) {
  const inputMap = readMap(mapText);

  // 1
  console.log(inputMap);
  // 2
  console.log(setNumberArray(inputMap));
  // 3
  // console.log(printStageInfo(inputMap));
}

init("testMap.txt");
