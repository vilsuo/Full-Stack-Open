import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = value => {
  token = `Bearer ${value}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updates) => {
  const response = await axios.put(
    `${baseUrl}/${id}`, updates
  )

  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { setToken, getAll, create, update, remove }