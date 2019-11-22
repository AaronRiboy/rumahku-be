import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User';
import argon2 from 'argon2';

class Authentication {
    constructor() {
        this.passport = passport;
        User.init()
    }

    initialize() {
        this.passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.APP_SECRET
        }, this.jwtStrategy))

        this.passport.use(new LocalStrategy({
            usernameField: 'email',
        }, this.localAuthentication));
        // this.passport.serializeUser(this.serializeUser);
        // this.passport.deserializeUser(this.deserializeUser);
    }

    async jwtStrategy(payload, done) {
        try {
            // Find the user in the 'sub' claim in token
            const user = await User.findById(payload.sub)

            // If user doesnt exist
            if (!user) {
                return done(null, false)
            }

            // If user exists
            done(null, user)

        } catch (error) {
            done(error, false)
        }
    }

    async localAuthentication(email, password, done) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, {
                    success: false,
                    errorMsg: 'email or password is invalid'
                })
            }

            if (!await user.verifyPassword(password)) {
                return done(null, false)
            } else {
                return done(null, user)
            }
        } catch (error) {
            console.log(error)
            done(null, false)
        }
    }

    // _makeSession (userId, userGroup, details) {
    //     this.userId = userId;
    //     this.userGroup = userGroup;
    //     this.details = details;
    // }

    // serializeUser(user, done) {
    //     console.log("Serializing user!", user);
    //     let userGroup = 'User';
    //     let userPrototype = Object.getPrototypeOf(user);

    //     if (userPrototype == Users.prototype) {
    //         userGroup = 'User';
    //     } else {
    //         console.log('we dont recognize this user leh')
    //     }

    //     done(null, this._makeSession(user._id, userGroup, ''));
    // }

    // async deserializeUser(session, done) {
    //     console.log("Deserializing user!");

    //     if (session.userGroup == 'User') {
    //         console.log('is user')
    //         const user = await Users.findOne({ _id: session.userId }, '-salt')

    //         done(null, user)
    //     }
    // }
}

export default Authentication
