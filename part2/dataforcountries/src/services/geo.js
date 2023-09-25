import axios from "axios"

const api_key = import.meta.env.VITE_SOME_KEY

const baseZipUrl = "http://api.openweathermap.org/geo/1.0/zip"
const baseDirectUrl = "http://api.openweathermap.org/geo/1.0/direct"

/*
const findCoordinates = ({ zipCode, countryCode}) => {
    return axios
        .get(`${baseZipUrl}?zip=${zipCode},${countryCode}appid=${api_key}`)
        .then(response => response.data)
}
*/

const findUsCoordinates = (cityName, stateCode, countryCode) => {
    return axios.get(
        `${baseDirectUrl}?q=${cityName},${stateCode},${countryCode}&limit=1&appid=${api_key}`)
        .then(response => response.data)
}

const findCoordinates = (cityName, countryCode) => {
    return axios.get(
        `${baseDirectUrl}?q=${cityName},${countryCode}&limit=1&appid=${api_key}`)
        .then(response => response.data)
}

export default { findUsCoordinates, findCoordinates }