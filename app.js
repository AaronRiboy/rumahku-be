import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()

import Database from './database';
import userController from './controllers/user.controller';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send("It works")
})

app.use('/api/user', userController)

app.listen(3030, () => {
    console.log('App is listening at http://localhost:3030')
})