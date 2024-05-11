import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  dob: {
    type: 'string',
  },
  gender: {
    type: 'string',
    required: true,
  },
  city: {
    type: 'string',
    required: true,
  },
  mobile: {
    type: 'string',
    required: true,
  },
  alertNumber: {
    type: 'array',
    default: [],
  },
  lastOtp: {
    type: 'object',
    default: {},
  },
  notifications: {
    type: 'array',
    default: [],
  },
});

let User = mongoose.model('User', userSchema);
export { User };
