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
        const value = mathjs.eval(s.value).toString();
        return { value };
    }
    catch (e) {
        log('[equals] error: ', e.message);
        return { value: s, error: e };
    }
};
const unary = (state, unary) => {
    state = equals(state);
    if (state.error) {
        return state;
    }
    else {
        if (mathjs[unary] && typeof mathjs[unary] === 'function') {
            const value = mathjs[unary](parseFloat(state.value)).toString();
            return { value };
        }
        else {
            return Object.assign({}, state, { error: new Error(`Unknown function: ${unary}`) });
        }
    }
};
const reduce = (state, action) => {
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
                    return Object.assign({}, state, { value });
                }
                default: {
                    return Object.assign({}, state, { value: `${state.value}${action.value}` });
                }
            }
        }
        case 'delete': {
            const { value } = state;
            return Object.assign({}, state, { value: removeLastChar(value) });
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
exports.default = reduce;
//# sourceMappingURL=index.js.map