"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.warn = exports.error = void 0;
var chalk_1 = __importDefault(require("chalk"));
function error(msg, err) {
    console.error(chalk_1.default.bold("Error: " + msg));
    if (err) {
        console.error(err);
    }
    process.exit(1);
}
exports.error = error;
function warn(msg) {
    console.log(chalk_1.default.yellow(msg));
}
exports.warn = warn;
function log(msg) {
    if (msg === void 0) { msg = ''; }
    console.log(msg);
}
exports.log = log;
//# sourceMappingURL=Logger.js.map