"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNum = void 0;
var CompareResult_1 = require("./CompareResult");
var SINGLE_NUMBER = /^(-)?[0-9]+(\.[0-9]+)?$/;
var TRAILING_ZEROS = /0*$/;
var BigNum = /** @class */ (function () {
    function BigNum(num) {
        var _a;
        this.positive = true;
        this.integer = '';
        this.decimal = '';
        num = num.trim();
        if (!SINGLE_NUMBER.test(num)) {
            throw new Error("Incorrect number string. Cannot use string: " + num);
        }
        if (num.charAt(0) == '-') {
            this.positive = false;
            num = num.substr(1);
        }
        if (num.search(/\./) > -1) {
            _a = num.split('.'), this.integer = _a[0], this.decimal = _a[1];
        }
        else {
            this.integer = num;
        }
        if (this.integer.length > 1 && this.integer.charAt(0) == '0') {
            throw new Error('First digit of a multi digit number cannot be zero');
        }
        this.decimal = this.decimal.replace(TRAILING_ZEROS, '');
    }
    BigNum.listOf = function (nums) {
        return nums.map(function (n) { return new BigNum('' + n); });
    };
    BigNum.prototype.isPositive = function () {
        return this.positive;
    };
    BigNum.prototype.isInteger = function () {
        return this.decimal.length == 0;
    };
    BigNum.prototype.compare = function (other, errExp) {
        if (errExp === void 0) { errExp = 5; }
        if (this.isPositive() != other.isPositive())
            return CompareResult_1.CompareResult.NOT_EQUAL;
        if (this.isInteger() && other.isInteger()) {
            return this.integer == other.integer ? CompareResult_1.CompareResult.EQUAL : CompareResult_1.CompareResult.NOT_EQUAL;
        }
        if (this.integer != other.integer)
            return CompareResult_1.CompareResult.NOT_EQUAL;
        var dec1 = this.firstDecimals(errExp);
        var dec2 = other.firstDecimals(errExp);
        if (dec1 == dec2 && this.decimal != other.decimal)
            return CompareResult_1.CompareResult.CLOSE;
        if (dec1 != dec2)
            return CompareResult_1.CompareResult.NOT_EQUAL;
        return CompareResult_1.CompareResult.EQUAL;
    };
    BigNum.prototype.firstDecimals = function (n) {
        var decimals = this.decimal.substr(0, n);
        while (decimals.length < n) {
            decimals += '0';
        }
        return decimals;
    };
    BigNum.prototype.toString = function () {
        var parts = [this.integer];
        if (this.decimal.length) {
            parts.push(this.decimal);
        }
        var sign = this.isPositive() ? '' : '-';
        return sign + parts.join('.');
    };
    return BigNum;
}());
exports.BigNum = BigNum;
//# sourceMappingURL=BigNum.js.map