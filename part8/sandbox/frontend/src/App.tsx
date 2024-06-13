import { useApolloClient, useQuery } from '@apollo/client'
import Persons from './Persons'
import { ALL_PERSONS } from './queries'
import PersonForm from './PersonForm'
import { useState } from 'react'
import Notify from './Notify'
import PhoneForm from './PhoneForm'
import LoginForm from './LoginForm'

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient();

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()

    // resets the cache of the Apollo client: some queries might have
    // fetched data to cache, which only logged-in users should have access to
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
