import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import User from '../models/User';
import Officer from '../models/Officer';
import argon2 from 'argon2';

class Authentication {
    constructor() {
        this.passport = passport;
        User.init()
    }

    initialize() {
        this.passport.use('user-jwt', new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.APP_SECRET
        }, this.userJwtStrategy))

        this.passport.use('user-local', new LocalStrategy({
            usernameField: 'email',
        }, this.userLocalStrategy));

        this.passport.use('officer-jwt', new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.APP_SECRET
        }, this.officerJwtStrategy))

        this.passport.use('officer-local', new LocalStrategy({
            usernameField: 'email',
        }, this.officerLocalStrategy));

        this.passport.use('anonymous', new AnonymousStrategy())
    }

    async userJwtStrategy(payload, done) {
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

    async officerJwtStrategy(payload, done) {
        try {
            // Find the user in the 'sub' claim in token
            const officer = await Officer.findById(payload.sub)

            // If user doesnt exist
            if (!officer) {
                return done(null, false)
            }

            // If user exists
            done(null, officer)

        } catch (error) {
            done(error, false)
        }
    }

    async userLocalStrategy(email, password, done) {
        try {
            const user = await User.findOne({ email }).select("+password");

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

    async officerLocalStrategy(email, password, done) {
        try {
            const officer = await Officer.findOne({ email });

            if (!officer) {
                return done(null, false, {
                    success: false,
                    errorMsg: 'email or password is invalid'
                })
            }

            if (!await officer.verifyPassword(password)) {
                return done(null, false)
            } else {
                return done(null, officer)
            }
        } catch (error) {
            console.log(error)
            done(null, false)
        }
    }
}

export default Authentication
