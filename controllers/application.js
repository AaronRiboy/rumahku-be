import express from 'express'
import Application from '../models/Application'
import fs from 'fs-extra';


const router = express.Router()

router.get('/', async (req, res) => {
    const residences = await Residence.find();
    res.status(200).json(residences);
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const residence = await Residence.findById(id);
    if (!residence) return res.status(404);
    res.status(200).send(residence)
})
