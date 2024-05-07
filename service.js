import jwt from "jsonwebtoken";
import { User } from "./Models/User.js";

//Generate JWT token
let generateJwtToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY);
  };

//Decode Jwt Token
const decodeJwtToken = (token) => {
    try {
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded.id;
    } catch (error) {
      console.error("Error in Jwt Decoding", error);
      return null;
    }
};

export { decodeJwtToken,generateJwtToken };