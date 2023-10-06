import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newObject =>
  axios.post(baseUrl, newObject).then(res => res.data)

export const updateAnecdote = ({ id, newObject }) => 
  axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
