import { CompareResult } from './CompareResult';
declare function lineIsRawString(line: string): boolean;
declare function getNumbers(line: string): number[];
declare function compareNumbers(nums1: number[], nums2: number[]): CompareResult;
export declare function compare(line1: string, line2: string): CompareResult;
export declare const privateFunctions: {
    lineIsRawString: typeof lineIsRawString;
    getNumbers: typeof getNumbers;
    compareNumbers: typeof compareNumbers;
};
export {};
