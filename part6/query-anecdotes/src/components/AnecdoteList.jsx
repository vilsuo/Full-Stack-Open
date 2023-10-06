import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote } from '../../requests'
import { useMessageDispatch } from './MessageContext'

const AnecdoteList = ({ anecdotes }) => {
  const dispatch = useMessageDispatch()
  const queryClient = useQueryClient()

  // In order to render a new anecdote as well, we need to tell
  // React Query that the old result of the query whose key is the
  // string anecdotes should be invalidated.
  const voteAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updateAnecdote) => {
      queryClient.setQueryData(
        ['anecdotes'], anecdotes => anecdotes.map(anecdote => 
          anecdote.id !== updateAnecdote.id ? anecdote : updateAnecdote
        )
      )
    }
  })

  const handleVote = anecdote => {
    dispatch({type: 'SET', payload: `anecdote '${anecdote.content}' voted`})

    voteAnecdoteMutation.mutate({
      id: anecdote.id,
      newObject: { ...anecdote, votes: anecdote.votes + 1 }
    })

    setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList