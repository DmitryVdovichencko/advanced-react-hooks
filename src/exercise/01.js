// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// const countReducer = (previousCount, newCount) =>  typeof newCount === 'function' ? newCount(previousCount) : newCount;

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      return {...state, count: state.count + action.step}
    }
    default: {
      // helps us avoid typos!
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
function Counter({initialCount = 0, step = 1}) {
  // const [count, changeCount] = React.useReducer(countReducer, initialCount)
  // const increment = () => changeCount(count + step)
	const [state, dispatch] = React.useReducer(countReducer, {
		count: initialCount,
	})
	const {count} = state
	const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
