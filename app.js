import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()

import Database from './database';
import Auth from './config/auth';
import routes from './controllers';

const auth = new Auth();
auth.initialize();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', routes)

app.listen(3030, () => {
    console.log('App is listening at http://localhost:3030')
})