import express from 'express'
import UserController from './user'
import OfficerController from './officer'
import ResidencesController from './residence'
import FacilityController from './facility'

const router = express.Router();

router.get('/', (req, res) => res.send('It works!'))
router.use('/users', UserController)
router.use('/officers', OfficerController)
router.use('/residences', ResidencesController)
router.use('/facility', FacilityController)

export default router