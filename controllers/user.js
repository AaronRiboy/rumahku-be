import express from 'express'
import JWT from 'jsonwebtoken'
import User from '../models/User'
import passport from 'passport'

const generateToken = (user) => {
    return JWT.sign({
        iss: process.env.APP_NAME,
        sub: user._id,
        iat: Date.now(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.APP_SECRET)
}

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
        
        // Needed to ensure 'unique' works
        // It initializes the indexs in MongoDB
        await User.init() 

        // Create the user
        const theUser = await User.create(doc)

        // Sign the Token
        const token = generateToken(theUser);

        // Send the Token back
        res.status(201).json({ token })

    } catch (error) {
        // If the username or emails exists
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

router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    const token = generateToken (req.user);
    res.status(200).send({ token })
})

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.send('You found me!')
})

export default router;