#!/usr/bin/env node

import readline from 'readline';
import fs, { ReadStream } from 'fs';
import { CompareResult } from './CompareResult';
import { ERR } from './Constants';
import { compare } from './PureUtil';
import { log, error, warn } from './Logger';
import chalk from 'chalk';

let lines1: string[] = [];
let lines2: string[] = [];
let ptr: number = 0;
let correctAnswers: number = 0;
let total: number = 0;
let wrongPrecisionWarning: number = 0;

function pushLine(lineArray: string[]) {
  return function (line: string) {
    line = line.trim();
    if (line.length == 0) return;
    lineArray.push(line);
    processLinePair();
  }
}

function createSafeReadStream(file: string): ReadStream {
  const stream = fs.createReadStream(file);
  stream.on("error", (err: Error) => {
    error(`File ${file} could not be opened`, err);
  });
  return stream;
}

function createInterfaceReaders(): readline.Interface[] {
  const file1 = process.argv[2];
  const file2 = process.argv[3];
  let input1, input2;
  if (file1 && file2) {

    if (file1 == '-' && file2 == '-') {
      error('Only one input can be stdin');
    }

    input1 = file1 == '-' ? process.stdin : createSafeReadStream(file1);
    input2 = file2 == '-' ? process.stdin : createSafeReadStream(file2);
  } else if (file1 && !file2) {
    input1 = process.stdin;
    input2 = createSafeReadStream(file1);
  } else {
    error('Must specify a file');
  }

  const opt = { console: false };

  return [
    readline.createInterface({ input: input1, ...opt } as any),
    readline.createInterface({ input: input2, ...opt } as any)
  ]
}

function processLinePair(sync = true): void {
  let line1 = lines1[ptr];
  let line2 = lines2[ptr];
  if (sync && (typeof line1 == 'undefined' || typeof line2 == 'undefined')) return;

  let comparison: CompareResult = compare(line1 || '', line2 || '');

  if (comparison == CompareResult.EQUAL || comparison == CompareResult.CLOSE) correctAnswers++;
  if (comparison == CompareResult.CLOSE) wrongPrecisionWarning++;
  total++;

  let color: Function = () => { };

  switch (comparison) {
    case CompareResult.EQUAL: color = chalk.green; break;
    case CompareResult.CLOSE: color = chalk.yellow; break;
    case CompareResult.NOT_EQUAL: color = chalk.red; break;
  }

  log(color(`${line1}\t\t${line2}`));

  ptr++;
}

function processRemainingLines(): void {
  while (ptr < Math.max(lines1.length, lines2.length))
    processLinePair(false);
}

function printSummary(): void {
  processRemainingLines();
  const color = correctAnswers == total ? chalk.green : chalk.red;
  log(color(`${correctAnswers}/${total}`));
  log(color(chalk.bold(`${correctAnswers == total ? 'Accepted' : 'Wrong Answer'}`)));

  if (wrongPrecisionWarning > 0)
    warn(`Some floating point numbers may be inaccurate (error used = ${ERR}).`);

  if (lines1.length != lines2.length)
    warn(`Files have different line count.`);
}

function exitHandler(code: number): void {
  if (code == 0)
    printSummary();
}

const [interface1, interface2]: readline.Interface[] = createInterfaceReaders();
interface1.on('line', pushLine(lines1));
interface2.on('line', pushLine(lines2));

process.on('exit', exitHandler);
