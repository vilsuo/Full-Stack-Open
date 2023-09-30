const mongoose = require('mongoose')

// Mongoose does not have a built-in validator for checking
// the uniqueness of a field
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  // password is valitated in controller
  passwordHash: String
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)