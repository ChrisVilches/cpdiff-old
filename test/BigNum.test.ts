import { BigNum } from '../src/BigNum';
import { CompareResult } from '../src/CompareResult';
import { expect } from 'chai';

describe('BigNum', function () {
  describe('.constructor', function () {
    it('detects incorrect strings correctly', function () {
      expect(() => { new BigNum('...') }).to.throw();
      expect(() => { new BigNum('03434') }).to.throw();
      expect(() => { new BigNum('0232.23') }).to.throw();
      expect(() => { new BigNum('-023') }).to.throw();
      expect(() => { new BigNum('-.3') }).to.throw();
      expect(() => { new BigNum('-1.') }).to.throw();
      expect(() => { new BigNum('343432423.4234234.34') }).to.throw();
    });

    it('parses correct strings correctly', function () {
      expect(() => { new BigNum('0') }).to.not.throw();
      expect(() => { new BigNum('1.1') }).to.not.throw();
      expect(() => { new BigNum('-1') }).to.not.throw();
      expect(() => { new BigNum('-1012301230123123812938123.21371829371289371289371289312313') }).to.not.throw();
      expect(() => { new BigNum('232323.2313823128312931237123') }).to.not.throw();
      expect(() => { new BigNum('-1.0') }).to.not.throw();
    });
  });

  describe('.toString', function () {
    it('converts the number to string correctly', function () {
      expect((new BigNum('34')).toString()).to.eq('34');
      expect((new BigNum('-1.00')).toString()).to.eq('-1');
      expect((new BigNum('1231312312310230123.1230123012031023')).toString()).to.eq('1231312312310230123.1230123012031023');
      expect((new BigNum('0')).toString()).to.eq('0');
    });
  });

  describe('.isInteger', function () {
    it('checks if the number is integer', function () {
      expect((new BigNum('34')).isInteger()).to.be.true;
      expect((new BigNum('-34')).isInteger()).to.be.true;
      expect((new BigNum('1.00000000000')).isInteger()).to.be.true;
      expect((new BigNum('2.0')).isInteger()).to.be.true;
      expect((new BigNum('34.0001')).isInteger()).to.be.false;
      expect((new BigNum('-34.2')).isInteger()).to.be.false;
      expect((new BigNum('1.0000000000000000000000000000000000000000000000000000000000000000000000001')).isInteger()).to.be.false;
      expect((new BigNum('2.00001')).isInteger()).to.be.false;
    });
  });

  describe('.isPositive', function () {
    it('checks if the number is positive', function () {
      expect((new BigNum(' 34')).isPositive()).to.be.true;
      expect((new BigNum('   -34')).isPositive()).to.be.false;
    });
  });

  describe('.firstDecimals', function () {
    it('gets the first N decimals correctly', function () {
      expect((new BigNum('34')).firstDecimals(5)).to.eq('00000');
      expect((new BigNum('-1.1234567')).firstDecimals(3)).to.eq('123');
      expect((new BigNum('-1.1234567')).firstDecimals(10)).to.eq('1234567000');
      expect((new BigNum('12341241.32')).firstDecimals(5)).to.eq('32000');
    });
  });

  describe('.compare', function () {
    it('compares integer numbers correctly (equal)', function () {
      expect((new BigNum('34')).compare(new BigNum('34'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('0')).compare(new BigNum('0'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('-1')).compare(new BigNum('-1'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('93712987192371289371298371289371289371286312736127')).compare(new BigNum('93712987192371289371298371289371289371286312736127'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('-111111111111111111111111101')).compare(new BigNum('-111111111111111111111111101'))).to.eq(CompareResult.EQUAL);
    });

    it('compares integer numbers correctly (not equal)', function () {
      expect((new BigNum('-34')).compare(new BigNum('34'))).to.eq(CompareResult.NOT_EQUAL);
      expect((new BigNum('-0')).compare(new BigNum('0'))).to.eq(CompareResult.NOT_EQUAL);
      expect((new BigNum('-12')).compare(new BigNum('-1'))).to.eq(CompareResult.NOT_EQUAL);
      expect((new BigNum('93712987192371289371298371289371289371286312736128')).compare(new BigNum('93712987192371289371298371289371289371286312736127'))).to.eq(CompareResult.NOT_EQUAL);
      expect((new BigNum('-111111111111111111111111101')).compare(new BigNum('-111111111111111111111111102'))).to.eq(CompareResult.NOT_EQUAL);
    });

    it('compares decimal numbers correctly (equal, all decimals exact)', function () {
      let huge = '-234892349328424324123912831209323948237894723984723984786193813901283091283901234.0000812384093248329048230941872381273812739127391237129378123';
      expect((new BigNum(huge)).compare(new BigNum(huge))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('34.811872381273812739127391237129378123')).compare(new BigNum('34.811872381273812739127391237129378123'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('0.912391371928371923721938712983')).compare(new BigNum('0.912391371928371923721938712983'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('0.1')).compare(new BigNum('0.10000000'))).to.eq(CompareResult.EQUAL);
      expect((new BigNum('-123.12340')).compare(new BigNum('-123.1234'))).to.eq(CompareResult.EQUAL);
    });

    it('compares decimal numbers correctly (similar)', function () {
      expect((new BigNum('34.811872381273812739127391237129378123')).compare(new BigNum('34.811873381273812739127391237129378123'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('0.912392371928371923721938712983')).compare(new BigNum('0.912391371928371923721938712983'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('0.1')).compare(new BigNum('0.10000500'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('0.100')).compare(new BigNum('0.100001'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('-123.123401')).compare(new BigNum('-123.1234'))).to.eq(CompareResult.CLOSE);
    });

    it('compares decimal numbers correctly (not equal)', function () {
      expect((new BigNum('34.811872381273812739127391237129378123')).compare(new BigNum('34.811873381273812739127391237129378123'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('34.811882381273812739127391237129378123')).compare(new BigNum('34.811873381273812739127391237129378123'))).to.eq(CompareResult.NOT_EQUAL);
      expect((new BigNum('-123.123401')).compare(new BigNum('-123.1234'))).to.eq(CompareResult.CLOSE);
      expect((new BigNum('-123.123401')).compare(new BigNum('-123.12341'))).to.eq(CompareResult.NOT_EQUAL);
    });
  });
});
