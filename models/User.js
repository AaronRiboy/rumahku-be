import mongoose from 'mongoose'
import argon2 from 'argon2'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    nric: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function(next) {
    // no need to have salt generated, argon2 generates that internally
    const hash = await argon2.hash(this.password)

    // assign hash back to password
    this.password = hash

    next()
})

UserSchema.methods.verifyPassword = async function(password) {
    try {
        return await argon2.verify(this.password, password)
    } catch (error) {
        throw new Error(error)
    }
}

export default mongoose.model('User', UserSchema)