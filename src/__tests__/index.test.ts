import reduce, { AngleInput, AngleMode, radians, UnaryInput } from '../index';
import * as mathjs from 'mathjs';

describe('reduce', () => {

  const str = (s) => JSON.stringify(s);

  const a = only => (s, a: string, expected) => {

    const fn = only ? it.only : it;

    s = typeof s === 'string' ? { expr: s } : s;
    expected = typeof expected === 'string' ? { expr: expected } : expected;
    fn(`${str(s)} + ${str(a)} = ${str(expected)}`, () => {
      const result = reduce(s, a);
      expect(result).toEqual(expected);
    });
  };

  const assert = a(false);
  const assertOnly = a(true);

  const { RADIANS, DEGREES } = AngleMode;
  const { ASIN, SIN, TAN } = AngleInput;
  const { SQUARE, CUBE, SQUARE_ROOT, LOG } = UnaryInput;

  describe('angle-input', () => {
    assert(
      { expr: '30', angleMode: AngleMode.DEGREES },
      SIN,
      {
        expr: mathjs.sin(mathjs.unit(30, DEGREES)).toString(), angleMode: DEGREES
      });

    assert(
      { expr: '30', angleMode: RADIANS },
      SIN,
      { expr: mathjs.sin(mathjs.unit(30, RADIANS)).toString(), angleMode: RADIANS });

    assert(
      { expr: '30', angleMode: DEGREES },
      ASIN,
      {
        expr: mathjs.asin(radians(30)).toString(), angleMode: DEGREES
      });
    assert(
      { expr: '30', angleMode: RADIANS },
      ASIN,
      {
        expr: mathjs.asin(30).toString(), angleMode: RADIANS
      });

    assert(
      { expr: '30', angleMode: RADIANS },
      SIN,
      { expr: mathjs.sin(mathjs.unit(30, RADIANS)).toString(), angleMode: RADIANS });

    assert(
      { expr: '30', angleMode: DEGREES },
      TAN,
      { expr: mathjs.tan(mathjs.unit(30, DEGREES)).toString(), angleMode: DEGREES });

    assert(
      { expr: '30', angleMode: AngleMode.RADIANS },
      TAN,
      { expr: mathjs.tan(mathjs.unit(30, RADIANS)).toString(), angleMode: RADIANS });
  });



  describe('digit', () => {
    assert('1+', '1', { expr: '1+1' });
  });

  describe('equals', () => {
    assert('1+2', 'equals', '3');
  });

  describe('operator', () => {
    assert('1', '+', { expr: '1+' });
  });

  describe('plus-minus', () => {
    assert('111', 'plus-minus', '-111');
  });

  describe('power of', () => {
    assert('2', '^', '2^');
  });

  describe('fraction', () => {
    assert('2', '1/x', '0.5');
  });

  describe('unary', () => {
    assert('2', SQUARE, { expr: '4' });
    assert('4', SQUARE_ROOT, '2');
    assert('4', SQUARE, '16');
    assert('4', LOG, mathjs.log('4').toString());
    assert('(4 + 4) - 2 - 2', SQUARE_ROOT, '2');


  });

  describe('%', () => {
    assert('2', '%', '0.02');
  });

  describe('badInput', () => {
    assert('4', 'foo', { expr: '4', error: new Error('unknown input: foo') });
  });

  describe('clear', () => {
    assert('1', 'clear', { expr: '' });
  });

  describe('delete', () => {
    assert('', 'delete', { expr: '' });
    assert('11', 'delete', { expr: '1' });
    assert('11+', 'delete', { expr: '11' });
  });

  describe('decimal', () => {
    assert('1', '.', { expr: '1.' });
    assert('0', '.', { expr: '0.' });
    assert('', '.', { expr: '0.' });
  });
});
