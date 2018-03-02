import * as mathjs from 'mathjs';
import debug from 'debug';

export type State = {
  expr: string;
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

const equals = (s: State): State => {
  try {
    const expr = mathjs.eval(s.expr).toString();
    return { expr };
  } catch (e) {
    log('[equals] error: ', e.message);
    return { expr: s.expr, error: e as Error };
  }
};

const unary = (state: State, unary: string): State => {

  state = equals(state);

  if (state.error) {
    return state;
  } else {
    if (mathjs[unary] && typeof mathjs[unary] === 'function') {
      const expr = mathjs[unary](parseFloat(state.expr)).toString();
      return { expr };
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
  LOG = 'log'
}

export const ALLOWED_INPUT: RegExp = /^[0-9\+\-\/\*]*$/;

const reduce = (state: State, value: string): State => {

  if (!value || value.length === 0) {
    return state;
  }

  switch (value) {
    case Inputs.CLEAR: return { expr: '' };
    case Inputs.PLUS_MINUS: {
      const expr = state.expr.indexOf('-') === 0 ? `${state.expr.substring(1)}` : `-${state.expr}`;
      return { expr };
    }
    case Inputs.DECIMAL: {
      const expr = addDecimal(state.expr);
      return { expr };
    }
    case Inputs.DELETE: {
      const expr = removeLastChar(state.expr);
      return { expr };
    }
    case Inputs.SQUARE_ROOT:
    case Inputs.LOG:
    case Inputs.SQUARE: return unary(state, value);
    case Inputs.EQUALS: return equals(state);
    default: {
      if (ALLOWED_INPUT.test(value)) {
        return { expr: `${state.expr}${value}` };
      } else {
        return state;
      }
    }
  }
};


export default reduce;

