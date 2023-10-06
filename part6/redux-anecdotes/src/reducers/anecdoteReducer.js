import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

//const initialState = anecdotesAtStart.map(asObject)
const anecdotesSlice = createSlice({
  //  defines the prefix which is used in the action's type values
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      return [ ...state, asObject(action.payload) ]
    },
    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(anecdote => {
        return anecdote.id !== id
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      })
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }

})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdotesSlice.actions

export default anecdotesSlice.reducer