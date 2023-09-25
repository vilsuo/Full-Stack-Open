import { useState, useEffect } from 'react'
import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const findCountryDetails = name => {
  return axios
    .get(`${baseUrl}/name/${name}`)
    .then(response => {
      return response.data
    })
}

const CountryDetails = ({ name, showAll }) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (showAll) {
      findCountryDetails(name)
        .then(data => {
          setCountry(data)
        })
    } else {
      setCountry(null)
    }
  }, [showAll])

  if (!showAll || !country) {
    return null
  }

  return (
    <>
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

const Country = ({ name }) => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div id="details-toggle">
        {show ? <h1>{name}</h1> : name} <button onClick={() => setShow(!show)}>{show ? "hide" : "show"}</button>
      </div>
      <CountryDetails name={name} showAll={show}/>
    </div>
  )
}

const Info = ({ names }) => {
  if (names.length > 10) {
    return <p>Too many countries, specify another filter</p>

  } else if (names.length > 1) {
    return (
      <>
        {names.map((name, index) => 
          <Country key={index} name={name}/>
        )}
      </>
    )

  } else if (names.length === 1) {
    const name = names[0]
    return (
      <div>
        <h1>{name}</h1>
        <CountryDetails name={name} showAll={true}/>
      </div>
    )
  }

  return null
}

function App() {
  const [value, setValue] = useState("")
  const [allNames, setAllNames] = useState([])
  const [matchingNames, setMatchingNames] = useState([])

  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        const countries = response.data.map(country => 
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
