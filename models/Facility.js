import mongoose from 'mongoose'

const FacilitySchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    schema: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Facility', FacilitySchema)