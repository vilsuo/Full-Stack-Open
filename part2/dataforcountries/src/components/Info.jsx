import { useState, useEffect } from 'react'
import countryService from "../services/country"
import geoService from "../services/geo"
import weatherService from '../services/weather'

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

const Weather = ({ lat, lng, name }) => {
  const [weather, setWeather] = useState(null)

  console.log('Weather loaded')
  useEffect(() => {
    weatherService
      .find(lat, lng)
      .then(returnedWeather => {
        setWeather(returnedWeather)
      })
    }, [])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>temperature {weatherService.toCelsius(weather.main.temp)} Celcius</p>
      <img 
        src={weatherService.getImageSrc(weather.weather[0].icon)}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

// find coordinates for every capital
const WeatherInfo = ({ capitalNames, countryCode }) => {
  const [coordinates, setCoordinates] = useState([])

  console.log('WeatherInfo loaded', coordinates)
  useEffect(() => {
    let tempCoords = coordinates
    console.log('effect')
    capitalNames.forEach(capitalName => {
      geoService
        .findCoordinates(capitalName, countryCode)
        .then(data => {
          const lat = data[0].lat
          const lng = data[0].lon

          tempCoords = [
            ...tempCoords,
            {
              "name" : capitalName,
              "coord" : { 
                "lat": lat,
                "lng": lng 
              }
            }
          ]

          setCoordinates(tempCoords)
          console.log('set')
        })
    })
  }, [])

  return (
    <div>
      {coordinates.map((value, index) => 
        <Weather key = {index}
          lat={value["coord"]["lat"]}
          lng={value["coord"]["lng"]}
          name={value["name"]}
        />
      )}
    </div>
  )
}

const CompleteCountryDetails = ({ name }) => {
  const [country, setCountry] = useState(null)

  console.log('CompleteCountryDetails loaded')
  useEffect(() => {
    countryService
      .findCountryDetails(name)
      .then(returnedCountry => {
        setCountry(returnedCountry)
      })
  }, [])

  if (!country) {
    return null
  }

  const countryName = country.name.common
  const countryCode = country.cca2
  const capitalNames = country.capital
  const area = country.area
  const languages = country.languages

  return (
    <>
      <h1>{countryName}</h1>
      <div>
          Capital{capitalNames.length > 1 ? "s" : ""}: {capitalNames.join(", ")}<br/>
          Area: {area}
          <h2>languages:</h2>
          <ul>
          {Object.values(languages).map((language, index) => 
              <li key={index}>{language}</li>
          )}
          </ul>
        <img src={country.flags.png} alt={country.flags.alt}/>
      </div>
      <div>
        <WeatherInfo
          capitalNames={capitalNames}
          countryCode={countryCode}
        />
      </div>
    </>
  )
}

const Info = ({ names }) => {
  console.log('Info loaded')
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
    return <CompleteCountryDetails name={name}/>

  } else {
    return <p>No countries</p>
  }
}

export default Info