import { useState } from 'react'

const Input = ({text, value, onChange}) => {
  return (
    <div>
      {text} <input value={value} onChange={onChange}/>
    </div>
  )
}

const Person = ({ person }) => <p>{person.name} {person.number}</p>

const Persons = ({ persons, filter }) => {
  return (
    <>
      {persons
        .filter(person => person.name.toLowerCase()
                              .includes(filter.toLowerCase()))
        .map(person => 
          <Person person={person} key={person.id}/>
        )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNUmber] = useState('')
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson !== undefined) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPersons = persons.concat({
        name: newName,
        number: newNumber,
        id: persons.length + 1
      })

      setPersons(newPersons)
      setNewName("")
      setNewNUmber("")
    }
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
      <Input text="Filter shown with"
             value={filter}
             onChange={handleFilterChange}/>
      <h2>Add new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Input text="name:"
                 value={newName}
                 onChange={handleNameChange}/>
        </div>
        <div>
          <Input text="number:"
                 value={newNumber}
                 onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App
