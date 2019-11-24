import express from 'express'
import User from '../models/User'
import passport from 'passport'
import helpers from '../helpers'

const router = express.Router()


/**
 * To retrieve the profile of the User
 */
router.get('/:id', passport.authenticate('user-jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    // Don't send the user's password back to the user
    try {
        const user = await User.findById(id).select('-password');
        if (id != userId) {
            return res.status(401).json({ success: false, errorMsg: 'Unauthorized' })
        }
        res.send(user)
    } catch (error) {
        // If the request specifies an Id that crashes our mongo
        return res.status(401).json({ success: false, errorMsg: 'Unauthorized' })
    }

})

/**
 * Controller method to register an user
 * It returns a JWT token
 */
router.post('/', async (req, res) => {
    const { username, firstName, lastName, nric, dateOfBirth, email, password, salary } = req.body;
    
    const doc = new User({
        username,
        firstName,
        lastName,
        nric,
        dateOfBirth,
        email,
        password,
        salary
    })

    try {
        
        // Needed to ensure 'unique' works
        // It initializes the indexs in MongoDB
        await User.init() 

        // Create the user
        const theUser = await User.create(doc)

        // Sign the Token
        const token = helpers.generateToken(theUser);

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

/**
 * Given the email and password, log the user in
 */
router.post('/login', passport.authenticate('user-local', { session: false }), async (req, res) => {
    const token = helpers.generateToken (req.user);
    const user = await User.findById(req.user._id).select('-password -__v');
    res.status(200).send({ ...user.toObject(), token })
})


export default router;