import { compare, privateFunctions } from '../src/PureUtil';
import { CompareResult } from '../src/CompareResult';
import { expect } from 'chai';
import { BigNum } from '../src/BigNum';

const { lineIsRawString, getNumbers, compareNumbers } = privateFunctions;

const bigNumToNumber = (bigNum: BigNum): number => +bigNum.toString();

describe('PureUtil', function () {
  describe('.lineIsRawString', function () {
    it('detects raw strings correctly', function () {
      expect(lineIsRawString('x y z')).to.be.true;
      expect(lineIsRawString('x 1 z')).to.be.true;
      expect(lineIsRawString('x 3 2')).to.be.true;
      expect(lineIsRawString(' 00001 ')).to.be.true;
      expect(lineIsRawString('1212 00001 3434')).to.be.true;
      expect(lineIsRawString('022 033 044 011 01 02')).to.be.true;
      expect(lineIsRawString(' 011111111111111010102910291219208121802192012 ')).to.be.true;
      expect(lineIsRawString('01')).to.be.true;
    });

    it('detects number strings correctly', function () {
      expect(lineIsRawString('0')).to.be.false;
      expect(lineIsRawString('1')).to.be.false;
      expect(lineIsRawString('12')).to.be.false;
      expect(lineIsRawString('-0')).to.be.false;
      expect(lineIsRawString('-1')).to.be.false;
      expect(lineIsRawString('-12')).to.be.false;
      expect(lineIsRawString('4 3 2')).to.be.false;
      expect(lineIsRawString('4 334')).to.be.false;
      expect(lineIsRawString('123')).to.be.false;
      expect(lineIsRawString(' 2345 ')).to.be.false;
      expect(lineIsRawString('4.45 22.3')).to.be.false;
      expect(lineIsRawString('4.45239842347932847238947239400023948234 22.300239420492304923049230492402349023')).to.be.false;
      expect(lineIsRawString('12830912839128391203213123.12313 9012839128309128312903829138192038192031293213.23')).to.be.false;
      expect(lineIsRawString(' -2345 ')).to.be.false;
      expect(lineIsRawString('-4.45 22.3')).to.be.false;
    });
  });

  describe('.getNumbers', function () {
    it('gets the numbers correctly', function () {
      expect(getNumbers('1 2 3').map(bigNumToNumber)).to.deep.equal([1, 2, 3]);
      expect(getNumbers('   1  2 3    ').map(bigNumToNumber)).to.deep.equal([1, 2, 3]);
      expect(getNumbers('  4').map(bigNumToNumber)).to.deep.equal([4]);
      expect(getNumbers(' -4   ').map(bigNumToNumber)).to.deep.equal([-4]);
      expect(getNumbers('1 2    -4           5.0002 ').map(bigNumToNumber)).to.deep.equal([1, 2, -4, 5.0002]);
    });
  });

  describe('.compareNumbers', function () {
    it('compares numbers that are the same', function () {
      expect(compareNumbers(BigNum.listOf([1, 2, 3]), BigNum.listOf([1, 2, 3]))).to.eq(CompareResult.EQUAL);
      expect(compareNumbers(BigNum.listOf([1, 2, 3, 4]), BigNum.listOf([1, 2, 3, 4]))).to.eq(CompareResult.EQUAL);
      expect(compareNumbers(BigNum.listOf([100, -2, 3, 4]), BigNum.listOf([100, -2, 3, 4]))).to.eq(CompareResult.EQUAL);
    });

    it('compares numbers that are similar (within error)', function () {
      expect(compareNumbers(BigNum.listOf([1, 2.000002, 3]), BigNum.listOf([1, 2.000001, 3]))).to.eq(CompareResult.CLOSE);
      expect(compareNumbers(BigNum.listOf([-1.000012]), BigNum.listOf([-1.000011]))).to.eq(CompareResult.CLOSE);
    });

    it('compares numbers that are different', function () {
      expect(compareNumbers(BigNum.listOf([1, 5]), BigNum.listOf([1, 4]))).to.eq(CompareResult.NOT_EQUAL);
      expect(compareNumbers(BigNum.listOf([1, 5]), BigNum.listOf([2, 5]))).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares numbers that have different array length', function () {
      expect(compareNumbers(BigNum.listOf([1, 5]), BigNum.listOf([1, 5, 6]))).to.eq(CompareResult.NOT_EQUAL);
      expect(compareNumbers(BigNum.listOf([1, 5]), BigNum.listOf([1]))).to.eq(CompareResult.NOT_EQUAL);
    });
  });

  describe('.compare', function () {
    it('compares raw strings (equal)', function () {
      expect(compare('a', 'a')).to.eq(CompareResult.EQUAL);
      expect(compare(' a', 'a ')).to.eq(CompareResult.EQUAL);
      expect(compare(' 01101010110100101010101010100101010100110101010000000001', '   01101010110100101010101010100101010100110101010000000001 ')).to.eq(CompareResult.EQUAL);
    });

    it('compares raw strings (not equal)', function () {
      expect(compare('a', 'an')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' a', 'an ')).to.eq(CompareResult.NOT_EQUAL);

      expect(compare(' 01101010110100101010101010100101010100110101010000000001', '   01101010110100101010101010100101010100110101010000000011 ')).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares number strings (equal)', function () {
      expect(compare('1 2 3', '1 2 3')).to.eq(CompareResult.EQUAL);
      expect(compare(' 44.1  55.6  77.8', ' 44.1     55.6    77.8 ')).to.eq(CompareResult.EQUAL);
    });

    it('compares long number strings (equal)', function () {
      expect(compare(' 101000000000000000010000000000', ' 101000000000000000010000000000  ')).to.eq(CompareResult.EQUAL);
    });

    it('compares long number strings (not equal)', function () {
      expect(compare(' 101000000000000000010000000000', ' 101000000000000000010000000001  ')).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares number strings (similar)', function () {
      expect(compare('1 2  3', '1 2 3.000001')).to.eq(CompareResult.CLOSE);
      expect(compare(' 4.01   -111.02 666', '  4.010001   -111.02 666 ')).to.eq(CompareResult.CLOSE);
    });

    it('compares long number strings (similar)', function () {
      expect(compare(' 101000000000000000010000000000000123.0001101011', ' 101000000000000000010000000000000123.0001101012')).to.eq(CompareResult.CLOSE);
    });

    it('compares number strings (not equal)', function () {
      expect(compare(' 1 2 3 4 ', ' 1 2 2 4')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' 1 2.00001 ', ' 1 2.00002')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' 66 77 88 99 ', ' 66  77   88   -99 ')).to.eq(CompareResult.NOT_EQUAL);
    });
  });
});
