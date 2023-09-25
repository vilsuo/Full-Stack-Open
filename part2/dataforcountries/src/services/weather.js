import axios from "axios"

const api_key = import.meta.env.VITE_SOME_KEY

const baseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather"
const baseImageUrl = "https://openweathermap.org/img/wn"

const find = (lat, lon) => {
    return axios.get(
            `${baseWeatherUrl}?lat=${lat}&lon=${lon}&appid=${api_key}`
        )
        .then(response => response.data)
}

const getImageSrc = icon => `${baseImageUrl}/${icon}@2x.png`

const toCelsius = kelvin => {
    const celcius =  kelvin - 273.15
    return Math.round((celcius + Number.EPSILON) * 100) / 100
}

export default { find, getImageSrc, toCelsius }