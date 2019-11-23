import mongoose from 'mongoose'

const ResidenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    numUnits: Number,
    numUnitsOccupied: Number,
    numApplications: Number,
    images: [String],
    headerImg: String,
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    }
})

export default mongoose.model('Residence', ResidenceSchema)