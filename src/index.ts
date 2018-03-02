import * as mathjs from 'mathjs';
import debug from 'debug';

export enum AngleMode {
  DEGREES = 'deg',
  RADIANS = 'rad'
}

export type State = {
  expr: string;
  angleMode: AngleMode;
  error?: Error;
};

const log = debug('@pie-labs:calculator-reducer');

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

const apply = (state: State, fn: (n: number) => number): State => {
  const o = evaluate(state.expr);
  if (o instanceof Error) {
    return { ...state, error: o };
  } else {
    const out = fn(o);
    return { ...state, expr: out.toString() };
  }
};

const fraction = (numerator: number, state: State): State => apply(state, n => numerator / n);


const percent = (state: State): State => apply(state, (o: number) => o * 0.01);

const evaluate = (expr: string): number | Error => {
  try {
    return mathjs.eval(expr);
  } catch (e) {
    log('[equals] error: ', e.message);
    return e;
  }
};

const equals = (s: State): State => {
  const o = evaluate(s.expr);
  if (o instanceof Error) {
    return { ...s, error: o };
  } else {
    return { ...s, expr: o.toString() };
  }
};

const unary = (state: State, unary: UnaryInput): State => {

  state = equals(state);

  if (state.error) {
    return state;
  } else {
    if (mathjs[unary] && typeof mathjs[unary] === 'function') {
      const expr = mathjs[unary.toString()](parseFloat(state.expr)).toString();
      return { ...state, expr };
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
  PI = 'π',
  FRACTION = '1/x',
  PERCENT = '%'
}

export enum UnaryInput {
  SQUARE_ROOT = 'sqrt',
  SQUARE = 'square',
  CUBE = 'cube',
  LOG = 'log',
}

export enum AngleInput {
  SIN = 'sin',
  COS = 'cos',
  TAN = 'tan',
  ASIN = 'asin',
  ACOS = 'acos',
  ATAN = 'atan'
}

export const radians = degrees => degrees * Math.PI / 180;

const degrees = radians => radians * 180 / Math.PI;

export const ALLOWED_INPUT: RegExp = /^[0-9\+\-\/\*\(\)\^]*$/;

const angle = (state: State, ai: AngleInput): State => {
  const o = evaluate(state.expr);
  if (o instanceof Error) {
    return { ...state, error: o };
  } else {
    const angle = state.angleMode === AngleMode.DEGREES ? radians(o) : o;
    const result = mathjs[ai](angle);
    return { ...state, expr: result.toString() };
  }
};

const fromStringTyped = <T>(o: any, s: string): T => {
  const keys = Object.keys(o);
  const k = keys.find(k => o[k] === s);
  return k ? o[k] : undefined;
};

const fromString = (s: string): AngleInput => {
  const keys = Object.keys(AngleInput);
  const k = keys.find(k => AngleInput[k] === s);
  return k ? AngleInput[k] : undefined;
};

const reduce = (state: State, value: string): State => {


  if (!value || value.length === 0) {
    return state;
  }

  const ai: AngleInput | undefined = fromStringTyped(AngleInput, value);

  if (ai) {
    return angle(state, ai);
  } else {

    const ui: UnaryInput | undefined = fromStringTyped(UnaryInput, value);
    if (ui) {
      return unary(state, ui);
    } else {

      switch (value) {
        case Inputs.CLEAR: return { ...state, expr: '' };
        case Inputs.PLUS_MINUS: {
          const expr = state.expr.indexOf('-') === 0 ? `${state.expr.substring(1)}` : `-${state.expr}`;
          return { ...state, expr };
        }
        case Inputs.DECIMAL: {
          const expr = addDecimal(state.expr);
          return { ...state, expr };
        }
        case Inputs.FRACTION: return fraction(1, state);
        case Inputs.PERCENT: return percent(state);
        case Inputs.DELETE: {
          const expr = removeLastChar(state.expr);
          return { ...state, expr };
        }
        case Inputs.PI: return { ...state, expr: mathjs.pi.toString() };
        case Inputs.EQUALS: return equals(state);
        default: {
          if (ALLOWED_INPUT.test(value)) {
            return { ...state, expr: `${state.expr}${value}` };
          } else {
            return {
              ...state,
              error: Error(`unknown input: ${value}`)
            };
          }
        }
      }
    }
  }
};

export default reduce;
