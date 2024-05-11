import jwt from 'jsonwebtoken';
import { User } from './Models/User.js';

//Generate JWT token
let generateJwtToken = (id) => {
  // eslint-disable-next-line no-undef
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

//Decode Jwt Token
const decodeJwtToken = (token) => {
  try {
    // eslint-disable-next-line no-undef
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error('Error in Jwt Decoding', error);
    return null;
  }
};

//Get Current Date
function getCurrentDate() {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  let date = day + '/' + month + '/' + year;
  return date;
}

//Function for Send Notification
async function SendNotification({ id, content }) {
  let user = await User.findById({ _id: id });
  let notifications = [content, ...user.notifications];
  //Send Notification
  await User.findOneAndUpdate(
    { _id: id },
    { $set: { notifications: notifications } }
  );
}

export { decodeJwtToken, getCurrentDate, SendNotification, generateJwtToken };
