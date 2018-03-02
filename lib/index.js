"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs = require("mathjs");
const debug_1 = require("debug");
var AngleMode;
(function (AngleMode) {
    AngleMode["DEGREES"] = "deg";
    AngleMode["RADIANS"] = "rad";
})(AngleMode = exports.AngleMode || (exports.AngleMode = {}));
var Inputs;
(function (Inputs) {
    Inputs["PLUS_MINUS"] = "plus-minus";
    Inputs["CLEAR"] = "clear";
    Inputs["DECIMAL"] = ".";
    Inputs["DELETE"] = "delete";
    Inputs["EQUALS"] = "equals";
    Inputs["PI"] = "\u03C0";
    Inputs["FRACTION"] = "1/x";
    Inputs["PERCENT"] = "%";
    Inputs["EXPONENT"] = "e";
    Inputs["FACTORIAL"] = "!";
})(Inputs = exports.Inputs || (exports.Inputs = {}));
var UnaryInput;
(function (UnaryInput) {
    UnaryInput["SQUARE_ROOT"] = "sqrt";
    UnaryInput["SQUARE"] = "square";
    UnaryInput["CUBE"] = "cube";
    UnaryInput["ABS"] = "abs";
})(UnaryInput = exports.UnaryInput || (exports.UnaryInput = {}));
var LogInput;
(function (LogInput) {
    LogInput["LOG"] = "log";
    LogInput["NATURAL_LOG"] = "ln";
})(LogInput = exports.LogInput || (exports.LogInput = {}));
var AngleInput;
(function (AngleInput) {
    AngleInput["SIN"] = "sin";
    AngleInput["COS"] = "cos";
    AngleInput["TAN"] = "tan";
    AngleInput["ASIN"] = "asin";
    AngleInput["ACOS"] = "acos";
    AngleInput["ATAN"] = "atan";
})(AngleInput = exports.AngleInput || (exports.AngleInput = {}));
const log = debug_1.default('@pie-labs:calculator-reducer');
exports.radians = degrees => degrees * Math.PI / 180;
exports.ALLOWED_INPUT = /^[0-9\+\-\/\*\(\)\^]*$/;
const removeLastChar = (s) => {
    if (s.length === 0) {
        return s;
    }
    const out = s.substring(0, s.length - 1);
    return out === '' ? '0' : out;
};
const addDecimal = (s) => {
    const t = s || '0';
    return t.indexOf('.') === -1 ? `${t}.` : t;
};
const apply = (state, fn) => {
    const o = evaluate(state.expr);
    if (o instanceof Error) {
        return Object.assign({}, state, { error: o });
    }
    else {
        const out = fn(o);
        return Object.assign({}, state, { expr: out.toString() });
    }
};
const fraction = (numerator, state) => apply(state, n => numerator / n);
const factorial = (state) => {
    if (state.expr.endsWith('!')) {
        return Object.assign({}, state, { expr: state.expr.substr(0, state.expr.length - 1) });
    }
    else {
        return apply(state, n => `${n}!`);
    }
};
const percent = (state) => apply(state, (o) => o * 0.01);
const evaluate = (expr) => {
    try {
        return mathjs.eval(expr);
    }
    catch (e) {
        log('[equals] error: ', e.message);
        return e;
    }
};
const equals = (s) => {
    const o = evaluate(s.expr);
    if (o instanceof Error) {
        return Object.assign({}, s, { error: o });
    }
    else {
        return Object.assign({}, s, { expr: o.toString() });
    }
};
const calculateLog = (state, li) => {
    log('[calculateLog] li: ', li);
    return apply(state, n => {
        return (li === LogInput.LOG ? mathjs.log(n, 10) : mathjs.log(n)).toString();
    });
};
const unary = (state, unary) => {
    state = equals(state);
    if (state.error) {
        return state;
    }
    else {
        if (mathjs[unary] && typeof mathjs[unary] === 'function') {
            const expr = mathjs[unary.toString()](parseFloat(state.expr)).toString();
            return Object.assign({}, state, { expr });
        }
        else {
            return Object.assign({}, state, { error: new Error(`Unknown function: ${unary}`) });
        }
    }
};
const angle = (state, ai) => {
    const o = evaluate(state.expr);
    if (o instanceof Error) {
        return Object.assign({}, state, { error: o });
    }
    else {
        const angle = state.angleMode === AngleMode.DEGREES ? exports.radians(o) : o;
        const result = mathjs[ai](angle);
        return Object.assign({}, state, { expr: result.toString() });
    }
};
const fromStringTyped = (o, s) => {
    const keys = Object.keys(o);
    const k = keys.find(k => o[k] === s);
    return k ? o[k] : undefined;
};
const fromString = (s) => {
    const keys = Object.keys(AngleInput);
    const k = keys.find(k => AngleInput[k] === s);
    return k ? AngleInput[k] : undefined;
};
const reduce = (state, value) => {
    if (!value || value.length === 0) {
        return state;
    }
    const ai = fromStringTyped(AngleInput, value);
    if (ai) {
        return angle(state, ai);
    }
    else {
        const ui = fromStringTyped(UnaryInput, value);
        if (ui) {
            return unary(state, ui);
        }
        else {
            const li = fromStringTyped(LogInput, value);
            if (li) {
                return calculateLog(state, li);
            }
            else {
                switch (value) {
                    case Inputs.CLEAR: return Object.assign({}, state, { expr: '' });
                    case Inputs.PLUS_MINUS: {
                        const expr = state.expr.indexOf('-') === 0 ? `${state.expr.substring(1)}` : `-${state.expr}`;
                        return Object.assign({}, state, { expr });
                    }
                    case Inputs.DECIMAL: {
                        const expr = addDecimal(state.expr);
                        return Object.assign({}, state, { expr });
                    }
                    case Inputs.FRACTION: return fraction(1, state);
                    case Inputs.PERCENT: return percent(state);
                    case Inputs.DELETE: {
                        const expr = removeLastChar(state.expr);
                        return Object.assign({}, state, { expr });
                    }
                    case Inputs.FACTORIAL: return factorial(state);
                    case Inputs.PI: return Object.assign({}, state, { expr: mathjs.pi.toString() });
                    case Inputs.EXPONENT: return Object.assign({}, state, { expr: mathjs.e.toString() });
                    case Inputs.EQUALS: return equals(state);
                    default: {
                        if (exports.ALLOWED_INPUT.test(value)) {
                            return Object.assign({}, state, { expr: `${state.expr}${value}` });
                        }
                        else {
                            return Object.assign({}, state, { error: Error(`unknown input: ${value}`) });
                        }
                    }
                }
            }
        }
    }
};
exports.default = reduce;
//# sourceMappingURL=index.js.map