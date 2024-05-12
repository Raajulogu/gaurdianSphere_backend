import mongoose from 'mongoose';

let caseSchema = new mongoose.Schema({
  userId: {
    type: 'string',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  mobile: {
    type: 'string',
    required: true,
  },
  address: {
    type: 'string',
    required: true,
  },
  incidentSpot: {
    type: 'string',
    required: true,
  },
  time: {
    type: 'string',
  },
  incidentDate: {
    type: 'string',
    required: true,
  },
  details: {
    type: 'string',
    required: true,
  },
  filedDate: {
    type: 'string',
    required: true,
  },
  takenBy: {
    type: 'string',
  },
  updates: {
    type: 'array',
    default: [],
  },
  isClosed: {
    type: 'boolean',
    default: false,
  },
  closedDate: {
    type: 'string',
  },
});

let Case = mongoose.model('Case', caseSchema);
export { Case };
