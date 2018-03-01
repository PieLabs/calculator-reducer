import * as mathjs from 'mathjs';
import debug from 'debug';

export type State = {
  value: string;
  error?: Error;
};

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

export enum Inputs {
  PLUS_MINUS = 'plus-minus',
  CLEAR = 'clear',
  DECIMAL = '.',
  DELETE = 'delete',
  EQUALS = 'equals',
  SQUARE_ROOT = 'sqrt',
  SQUARE = 'square',
}

const reduce = (state: State, value: string): State => {

  if (!value || value.length === 0) {
    return state;
  }

  switch (value) {
    case Inputs.CLEAR: return { value: '' };
    case Inputs.PLUS_MINUS: {
      const value = state.value.indexOf('-') === 0 ? `${state.value.substring(1)}` : `-${state.value}`;
      return { value };
    }
    case Inputs.DECIMAL: {
      const value = addDecimal(state.value);
      return { ...state, value };
    }
    case Inputs.DELETE: {
      const { value } = state;
      return { value: removeLastChar(value) };
    }
    case Inputs.SQUARE_ROOT:
    case Inputs.SQUARE: return unary(state, value);
    case Inputs.EQUALS: return equals(state);
    default: return { value: `${state.value}${value}` };
  };
};


export default reduce;

