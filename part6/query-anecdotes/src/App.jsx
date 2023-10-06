import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from '../requests'

const App = () => {
  // The return value of the useQuery function is an object that
  // indicates the status of the query
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    // default functionality of React Query's queries is that the queries (whose status is
    // stale) are updated when window focus, i.e. the active element of the application's
    // user interface, changes
    refetchOnWindowFocus: false
  })

  const queryClient = useQueryClient()

  // In order to render a new anecdote as well, we need to tell
  // React Query that the old result of the query whose key is the
  // string anecdotes should be invalidated.
  const voteAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = anecdote => {
    voteAnecdoteMutation.mutate({
      id: anecdote.id,
      newObject: { ...anecdote, votes: anecdote.votes + 1 }
    })
  }

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
