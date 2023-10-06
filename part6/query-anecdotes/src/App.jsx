import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from '../requests'

const App = () => {
  const queryClient = useQueryClient()

  const voteAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  // The return value of the useQuery function is an object that
  // indicates the status of the query
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  // When the request is completed, the component is rendered again
  if (result.isLoading) {
    return <h1>loading...</h1>
  }
  
  if (result.isError) {
    return (
      <div>
        anecdote service is not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data

  const handleVote = anecdote => {
    voteAnecdoteMutation.mutate({
      id: anecdote.id,
      newObject: { ...anecdote, votes: anecdote.votes + 1 }
    })
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
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

export default App
