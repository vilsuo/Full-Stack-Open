import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  // The newName state is meant for controlling the form input element.
  const [newName, setNewName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson !== undefined) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPersons = persons.concat( {name: newName})
      setPersons(newPersons)
      setNewName("")
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => 
        <p>{person.name}</p>
      )}
    </div>
  )
}

export default App