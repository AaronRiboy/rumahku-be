import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema({
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
    contractId: {
        type: String,
        required: true
    },
    status: {
        type: String, // careful
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    },
    applyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

export default mongoose.model('Application', ApplicationSchema)