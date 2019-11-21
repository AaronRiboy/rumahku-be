import mongoose from 'mongoose'

const TenancySchema = new mongoose.Schema({
    rate: Number,
    duration: Number
}, {
    timestamps: true
})

export default mongoose.model('Tenancy', TenancySchema)