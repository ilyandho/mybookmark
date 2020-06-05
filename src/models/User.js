const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'please provide first name'],
    minlength: [3, 'first name must be 3 characters or more'],
  },
  surname: {
    type: String,
    required: [true, 'please provide surname'],
    minlength: [3, 'username must be  6 characters or more'],
  },
  username: {
    type: String,
    required: [true, 'please provide username'],
    minlength: [8, 'username must be  8 characters or more'],
    unique: [true, 'username already exists'],
  },
  password: {
    type: String,
    minlength: [8, 'password must be 8 characters or more'],
  },
  email: { type: String, unique: [true, 'email already registered'] },
  bookmarks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'BookMark',
    },
  ],
  favoriteBookmarks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'BookMark',
    },
  ],
  heartedBookmarks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'BookMark',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('User', userSchema);
