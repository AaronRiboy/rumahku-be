import express from 'express'
import UserController from './user'
import OfficerController from './officer'

const router = express.Router();

router.get('/', (req, res) => res.send('It works!'))
router.use('/users', UserController)
router.use('/officers', OfficerController)

export default router