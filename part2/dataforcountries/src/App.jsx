import { useState, useEffect } from 'react'
import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"


const CountryDetails = ({ country }) => {
  if (!country) {
    return null
  }

  const capitals = country.capital.join(", ")
  return (
    <>
      <h1>{country.name.common}</h1>

      Capital(s): {country.capital.join(", ")}<br/>
      Area: {country.area}
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map((language, index) => 
          <li key={index}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
    </>
  )
}

const Countries = ({ names }) => {
  return (
    <>
      {names.map((name, index) => 
        <p key={index}>{name}</p>
      )}
    </>
  )
}

const Info = ({ names, country }) => {
  if (names.length > 10) {
    return <p>Too many countries, specify another filter</p>

  } else if (names.length > 1) {
    return <Countries names={names}/>

  } else if (names.length === 1) {
    return <CountryDetails country={country}/>

  }
  return null
}

function App() {
  const [value, setValue] = useState("")
  const [allNames, setAllNames] = useState([])
  const [matchingNames, setMatchingNames] = useState([])
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        //console.log('fetched all')
        const countries = response.data
          .map(country => 
            country.name.common
          )
        setAllNames(countries)
      })
  }, [])

  useEffect(() => {
    const found = allNames
      .filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      )
      setMatchingNames(found)
  }, [allNames, value])

  useEffect(() => {
    if (matchingNames.length === 1) {
      axios
        .get(`${baseUrl}/name/${matchingNames[0]}`)
        .then(response => {
          //console.log('fetched', response.data.name.common)
          setCountry(response.data)
        })
    } else {
      setCountry(null)
    }
  }, [matchingNames])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <>
      find countries <input value={value} onChange={handleChange} />
      <Info names={matchingNames} country={country}/>
    </>
  )
}

export default App
