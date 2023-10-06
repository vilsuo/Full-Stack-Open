import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

//const initialState = anecdotesAtStart.map(asObject)
const anecdotesSlice = createSlice({
  //  defines the prefix which is used in the action's type values
  name: 'anecdotes',
  initialState: [],
  reducers: {
      replaceAnecdote(state, action) {
      const id = action.payload.id
      const newAnecdote = action.payload.newObject
      return state.map(anecdote => {
        return anecdote.id !== id
          ? anecdote
          : newAnecdote
      })
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    addAnecdote(state, action) {
      return [ ...state, action.payload ]
    }
  }
})

export const { addAnecdote, replaceAnecdote, setAnecdotes } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.create(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.update(
      anecdote.id, { ...anecdote, votes: anecdote.votes + 1 }
    )
    dispatch(replaceAnecdote({
      id: anecdote.id,
      newObject: updatedAnecdote
    }))
  }
}

export default anecdotesSlice.reducer