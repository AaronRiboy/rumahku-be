import express from 'express'
import multer from 'multer';
import fs from 'fs-extra';
import passport from 'passport';
import Facility from '../models/Facility'

const router = express.Router()
const upload = multer({ dest: 'uploads' })
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

const upload1 = upload.single('icon');
router.post('/', officerJwt, async (req, res) => {
    const { title, description } = req.body;
    const iconFile = req.file;
    const officer = req.user;

    const facility = await Facility.create({
        title,
        description,
        createdBy: officer._id
    })

    try {
        const newPath = `/facilities/${facility._id}/icon.${iconFile.originalname.split('.').reverse()[0]}`
        await fs.move(iconFile.path, `public${newPath}`)
        facility.icon = `${req.protocol}://${req.get('host')}${newPath}`;
        facility.save();
        res.status(201).send(facility.toObject())
    } catch(error) {
        console.log(error)
        res.status(500)
    }
})

router.delete('/:id', officerJwt, async (req, res) => {
    const { id } = req.params;
    const facility = await Facility.findById(id)

    if (!facility) {
        res.status(404)
    }

    await facility.remove();
    res.status(202)
})


export default router