import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./db.js";
import { authRouter } from "./Routers/auth.js";

//ENV Configuration
dotenv.config();

let app = express();
let PORT = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//DB Connection
dbConnection();

//routes
app.use("/api/auth", authRouter);

//Server connection
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));