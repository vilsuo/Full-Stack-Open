import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createAnecdote } from "../../requests"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // That is, in the onSuccess callback, the queryClient object first reads the existing
    // anecdotes state of the query and updates it by adding a new anecdote, which is
    // obtained as a parameter of the callback function.
    onSuccess: (newAnecdote) => {
      //const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData(['anecdotes'], anecdotes => anecdotes.concat(newAnecdote))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate({ content, votes: 0 })
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
