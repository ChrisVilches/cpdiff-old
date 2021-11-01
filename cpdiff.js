#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const ERR = 0.00001;
const EQUAL = 'EQUAL';
const NOT_EQUAL = 'NOT EQUAL';
const CLOSE = 'CLOSE';
const BOLD = "\033[1m";
const RESET = "\x1b[0m";
const COLORS = {
  reset: "\033[0m",
  hicolor: "\033[1m",
  underline: "\033[4m",
  inverse: "\033[7m",
  black: "\033[30m",
  red: "\033[31m",
  green: "\033[32m",
  yellow: "\033[33m",
  blue: "\033[34m",
  magenta: "\033[35m",
  cyan: "\033[36m",
  white: "\033[37m"
};

const NUMBER_REGEX = new RegExp(/-?[0-9]+(.[0-9])*/g);

let lines1 = [];
let lines2 = [];
let ptr = 0;
let correctAnswers = 0;
let total = 0;
let wrongPrecisionWarning = 0;

function pushLine(lineArray) {
  return function (line) {
    line = line.trim();
    if (line.length == 0) return;
    lineArray.push(line);
    processLinePair();
  }
}

function compareNumbers(nums1, nums2) {
  if (nums1.length != nums2.length) return NOT_EQUAL;

  for (let i = 0; i < nums1.length; i++) {
    if (nums1[i] != nums2[i]) {
      if (Math.abs(nums1[i] - nums2[i]) < ERR) {
        return CLOSE;
      } else {
        return NOT_EQUAL;
      }
    };
  }
  return EQUAL;
}

function lineIsRawString(line) {
  return line.replace(NUMBER_REGEX, '').replace(/\s/g, '').length > 0
}

function getNumbers(line) {
  return line.split(' ').filter(str => str.length > 0).map(str => +str);
}

function createInterfaceReaders() {
  const file1 = process.argv[2];
  const file2 = process.argv[3];
  let input1, input2;
  if (file1 && file2) {

    if(file1 == '-' && file2 == '-'){
      console.error("Only one input can be stdin");
      process.exit(1);
    }

    input1 = file1 == '-' ? process.stdin : fs.createReadStream(file1);
    input2 = file2 == '-' ? process.stdin : fs.createReadStream(file2);
  } else if (file1 && !file2) {
    input1 = process.stdin;
    input2 = fs.createReadStream(file1);
  } else {
    console.error('Must specify a file');
    process.exit(1);
  }

  const opt = { console: false };

  return [
    readline.createInterface({ input: input1, ...opt }),
    readline.createInterface({ input: input2, ...opt })
  ]
}

function compare(line1, line2) {
  if (lineIsRawString(line1) || lineIsRawString(line2)) {
    return line1 == line2 ? EQUAL : NOT_EQUAL;
  }

  return compareNumbers(getNumbers(line1 || ''), getNumbers(line2 || ''));
}

function processLinePair(sync = true) {
  let line1 = lines1[ptr];
  let line2 = lines2[ptr];
  if (sync && (typeof line1 == 'undefined' || typeof line2 == 'undefined')) return;

  let comparison = compare(line1 || '', line2 || '');

  if (comparison == EQUAL || comparison == CLOSE) correctAnswers++;
  if (comparison == CLOSE) wrongPrecisionWarning++;
  total++;

  let color;

  switch (comparison) {
    case EQUAL: color = COLORS.green; break;
    case CLOSE: color = COLORS.yellow; break;
    case NOT_EQUAL: color = COLORS.red; break;
  }

  console.log(`${color}${line1}\t\t${line2}`);

  ptr++;
}

function processRemainingLines() {
  while (ptr < Math.max(lines1.length, lines2.length))
    processLinePair(false);
}

function printSummary() {
  processRemainingLines();
  console.log(correctAnswers == total ? COLORS.green : COLORS.red);
  console.log(`${correctAnswers}/${total}`)
  console.log(`${BOLD}${correctAnswers == total ? 'Accepted' : 'Wrong Answer'}`);

  if (wrongPrecisionWarning > 0) {
    console.log(`${RESET}${COLORS.yellow}Some floating point numbers may be inaccurate (error used = ${ERR}).`);
  }

  if (lines1.length != lines2.length) {
    console.log(`${RESET}${COLORS.yellow}Files have different line count.`);
  }
  console.log(RESET);
}

const [interface1, interface2] = createInterfaceReaders();
interface1.on('line', pushLine(lines1));
interface2.on('line', pushLine(lines2));

process.on('exit', printSummary.bind(null, { cleanup: true }));
