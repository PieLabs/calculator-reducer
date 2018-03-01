import reduce from '../index';
import * as mathjs from 'mathjs';

describe('reduce', () => {

  const str = (s) => JSON.stringify(s);

  const _assert = only => (s, a, expected) => {

    const fn = only ? it.only : it;

    s = typeof s === 'string' ? { value: s } : s;
    expected = typeof expected === 'string' ? { value: expected } : expected;
    fn(`${str(s)} + ${str(a)} = ${str(expected)}`, () => {
      const result = reduce(s, a);
      expect(result).toEqual(expected);
    });
  };

  const assert = _assert(false);
  const assertOnly = _assert(true);

  describe('digit', () => {
    assert(
      { value: '1+' },
      { type: 'input', value: '1' },
      { value: '1+1' });
  });

  describe('equals', () => {
    assert('1+2', { type: 'equals' }, '3');
  });

  describe('operator', () => {
    assert(
      { value: '1' },
      { type: 'input', value: '+' },
      { value: '1+' }
    );
  });

  describe('plus-minus', () => {
    assert('111', { type: 'plus-minus' }, '-111');
  });

  describe('unary', () => {
    assert('4', { type: 'unary', unary: 'sqrt' }, '2');
    assert('4', { type: 'unary', unary: 'square' }, '16');
    assert('4', { type: 'unary', unary: 'log' }, mathjs.log('4').toString());
    assert('4', { type: 'unary', unary: 'foo' }, { value: '4', error: new Error('Unknown function: foo') });
    assert('(4 + 4) - 2 - 2', { type: 'unary', unary: 'sqrt' }, '2');
  });

  describe('clear', () => {
    assert(
      { value: '1' },
      { type: 'clear' },
      { value: '' });
  });

  describe('delete', () => {
    assert(
      { value: '' },
      { type: 'delete' },
      { value: '' });

    assert(
      { value: '11' },
      { type: 'delete' },
      { value: '1' });

    assert(
      { value: '11+' },
      { type: 'delete' },
      { value: '11' });
  });

  describe('decimal', () => {
    assert(
      { value: '1' },
      { type: 'input', value: '.' },
      { value: '1.' });

    assert(
      { value: '0' },
      { type: 'input', value: '.' },
      { value: '0.' });

    assert(
      { value: '', },
      { type: 'input', value: '.' },
      { value: '0.' });
  });
});
