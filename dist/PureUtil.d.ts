import { CompareResult } from './CompareResult';
import { BigNum } from './BigNum';
/**
 * Pure functions only.
 */
/**
 * TODO: Not the best way to do this. The best way would be to throw some exception from
 * 'getNumbers' and catch it, and when it's caught, the line is processed as a raw string.
 * This way we can avoid executing the same conversion to BigNum so many times.
 * (But at least this code fixed all tests. It's just sub optimal performance wise).
 */
declare function lineIsRawString(line: string): boolean;
declare function getNumbers(line: string): BigNum[];
declare function compareNumbers(nums1: BigNum[], nums2: BigNum[]): CompareResult;
export declare function compare(line1: string, line2: string): CompareResult;
export declare const privateFunctions: {
    lineIsRawString: typeof lineIsRawString;
    getNumbers: typeof getNumbers;
    compareNumbers: typeof compareNumbers;
};
export {};
