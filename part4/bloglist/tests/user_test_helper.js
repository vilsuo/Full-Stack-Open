const User = require('../models/user')

const initialUsers = [
  {
    name: 'tarja',
    username: 'harja',
    password: 'sal4sana'
  },
  {
    name: 'timo',
    username: 'timpuri',
    password: 'syysloma'
  }
]

const validNotTakenUser = {
  name: 'arto',
  username: 'amppari',
  password: 'hunaja17'
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}


module.exports = {
  initialUsers, validNotTakenUser, usersInDb
}