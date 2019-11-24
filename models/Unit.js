import mongoose from 'mongoose'

const ContractSchema = new mongoose.Schema({
    durationMonths: Number, // Always will be months
    ratePerMonth: Number // Rate per Month
})

const UnitSchema = new mongoose.Schema({
    residence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Residence',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mainImage: String,
    unitImages: [String],
    description: String,
    contracts: [ContractSchema],
    totalAvailable: Number,
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer',
        required: true
    }
})

export default mongoose.model('Unit', UnitSchema)