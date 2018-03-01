# calculator-reducer 

A calculator reducer function, build a ui on it.

```javascript
import reducer from 'calculator-reducer';
let state = {value: ''}
state = reducer(state, {type: 'input', value: '1'});
state = reducer(state, {type: 'input', value: '+'});
state = reducer(state, {type: 'input', value: '2'});
state = reducer(state, {type: 'equals'})
expect(state).toEqual({value: '3'});
```