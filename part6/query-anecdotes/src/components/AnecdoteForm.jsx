import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createAnecdote } from "../../requests"
import { useMessageDispatch } from './MessageContext'

const AnecdoteForm = () => {
  const dispatch = useMessageDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // That is, in the onSuccess callback, the queryClient object first
    // reads the existing anecdotes state of the query and updates it by
    // adding a new anecdote, which is obtained as a parameter of the
    // callback function.
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(
        ['anecdotes'], anecdotes => anecdotes.concat(newAnecdote)
      )
    },
    onError: (error) => {
      dispatch({
        type: 'SET',
        payload: error.response.data.error
      })
  
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate({ content, votes: 0 })

    dispatch({
      type: 'SET',
      payload: `created anecdote '${content}'`
    })

    setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
