import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const findCountryDetails = name => {
    return axios
        .get(`${baseUrl}/name/${name}`)
        .then(response => {
            return response.data
        })
}

const findAll = () => {
    return axios
        .get(`${baseUrl}/all`)
        .then(response => {
            return response.data
        })
}

export default {
    findCountryDetails, findAll
}