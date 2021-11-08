"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateFunctions = exports.compare = void 0;
var CompareResult_1 = require("./CompareResult");
var BigNum_1 = require("./BigNum");
var Constants_1 = require("./Constants");
/**
 * Pure functions only.
 */
/**
 * TODO: Not the best way to do this. The best way would be to throw some exception from
 * 'getNumbers' and catch it, and when it's caught, the line is processed as a raw string.
 * This way we can avoid executing the same conversion to BigNum so many times.
 * (But at least this code fixed all tests. It's just sub optimal performance wise).
 */
function lineIsRawString(line) {
    line = line.trim();
    try {
        line.split(' ').filter(function (str) { return str.length > 0; }).map(function (str) { return new BigNum_1.BigNum(str); });
        return false;
    }
    catch (_a) {
    }
    return true;
}
function getNumbers(line) {
    return line.split(' ').filter(function (str) { return str.length > 0; }).map(function (str) { return new BigNum_1.BigNum(str); });
}
function compareNumbers(nums1, nums2) {
    if (nums1.length != nums2.length)
        return CompareResult_1.CompareResult.NOT_EQUAL;
    var closeFound = false;
    for (var i = 0; i < nums1.length; i++) {
        var comparison = nums1[i].compare(nums2[i], Constants_1.ERR);
        if (comparison == CompareResult_1.CompareResult.CLOSE) {
            closeFound = true;
        }
        else if (comparison == CompareResult_1.CompareResult.NOT_EQUAL) {
            return CompareResult_1.CompareResult.NOT_EQUAL;
        }
    }
    if (closeFound)
        return CompareResult_1.CompareResult.CLOSE;
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