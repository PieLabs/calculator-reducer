export declare enum AngleMode {
    DEGREES = "deg",
    RADIANS = "rad",
}
export declare type State = {
    expr: string;
    angleMode: AngleMode;
    error?: Error;
};
export declare enum Inputs {
    PLUS_MINUS = "plus-minus",
    CLEAR = "clear",
    DECIMAL = ".",
    DELETE = "delete",
    EQUALS = "equals",
    PI = "\u03C0",
    FRACTION = "1/x",
    PERCENT = "%",
    EXPONENT = "e",
    FACTORIAL = "!",
}
export declare enum UnaryInput {
    SQUARE_ROOT = "sqrt",
    SQUARE = "square",
    CUBE = "cube",
    ABS = "abs",
}
export declare enum LogInput {
    LOG = "log",
    NATURAL_LOG = "ln",
}
export declare enum AngleInput {
    SIN = "sin",
    COS = "cos",
    TAN = "tan",
    ASIN = "asin",
    ACOS = "acos",
    ATAN = "atan",
}
export declare const radians: (degrees: any) => number;
export declare const ALLOWED_INPUT: RegExp;
declare const reduce: (state: State, value: string) => State;
export default reduce;
