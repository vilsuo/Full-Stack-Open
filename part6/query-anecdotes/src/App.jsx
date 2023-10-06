import { useQuery } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import { getAnecdotes } from '../requests'
import { MessageContextProvider} from './components/MessageContext'

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
    <>
      <h3>Anecdote app</h3>
      <MessageContextProvider>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList anecdotes={anecdotes} />
      </MessageContextProvider>
    </>
  )
}

export default App
