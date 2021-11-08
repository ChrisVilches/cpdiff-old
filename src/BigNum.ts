import { CompareResult } from "./CompareResult";

const SINGLE_NUMBER = /^(-)?[0-9]+(\.[0-9]+)?$/;
const TRAILING_ZEROS = /0*$/;

export class BigNum {
  private positive: boolean = true;
  private integer: string = '';
  private decimal: string = '';

  constructor(num: string) {
    num = num.trim();
    if (!SINGLE_NUMBER.test(num)) {
      throw new Error(`Incorrect number string. Cannot use string: ${num}`);
    }

    if (num.charAt(0) == '-') {
      this.positive = false;
      num = num.substr(1);
    }

    if (num.search(/\./) > -1) {
      [this.integer, this.decimal] = num.split('.');
    } else {
      this.integer = num;
    }

    if (this.integer.length > 1 && this.integer.charAt(0) == '0') {
      throw new Error('First digit of a multi digit number cannot be zero');
    }

    this.decimal = this.decimal.replace(TRAILING_ZEROS, '');
  }

  isPositive(): boolean {
    return this.positive;
  }

  isInteger(): boolean {
    return this.decimal.length == 0;
  }

  compare(other: BigNum): CompareResult {
    if (this.isPositive() != other.isPositive()) return CompareResult.NOT_EQUAL;
    if (this.isInteger() != other.isInteger()) return CompareResult.NOT_EQUAL;

    if (this.isInteger()) {
      return this.integer == other.integer ? CompareResult.EQUAL : CompareResult.NOT_EQUAL;
    }

    if (this.integer != other.integer) return CompareResult.NOT_EQUAL;

    const dec1 = this.firstDecimals(5);
    const dec2 = other.firstDecimals(5);

    if (dec1 == dec2 && this.decimal != other.decimal) return CompareResult.CLOSE;
    if (dec1 != dec2) return CompareResult.NOT_EQUAL;

    return CompareResult.EQUAL;
  }

  firstDecimals(n: number): string {
    let decimals = this.decimal.substr(0, n);

    while (decimals.length < n) {
      decimals += '0';
    }
    return decimals;
  }

  toString(): string {
    let parts = [this.integer];
    if (this.decimal.length) {
      parts.push(this.decimal);
    }

    let sign = this.isPositive() ? '' : '-';

    return sign + parts.join('.');
  }
}
