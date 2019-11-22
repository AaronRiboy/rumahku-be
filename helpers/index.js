/**
 * HELPER METHODS
 * 
 */
import JWT from 'jsonwebtoken'

export default {
    generateToken (user) {
        return JWT.sign({
            iss: process.env.APP_NAME,
            sub: user._id,
            iat: Date.now(),
            exp: new Date().setDate(new Date().getDate() + 1)
        }, process.env.APP_SECRET)
    }
} 