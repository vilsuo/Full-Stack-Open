import { useState, useEffect } from 'react'
import countryService from "../services/countries"

const CountryDetails = ({ name, showAll }) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (showAll) {
      countryService
        .findCountryDetails(name)
        .then(returnedCountry => {
          setCountry(returnedCountry)
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

const SingleCountryDetails = ({ name }) => {
  return (
    <div>
      <h1>{name}</h1>
      <CountryDetails name={name} showAll={true}/>
    </div>
  )
}

const Country = ({ name }) => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div id="details-toggle">
        {show ? <h1>{name}</h1> : name}
        <button onClick={() => setShow(!show)}>
          {show ? "hide" : "show"}
        </button>
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
    return <SingleCountryDetails name={name}/>
    
  } else {
    return <p>No countries</p>
  }
}

export default Info