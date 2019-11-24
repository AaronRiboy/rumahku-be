import express from 'express'
import Application from '../models/Application'
import passport from 'passport';
import Unit from '../models/Unit';

const userJwt = passport.authenticate('user-jwt', { session: false });

const router = express.Router()

router.get('/', async (req, res) => {
    
    try {
        const applications = await Application.find().populate('unit approvedBy applyBy');
        return res.status(200).send(applications);
    } catch (error) {
        return res.status(500).send({
            success: false,
            errorMsg: 'An error occurred'
        })
    }
    
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const application = await Application.findById(id).populate('unit approvedBy applyBy');
        return res.status(200).send(application);
    } catch (error) {
        return res.status(500).send({
            success: false,
            errorMsg: 'An error occurred'
        })
    }
})

router.post('/', userJwt, async (req, res) => {
    const { unitId, contractId } = req.body;
    const user = req.user;

    const application = new Application({
        unit: unitId,
        contractId,
        applyBy: user._id
    })

    try {
        await application.save();
        const theApplication = await Application.findById(application._id).populate('unit applyBy');
        res.status(201).send(theApplication)
    } catch (error) {
        return res.status(500).send({
            success: false,
            errorMsg: 'An error occurred'
        })
    }
})

export default router