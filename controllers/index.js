import express from 'express'
import UserController from './user'

const router = express.Router();

router.get('/', (req, res) => res.send('It works!'))
router.use('/users', UserController)

export default router