import * as mathjs from 'mathjs';
import debug from 'debug';

const log = debug('calculator-reducer');

const removeLastChar = (s: string) => {
  if (s.length === 0) {
    return s;
  }
  const out = s.substring(0, s.length - 1);
  return out === '' ? '0' : out;
};

const addDecimal = (s: string): string => {
  const t: string = s || '0';
  return t.indexOf('.') === -1 ? `${t}.` : t;
};

const equals = (s) => {
  try {
    const value = mathjs.eval(s.value).toString();
    return { value };
  } catch (e) {
    log('[equals] error: ', e.message);
    return { value: s, error: e };
  }
};

const unary = (state, unary) => {

  state = equals(state);

  if (state.error) {
    return state;
  } else {
    if (mathjs[unary] && typeof mathjs[unary] === 'function') {
      const value = mathjs[unary](parseFloat(state.value)).toString();
      return { value };
    } else {
      return { ...state, error: new Error(`Unknown function: ${unary}`) };
    }
  }
};

const reduce = (state, action): any => {

  switch (action.type) {
    case 'clear': {
      return { value: '' };
    }
    case 'plus-minus': {
      const value = state.value.indexOf('-') === 0 ? `${state.value.substring(1)}` : `-${state.value}`;
      return { value };
    }
    case 'input': {
      switch (action.value) {
        case '.': {
          const value = addDecimal(state.value);
          return { ...state, value };
        }
        default: {
          return { ...state, value: `${state.value}${action.value}` };
        }
      }
    }
    case 'delete': {
      const { value } = state;
      return { ...state, value: removeLastChar(value) };
    }
    case 'unary': {
      return unary(state, action.unary);
    }
    case 'equals': {
      return equals(state);
    }
    default: {
      return state;
    }
  }
};

export default reduce;

