// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(dispatch){
	const mountRef = React.useRef(false);
	React.useEffect(() => {
		mountRef.current = true;
		return () => mountRef.current = false
	}, []);
	return React.useCallback((...args) => {
		if(mountRef.current){
			dispatch(...args)
		}
	},[dispatch]);
}

function PokemonInfo({pokemonName}) {
	const useAsync = (initialState) => {
		const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
			...initialState,
			data: null,
			error: null,
		})
		const dispatch = useSafeDispatch(unsafeDispatch);
		const run = React.useCallback((promise) => {
			if (!promise) {
				return 
			}
			dispatch({type: 'pending'});
			promise.then(
				data => {
					dispatch({type: 'resolved', data})
				},
				error => {
					dispatch({type: 'rejected', error})
				},
			)
		},[]);
		return { ...state, run};
	}


	const {data: pokemon, status, error, run} = useAsync({
		status: pokemonName ? 'pending' : 'idle',
	})
	
	React.useEffect(() => {
		if (!pokemonName) {
			return
		}
		run(fetchPokemon(pokemonName))
		return () => {
			console.log("PokemonInfo unmounted")
		}
	}, [pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }
	React.useEffect(() => {
		return () => {
			console.log("App unmounted")
		}
	}, []);
	const appRef = React.useRef(null);
  return (
    <div ref={appRef} className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} appRef={appRef} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
