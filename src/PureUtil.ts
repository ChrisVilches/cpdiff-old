import { CompareResult } from './CompareResult';
import { ERR } from './Constants';

/**
 * Pure functions only.
 */

const NUMBER_REGEX = new RegExp(/-?[0-9]+(.[0-9])*/g);

function lineIsRawString(line: string): boolean {
  return line.replace(NUMBER_REGEX, '').replace(/\s/g, '').length > 0
}

function getNumbers(line: string): number[] {
  return line.split(' ').filter(str => str.length > 0).map(str => +str);
}

function compareNumbers(nums1: number[], nums2: number[]): CompareResult {
  if (nums1.length != nums2.length) return CompareResult.NOT_EQUAL;

  for (let i = 0; i < nums1.length; i++) {
    if (nums1[i] != nums2[i]) {
      if (Math.abs(nums1[i] - nums2[i]) < ERR) {
        return CompareResult.CLOSE;
      } else {
        return CompareResult.NOT_EQUAL;
      }
    };
  }
  return CompareResult.EQUAL;
}

export function compare(line1: string, line2: string): CompareResult {
  line1 ||= '';
  line2 ||= '';
  line1 = line1.trim();
  line2 = line2.trim();

  if (lineIsRawString(line1) || lineIsRawString(line2)) {
    return line1 == line2 ? CompareResult.EQUAL : CompareResult.NOT_EQUAL;
  }

  return compareNumbers(getNumbers(line1), getNumbers(line2));
}

// Hack for unit testing.
export const privateFunctions = {
  lineIsRawString,
  getNumbers,
  compareNumbers
};
