import { useState, useEffect } from 'react'
import countryService from "./services/country"
import Info from './components/Info'

function App() {
  const [value, setValue] = useState("")
  const [allNames, setAllNames] = useState([])
  const [matchingNames, setMatchingNames] = useState([])

  console.log('App loaded')
  useEffect(() => {
    countryService.findAll()
      .then(returnedCountries => {
        const countryNames = returnedCountries.map(country => 
          country.name.common
        )
        setAllNames(countryNames)
      })
  }, [])

  useEffect(() => {
    const found = allNames
      .filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      )
      setMatchingNames(found)
  }, [allNames, value])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <>
      find countries <input value={value} onChange={handleChange} />
      <Info names={matchingNames}/>
    </>
  )
}

export default App
