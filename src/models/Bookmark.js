const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
  url: { type: String, required: [true, 'Please provide a url'] },
  title: String,
  description: String,
  caption: String,
  image: String,
  favicon: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now() },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  hearts: { type: Number, default: 0 },
  hearters: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  favoriters: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

BookmarkSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('BookMark', BookmarkSchema);
