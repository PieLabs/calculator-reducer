export declare type State = {
    expr: string;
    error?: Error;
};
export declare enum Inputs {
    PLUS_MINUS = "plus-minus",
    CLEAR = "clear",
    DECIMAL = ".",
    DELETE = "delete",
    EQUALS = "equals",
    SQUARE_ROOT = "sqrt",
    SQUARE = "square",
    LOG = "log",
    SIN = "sin",
    PI = "\u03C0",
    DEGREES = "\u2218",
}
export declare const ALLOWED_INPUT: RegExp;
declare const reduce: (state: State, value: string) => State;
export default reduce;
