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
    tenancies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenancy'
    }],
    totalAvailable: number
})

export default mongoose.model('Unit', UnitSchema)