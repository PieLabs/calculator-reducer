import reduce from '../index';
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

  describe('unary', () => {
    assert('4', 'sqrt', '2');
    assert('4', 'square', '16');
    assert('4', 'log', mathjs.log('4').toString());
    assert('(4 + 4) - 2 - 2', 'sqrt', '2');
  });

  describe('badInput', () => {
    assert('4', 'foo', { expr: '4' });
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
