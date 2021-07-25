// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

const CountContext = React.createContext();

function useCount(){
	if (!React.useContext(CountContext)) throw Error('useCount must be used within a CountProvider');	 
	return React.useContext(CountContext);
}

function CountProvider(props) {
	const [ count, setCount ] = React.useState(0);
	const value = [count, setCount];
	return <CountContext.Provider value={value} {...props}></CountContext.Provider>
}

function CountDisplay() {
	const [ count, setCount ] = useCount();
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
	const [ count, setCount ] =  useCount();
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
			<CountProvider>
				<CountDisplay />
				<Counter />
			</CountProvider>
    </div>
  )
}

export default App
