"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs = require("mathjs");
const debug_1 = require("debug");
const log = debug_1.default('calculator-reducer');
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
const equals = (s) => {
    try {
        const expr = mathjs.eval(s.expr).toString();
        return { expr };
    }
    catch (e) {
        log('[equals] error: ', e.message);
        return { expr: s.expr, error: e };
    }
};
const unary = (state, unary) => {
    state = equals(state);
    if (state.error) {
        return state;
    }
    else {
        if (mathjs[unary] && typeof mathjs[unary] === 'function') {
            const expr = mathjs[unary](parseFloat(state.expr)).toString();
            return { expr };
        }
        else {
            return Object.assign({}, state, { error: new Error(`Unknown function: ${unary}`) });
        }
    }
};
var Inputs;
(function (Inputs) {
    Inputs["PLUS_MINUS"] = "plus-minus";
    Inputs["CLEAR"] = "clear";
    Inputs["DECIMAL"] = ".";
    Inputs["DELETE"] = "delete";
    Inputs["EQUALS"] = "equals";
    Inputs["SQUARE_ROOT"] = "sqrt";
    Inputs["SQUARE"] = "square";
    Inputs["LOG"] = "log";
    Inputs["SIN"] = "sin";
    Inputs["PI"] = "\u03C0";
    Inputs["DEGREES"] = "\u2218";
})(Inputs = exports.Inputs || (exports.Inputs = {}));
exports.ALLOWED_INPUT = /^[0-9\+\-\/\*\(\)npm ]*$/;
const reduce = (state, value) => {
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
        case Inputs.PI: return { expr: mathjs.pi.toString() };
        case Inputs.SQUARE_ROOT:
        case Inputs.SIN:
        case Inputs.LOG:
        case Inputs.SQUARE: return unary(state, value);
        case Inputs.EQUALS: return equals(state);
        default: {
            if (exports.ALLOWED_INPUT.test(value)) {
                return { expr: `${state.expr}${value}` };
            }
            else {
                return Object.assign({}, state, { error: Error(`unknown input: ${value}`) });
            }
        }
    }
};
exports.default = reduce;
//# sourceMappingURL=index.js.map