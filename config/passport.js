import mongoose from 'mongoose'
import passport from 'passport'
import LocalStrategy from 'passport-local'

const Users = mongoose.model('Users')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}))