const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello world!')
})

app.listen(3030, () => {
    console.log('App is listening at http://localhost:3030')
})