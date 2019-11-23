import mongoose from 'mongoose'

const UnitSchema = new mongoose.Schema({
    residence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Residence'
    },
    name: String,
    image: String,
    description: String,
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }],
    rate: {
        type: number,
        required: true
    },
    duration: {
        type: number,
        required: true
    },
    totalAvailable: number
})

export default mongoose.model('Unit', UnitSchema)