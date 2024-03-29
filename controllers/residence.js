import express from 'express'
import fs from 'fs-extra';
import multer from 'multer';

import Residence from '../models/Residence';
import passport from 'passport';
import Officer from '../models/Officer';

const upload = multer({ dest: 'uploads/' });
const officerJwt = passport.authenticate('officer-jwt', { session: false })

const router = express.Router();

router.get('/', async (req, res) => {
    const residences = await Residence.find().populate('facilities');
    res.status(200).json(residences);
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const residence = await Residence.findById(id).populate('facilities');
    if (!residence) return res.status(404);
    res.status(200).send(residence)
})

const upload1 = upload.single('headerImg');
router.post('/', officerJwt, upload1, async (req, res) => {

    const {
        name,
        district,
        city,
        description,
        numUnits
    } = req.body;

    const officer = req.user;

    const residence = await Residence.create({
        name,
        district,
        city,
        description,
        numUnits,
        createdBy: officer._id
    })

    const headerImgFile = req.file;
    try {
        const newPath = `/residences/${residence._id}/header_img.${headerImgFile.originalname.split('.').reverse()[0]}`
        await fs.move(headerImgFile.path, 'public' + newPath)
        residence.headerImg = `${req.protocol}://${req.get('host')}${newPath}`;
        await residence.save();
        
        res.status(201).send(residence)
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

router.patch('/:id', officerJwt, async(req, res) => {
    const updateObj = req.body;
    const { id } = req.params;

    console.log(updateObj)
    await Residence.updateOne({ _id: id }, updateObj)
    const residence = await Residence.findById(id).populate('facilities')
    res.status(200).send(residence)
})

router.delete('/:id', officerJwt, async (req, res) => {
    const { id } = req.params;
    
    const residence = await Residence.findById(id);
    if (!residence) {
        return res.status(404)
    }

    try {
        const imagePath = `public/residences/${residence._id}`;
        await fs.remove(imagePath)
    } catch (error) {
        console.log(`an error occured when deleting the folder: public/residences/${residence._id}`)
    }

    Residence.deleteOne({ _id: id }, function(err) {
        if (err) {
            return res.status(500)
        }
        return res.status(200).send(residence)
    })

})

export default router