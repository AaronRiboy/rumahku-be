import express from 'express'
import Officer from '../models/Officer'
import passport from 'passport'
import helpers from '../helpers'

const router = express.Router()

/**
 * To retrieve the profile of the officer
 */
router.get('/:id', passport.authenticate('officer-jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const officerId = req.user._id;

    // Don't send the officer's password back to the officer
    try {
        const officer = await Officer.findById(id).select('-password');
        if (id != officerId) {
            return res.status(401).json({ success: false, errorMsg: 'Unauthorized' })
        }
        res.send(officer)
    } catch (error) {
        // If the request specifies an Id that crashes our mongo
        return res.status(401).json({ success: false, errorMsg: 'Unauthorized' })
    }

})

/**
 * Controller method to register an officer
 * It returns a JWT token
 */
router.post('/', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    
    const doc = new Officer({
        username,
        firstName,
        lastName,
        email,
        password
    })

    try {
        
        // Needed to ensure 'unique' works
        // It initializes the indexs in MongoDB
        await Officer.init() 

        // Create the user
        const theOfficer = await Officer.create(doc)

        // Sign the Token
        const token = helpers.generateToken(theOfficer);
        
        // Send the Token back
        res.status(201).json({ token })

    } catch (error) {
        console.log(error)
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
 * Given the email and password, log the officer in
 */
router.post('/login', passport.authenticate('officer-local', { session: false }), async (req, res) => {
    const token = helpers.generateToken (req.user);
    const officer = await Officer.findById(req.user._id).select('-password -__v');
    res.status(200).send({ ...officer.toObject(), token })
})

export default router;