// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello world!')
})

app.post('/', async (req, res) => {
    console.log('user want to post something')
})

app.listen(3030, () => {
    console.log('App is listening at http://localhost:3030')
})