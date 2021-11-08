import { CompareResult } from './CompareResult';
import { BigNum } from './BigNum';
import { ERR } from './Constants';

/**
 * Pure functions only.
 */

/**
 * TODO: Not the best way to do this. The best way would be to throw some exception from
 * 'getNumbers' and catch it, and when it's caught, the line is processed as a raw string.
 * This way we can avoid executing the same conversion to BigNum so many times.
 * (But at least this code fixed all tests. It's just sub optimal performance wise).
 */
function lineIsRawString(line: string): boolean {
  line = line.trim();
  try {
    line.split(' ').filter(str => str.length > 0).map(str => new BigNum(str));
    return false;
  } catch {
  }
  return true;
}

function getNumbers(line: string): BigNum[] {
  return line.split(' ').filter(str => str.length > 0).map(str => new BigNum(str));
}

function compareNumbers(nums1: BigNum[], nums2: BigNum[]): CompareResult {
  if (nums1.length != nums2.length) return CompareResult.NOT_EQUAL;

  let closeFound = false;

  for (let i = 0; i < nums1.length; i++) {
    let comparison: CompareResult = nums1[i].compare(nums2[i], ERR);

    if (comparison == CompareResult.CLOSE) {
      closeFound = true;
    } else if (comparison == CompareResult.NOT_EQUAL) {
      return CompareResult.NOT_EQUAL;
    }
  }

  if (closeFound) return CompareResult.CLOSE;
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
