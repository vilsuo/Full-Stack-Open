import { useState, useEffect } from 'react'
import axios from "axios"
import personsService from "./services/persons"
import Input from './components/Input'

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

  useEffect(() => {
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const nameIsTaken = name => {
    return persons.find(person => person.name === name) !== undefined
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newPersonValues = {
      name: newName,
      number: newNumber,
    }

    if (nameIsTaken(newName)) {
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
      setPersons(persons.concat(createdPerson))
      setNewName("")
      setNewNUmber("")
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
    })
  }

  const handleRemove = id => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService
        .remove(id)
        .then(response => {
          console.log('response id', id, response)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNUmber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
