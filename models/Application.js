import mongoose from 'mongoose'




const ApplicationSchema = new mongoose.Schema({
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
    tenancy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenancy'
    },
    status: {
        type: string,
        enum: ['pending', 'approved', 'rejected']
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    }
}, {
    timestamps: true
})

export default mongoose.model('Application', ApplicationSchema)