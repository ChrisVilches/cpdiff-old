"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateFunctions = exports.compare = void 0;
var CompareResult_1 = require("./CompareResult");
var Constants_1 = require("./Constants");
/**
 * Pure functions only.
 */
var NUMBER_REGEX = new RegExp(/-?[0-9]+(.[0-9])*/g);
function lineIsRawString(line) {
    return line.replace(NUMBER_REGEX, '').replace(/\s/g, '').length > 0;
}
function getNumbers(line) {
    return line.split(' ').filter(function (str) { return str.length > 0; }).map(function (str) { return +str; });
}
function compareNumbers(nums1, nums2) {
    if (nums1.length != nums2.length)
        return CompareResult_1.CompareResult.NOT_EQUAL;
    for (var i = 0; i < nums1.length; i++) {
        if (nums1[i] != nums2[i]) {
            if (Math.abs(nums1[i] - nums2[i]) < Constants_1.ERR) {
                return CompareResult_1.CompareResult.CLOSE;
            }
            else {
                return CompareResult_1.CompareResult.NOT_EQUAL;
            }
        }
        ;
    }
    return CompareResult_1.CompareResult.EQUAL;
}
function compare(line1, line2) {
    line1 || (line1 = '');
    line2 || (line2 = '');
    line1 = line1.trim();
    line2 = line2.trim();
    if (lineIsRawString(line1) || lineIsRawString(line2)) {
        return line1 == line2 ? CompareResult_1.CompareResult.EQUAL : CompareResult_1.CompareResult.NOT_EQUAL;
    }
    return compareNumbers(getNumbers(line1), getNumbers(line2));
}
exports.compare = compare;
// Hack for unit testing.
exports.privateFunctions = {
    lineIsRawString: lineIsRawString,
    getNumbers: getNumbers,
    compareNumbers: compareNumbers
};
//# sourceMappingURL=PureUtil.js.map