import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnection } from './db.js';
import { authRouter } from './Routers/auth.js';
import { postRouter } from './Routers/post.js';

//ENV Configuration
dotenv.config();

let app = express();
// eslint-disable-next-line no-undef
let PORT = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//DB Connection
dbConnection();

//routes
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);

//Server connection
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
