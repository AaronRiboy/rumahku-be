// Environment Variables
import dotenv from 'dotenv'
dotenv.config()

// Library Imports
import express from 'express';
import cors from 'cors';

// Non library imports
import Database from './database';
import Auth from './config/auth';
import routes from './controllers';

// Authentication Setup
const auth = new Auth();
auth.initialize();

// Intialise Express
const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.static('public'));

// Register Main Router
app.use('/api', routes)

// Start server
app.listen(3030, () => {
    console.log('App is listening at http://localhost:3030')
})