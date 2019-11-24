import express from 'express'
import passport from 'passport'
import fs from 'fs-extra';
import multer from 'multer'
import Unit from '../models/Unit'
import Residence from '../models/Residence';

const upload = multer({ dest: 'uploads/' });
const officerJwt = passport.authenticate('officer-jwt', { session: false })

const router = express.Router()

/**
 * Sample Request
 * /api/units?residenceId={id}
 */
router.get('/', async (req, res) => {
    const { residenceId } = req.query;

    try {
        let units;
        if (residenceId) {
            units = await Unit.find({ residence: residenceId }).populate('residence createdBy');
        } else {
            units = await Unit.find().populate('residence createdBy')
        }

        res.status(200).send(units);
    } catch (e) {
        res.status(500).send({
            success: false,
            errorMsg: 'An error has occured'
        })
    }
})

router.get('/:id', async (req, res) => {
    const { id: unitId } = req.params;

    try {
        const unit = await Unit.findById(unitId);
        if (unit) {
            res.status(200).send(unit.toObject())
        } else {
            res.status(404).send({
                success: false,
                errorMsg: 'Not found'
            })
        }
    } catch (e) {
        res.status(500).send({
            success: false,
            errorMsg: 'An error has occured'
        })
    }
})

/**
 * Sample request
 * /api/units?residenceId={id}
 */
router.post('/', officerJwt, upload.single('mainImage'), async (req, res) => {
    const { residenceId } = req.query;
    const { name, description, totalAvailable, contracts } = JSON.parse(req.body.unitData);
    const mainImageFile = req.file;
    const officer = req.user;

    const residence = await Residence.findById(residenceId)

    if (!residenceId) {
        return res.status(400).send({
            success: false,
            errorMsg: 'residenceId is required'
        })
    }

    if (!residence) {
        return res.status(404).send({
            success: false,
            errorMsg: 'Residence not found'
        })
    }

    const unit = await Unit.create({
        residence,
        name,
        description,
        totalAvailable,
        contracts,
        createdBy: officer._id
    })

    try {
        // Construct the directory for the mainImageFile
        const newFilePath = `/units/${unit._id}/${mainImageFile.filename}.${mainImageFile.originalname.split('.').reverse()[0]}`

        // Move the uploaded file to the new directory
        await fs.move(mainImageFile.path, 'public' + newFilePath);

        // Set the path in the unit document
        unit.mainImage = `${req.protocol}://${req.get('host')}${newFilePath}`;

        // Save the document
        await unit.save()

        const createdUnit = await Unit.findById(unit._id).populate('residence createdBy', '-createdBy.password');
        res.status(201).send(createdUnit)

    } catch(e) {
        console.log(e)
        res.status(500).send({ success: false, errorMsg: 'An error has occured' })
    }
    
})

export default router