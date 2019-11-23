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
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    }
}, {
    timestamps: true
})

export default mongoose.model('Facility', FacilitySchema)