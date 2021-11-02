#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = __importDefault(require("readline"));
var fs_1 = __importDefault(require("fs"));
var CompareResult_1 = require("./CompareResult");
var Constants_1 = require("./Constants");
var PureUtil_1 = require("./PureUtil");
var Logger_1 = require("./Logger");
var chalk_1 = __importDefault(require("chalk"));
var lines1 = [];
var lines2 = [];
var ptr = 0;
var correctAnswers = 0;
var total = 0;
var wrongPrecisionWarning = 0;
function pushLine(lineArray) {
    return function (line) {
        line = line.trim();
        if (line.length == 0)
            return;
        lineArray.push(line);
        processLinePair();
    };
}
function createSafeReadStream(file) {
    var stream = fs_1.default.createReadStream(file);
    stream.on("error", function (err) {
        (0, Logger_1.error)("File " + file + " could not be opened", err);
    });
    return stream;
}
function createInterfaceReaders() {
    var file1 = process.argv[2];
    var file2 = process.argv[3];
    var input1, input2;
    if (file1 && file2) {
        if (file1 == '-' && file2 == '-') {
            (0, Logger_1.error)('Only one input can be stdin');
        }
        input1 = file1 == '-' ? process.stdin : createSafeReadStream(file1);
        input2 = file2 == '-' ? process.stdin : createSafeReadStream(file2);
    }
    else if (file1 && !file2) {
        input1 = process.stdin;
        input2 = createSafeReadStream(file1);
    }
    else {
        (0, Logger_1.error)('Must specify a file');
    }
    var opt = { console: false };
    return [
        readline_1.default.createInterface(__assign({ input: input1 }, opt)),
        readline_1.default.createInterface(__assign({ input: input2 }, opt))
    ];
}
function processLinePair(sync) {
    if (sync === void 0) { sync = true; }
    var line1 = lines1[ptr];
    var line2 = lines2[ptr];
    if (sync && (typeof line1 == 'undefined' || typeof line2 == 'undefined'))
        return;
    var comparison = (0, PureUtil_1.compare)(line1 || '', line2 || '');
    if (comparison == CompareResult_1.CompareResult.EQUAL || comparison == CompareResult_1.CompareResult.CLOSE)
        correctAnswers++;
    if (comparison == CompareResult_1.CompareResult.CLOSE)
        wrongPrecisionWarning++;
    total++;
    var color = function () { };
    var char;
    switch (comparison) {
        case CompareResult_1.CompareResult.EQUAL:
            color = chalk_1.default.green;
            char = '  ';
            break;
        case CompareResult_1.CompareResult.CLOSE:
            color = chalk_1.default.yellow;
            char = '≈ ';
            break;
        case CompareResult_1.CompareResult.NOT_EQUAL:
            color = chalk_1.default.red;
            char = ' X';
            break;
    }
    (0, Logger_1.log)(color(line1 + "\t\t" + char + " " + line2));
    ptr++;
}
function processRemainingLines() {
    while (ptr < Math.max(lines1.length, lines2.length))
        processLinePair(false);
}
function printSummary() {
    processRemainingLines();
    var color = correctAnswers == total ? chalk_1.default.green : chalk_1.default.red;
    (0, Logger_1.log)();
    (0, Logger_1.log)(color(correctAnswers + "/" + total));
    (0, Logger_1.log)(color(chalk_1.default.bold("" + (correctAnswers == total ? 'Accepted' : 'Wrong Answer'))));
    if (wrongPrecisionWarning > 0)
        (0, Logger_1.warn)("Some floating point numbers may be inaccurate (error used = " + Constants_1.ERR + ").");
    if (lines1.length != lines2.length)
        (0, Logger_1.warn)("Files have different line count.");
}
function exitHandler(code) {
    if (code == 0)
        printSummary();
}
var _a = createInterfaceReaders(), interface1 = _a[0], interface2 = _a[1];
interface1.on('line', pushLine(lines1));
interface2.on('line', pushLine(lines2));
process.on('exit', exitHandler);
//# sourceMappingURL=main.js.map