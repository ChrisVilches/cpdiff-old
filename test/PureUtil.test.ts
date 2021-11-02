import { compare, privateFunctions } from '../src/PureUtil';
import { CompareResult } from '../src/CompareResult';
import { expect } from 'chai';

const { lineIsRawString, getNumbers, compareNumbers } = privateFunctions;

describe('PureUtil', function () {
  describe('.lineIsRawString', function () {
    it('detects raw strings correctly', function () {
      expect(lineIsRawString('x y z')).to.be.true;
      expect(lineIsRawString('x 1 z')).to.be.true;
      expect(lineIsRawString('x 3 2')).to.be.true;
    });

    it('detects number strings correctly', function () {
      expect(lineIsRawString('4 3 2')).to.be.false;
      expect(lineIsRawString('4 334')).to.be.false;
      expect(lineIsRawString('123')).to.be.false;
      expect(lineIsRawString(' 2345 ')).to.be.false;
      expect(lineIsRawString('4.45 22.3')).to.be.false;
      expect(lineIsRawString(' -2345 ')).to.be.false;
      expect(lineIsRawString('-4.45 22.3')).to.be.false;
    });
  });

  describe('.getNumbers', function () {
    it('gets the numbers correctly', function () {
      expect(getNumbers('1 2 3')).to.deep.equal([1, 2, 3]);
      expect(getNumbers('   1  2 3    ')).to.deep.equal([1, 2, 3]);
      expect(getNumbers('  4')).to.deep.equal([4]);
      expect(getNumbers(' -4   ')).to.deep.equal([-4]);
      expect(getNumbers('1 2    -4           5.0002 ')).to.deep.equal([1, 2, -4, 5.0002]);
    });
  });

  describe('.compareNumbers', function () {
    it('compares numbers that are the same', function () {
      expect(compareNumbers([1, 2, 3], [1, 2, 3])).to.eq(CompareResult.EQUAL);
      expect(compareNumbers([1, 2, 3, 4], [1, 2, 3, 4])).to.eq(CompareResult.EQUAL);
      expect(compareNumbers([100, -2, 3, 4], [100, -2, 3, 4])).to.eq(CompareResult.EQUAL);
    });

    it('compares numbers that are similar (within error)', function () {
      expect(compareNumbers([1, 2.000002, 3], [1, 2.000001, 3])).to.eq(CompareResult.CLOSE);
      expect(compareNumbers([-1.000012], [-1.000011])).to.eq(CompareResult.CLOSE);
    });

    it('compares numbers that are different', function () {
      expect(compareNumbers([1, 5], [1, 4])).to.eq(CompareResult.NOT_EQUAL);
      expect(compareNumbers([1, 5], [2, 5])).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares numbers that have different array length', function () {
      expect(compareNumbers([1, 5], [1, 5, 6])).to.eq(CompareResult.NOT_EQUAL);
      expect(compareNumbers([1, 5], [1])).to.eq(CompareResult.NOT_EQUAL);
    });
  });

  describe('.compare', function () {
    it('compares raw strings (equal)', function () {
      expect(compare('a', 'a')).to.eq(CompareResult.EQUAL);
      expect(compare(' a', 'a ')).to.eq(CompareResult.EQUAL);
    });

    it('compares raw strings (not equal)', function () {
      expect(compare('a', 'an')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' a', 'an ')).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares number strings (equal)', function () {
      expect(compare('1 2 3', '1 2 3')).to.eq(CompareResult.EQUAL);
      expect(compare(' 44.1  55.6  77.8', ' 44.1     55.6    77.8 ')).to.eq(CompareResult.EQUAL);
    });

    it('compares number strings (similar)', function () {
      expect(compare('1 2  3', '1 2 3.00001')).to.eq(CompareResult.CLOSE);
      expect(compare(' 4.01   -111.02 666', '  4.01001   -111.02 666 ')).to.eq(CompareResult.CLOSE);
    });

    it('compares number strings (not equal)', function () {
      expect(compare(' 1 2 3 4 ', ' 1 2 2 4')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' 1 2.00001 ', ' 1 2.00002')).to.eq(CompareResult.NOT_EQUAL);
      expect(compare(' 66 77 88 99 ', ' 66  77   88   -99 ')).to.eq(CompareResult.NOT_EQUAL);
    });
  });
});
