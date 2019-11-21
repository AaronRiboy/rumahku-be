import express from 'express'
import User from '../models/User'

const router = express.Router()

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    res.send(user)
})

router.post('/', async (req, res) => {
    const { username, firstName, lastName, nric, dateOfBirth, email, password } = req.body;

    const doc = new User({
        username,
        firstName,
        lastName,
        nric,
        dateOfBirth,
        email,
        password
    })

    try {
        await User.init()
        const theUser = await User.create(doc)
        const sanitisedUser = theUser.toObject();
        delete sanitisedUser.password;
        res.status(201).json(sanitisedUser)
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({
                success: false,
                errorMsg: "The username or email already exists"
            })
        } else {
            res.status(500)
        }
    }

})


export default router;