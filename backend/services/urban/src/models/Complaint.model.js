import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    // Reference to Nexus request ID
    nexusRequestId: {
        type: String,
        required: true,
        index: true
    },
    citizenId: {
        type: String,
        required: true,
        index: true
    },
    citizenName: {
        type: String,
        required: true
    },
    citizenEmail: {
        type: String
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        default: 'PENDING'
    },
    remarks: {
        type: String,
        default: ''
    },
    processedBy: {
        type: String,
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
