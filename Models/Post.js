import mongoose from 'mongoose';

let postSchema = new mongoose.Schema({
  userId: {
    type: 'string',
    required: true,
  },
  userName: {
    type: 'string',
    required: true,
  },
  userGender: {
    type: 'string',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  details: {
    type: 'string',
    required: true,
  },
  image: {
    type: 'string',
  },
  date: {
    type: 'string',
    required: true,
  },
  comments: {
    type: 'array',
    default: [],
  },
  views: {
    type: 'number',
    default: 0,
  },
});

let Post = mongoose.model('Post', postSchema);
export { Post };
