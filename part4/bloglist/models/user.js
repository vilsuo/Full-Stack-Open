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
  passwordHash: String,
  // The ids of the notes are stored within the user document as
  // an array of Mongo ids
  //
  // Arrays are special because they implicitly have a default value of []
  blogs: [
    // Mongo does not inherently know that this is a field that
    // references blogs, the syntax is purely related to and defined
    // by Mongoose
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
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