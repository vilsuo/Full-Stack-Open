import { useState, useEffect } from 'react'
import personsService from "./services/persons"
import Input from './components/Input'
import Notification from './components/Notification'

const Person = ({ person, removeHandler }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={removeHandler}>remove</button>
    </div>
  )
}

const Persons = ({ persons, filter, removeHandler }) => {
  return (
    <>
      {persons
        .filter(person => 
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map(person => 
          <Person 
            key={person.id}
            person={person}
            removeHandler={() => removeHandler(person.id)}
          />
        )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNUmber] = useState('')
  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState(null)
  
  useEffect(() => {
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const setSuccessMessage = message => {
    setMessage(message)
    setMessageColor("green")

    setTimeout(() => {
      setMessage(null)
      setMessageColor(null)
    }, 5000)
  }

  const setErrorMessage = message => {
    setMessage(message)
    setMessageColor("red")

    setTimeout(() => {
      setMessage(null)
      setMessageColor(null)
    }, 5000)
  }

  const isNameTaken = name => {
    return persons.find(person => 
      person.name.toLowerCase() === name.toLowerCase()
    )
  }

  const handleSubmit = event => {
    event.preventDefault()

    const newPersonValues = {
      name: newName,
      number: newNumber,
    }

    if (isNameTaken(newName)) {
      const numberUpdateConfirmMessage = `${newName} is already added to phonebook, replace the old number with a new one?`

      if (window.confirm(numberUpdateConfirmMessage)) {
        const personToUpdate = persons.find(person => 
          person.name.toLowerCase() === newName.toLowerCase()
        )
        handleUpdate(personToUpdate.id, newPersonValues)
      }
    } else {
      handleCreate(newPersonValues)
    }
  }

  const handleCreate = newPerson => {
    personsService
      .create(newPerson)
      .then(createdPerson => {
        setMessage()
        setMessageColor()
        setPersons(persons.concat(createdPerson))
        setNewName("")
        setNewNUmber("")

        setSuccessMessage(`Added ${createdPerson.name}`)
      })
      .catch(error => {
        setErrorMessage(`Error adding ${newPerson.name}`)
      })
  }

  const handleUpdate = (id, newPersonValues) => {
    personsService
      .update(id, newPersonValues)
      .then(updatedPerson => {
        setPersons(
          persons.map(person => 
            person.id !== id ? person : updatedPerson
          )
        )
        setNewName("")
        setNewNUmber("")

        setSuccessMessage(`Updated ${updatedPerson.name}`)
      })
      .catch(error => {
        setErrorMessage(`Information of ${newPersonValues.name} has already been removed from the server`)
      })
  }

  const handleRemove = id => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))

          setSuccessMessage(`Deleted ${personToDelete.name}`)
        })
        .catch(error => {
          setErrorMessage(`Error removing ${personToDelete.name}`)
        })
    }
  }

  const handleFilterChange = event => setFilter(event.target.value)

  const handleNameChange = event => setNewName(event.target.value)

  const handleNumberChange = event => setNewNUmber(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} color={messageColor}/>
      <Input
        text="Filter shown with"
        value={filter}
        onChange={handleFilterChange}
      />
      <h2>Add new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            text="name:"
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <Input
            text="number:"
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={filter}
        removeHandler={handleRemove}
      />
    </div>
  )
}

export default App
