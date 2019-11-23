import express from 'express'
import fs from 'fs-extra';
import multer from 'multer';

import Residence from '../models/Residence';
import passport from 'passport';
import Officer from '../models/Officer';

const upload = multer({ dest: 'uploads/' });


const router = express.Router();

router.get('/', async (req, res) => {
    const residences = await Residence.find();
    res.status(200).json(residences);
})

const upload1 = upload.single('headerImg');
router.post('/', passport.authenticate('officer-jwt', { session: false }), upload1, async (req, res) => {

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


export default router