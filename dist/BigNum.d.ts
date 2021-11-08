import { CompareResult } from "./CompareResult";
export declare class BigNum {
    private positive;
    private integer;
    private decimal;
    constructor(num: string);
    static listOf(nums: number[]): BigNum[];
    isPositive(): boolean;
    isInteger(): boolean;
    compare(other: BigNum, errExp?: number): CompareResult;
    firstDecimals(n: number): string;
    toString(): string;
}
