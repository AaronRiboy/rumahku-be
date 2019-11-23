import express from 'express'
import multer from 'multer';
import fs from 'fs-extra';
import passport from 'passport';
import Facility from '../models/Facility'

const router = express.Router();
const officerJwt = passport.authenticate('officer-jwt', { session: false });

router.get('/', async (req, res) => {
    const facilities = await Facility.find()
    res.status(200).send(facilities)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const facility = await Facility.findById(id)

    if (!facility) {
        return res.status(404)
    }

    res.status(200).send(facility.toObject())
})

router.post('/', officerJwt, async (req, res) => {
    const { title, description, icon } = req.body;
    const officer = req.user;

    const facility = await Facility.create({
        title,
        description,
        icon,
        createdBy: officer._id
    })

    try {
        // const newPath = `/facilities/${facility._id}/icon.${iconFile.originalname.split('.').reverse()[0]}`
        // await fs.move(iconFile.path, `public${newPath}`)
        // facility.icon = `${req.protocol}://${req.get('host')}${newPath}`;
        await facility.save();
        res.status(201).send(facility.toObject())
    } catch(error) {
        console.log(error)
        res.status(500)
    }
})

router.delete('/:id', officerJwt, async (req, res) => {
    const { id } = req.params;
    
    const facility = await Facility.findById(id);
    if (!facility) {
        return res.status(404)
    }

    Facility.deleteOne({ _id: id }, function(err) {
        if (err) {
            return res.status(500)
        }
        return res.status(200).send(facility)
    })

})


export default router