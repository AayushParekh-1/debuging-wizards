import Complaint from '../models/Complaint.model.js';

// Process complaint request from Nexus Gateway
export const processComplaint = async (req, res) => {
    try {
        const { requestId, citizenId, citizenName, citizenEmail, data } = req.body;

        // Create complaint in Urban database
        const complaint = new Complaint({
            nexusRequestId: requestId,
            citizenId,
            citizenName,
            citizenEmail,
            state: data.state,
            city: data.city,
            area: data.area,
            address: data.address,
            complaint: data.complaint,
            status: 'PENDING'
        });

        await complaint.save();

        // Return PENDING status to Nexus
        res.json({
            success: true,
            status: 'PENDING',
            remarks: 'Your complaint has been received and is pending review by our urban services team.',
            responseData: {
                complaintId: complaint._id,
                state: complaint.state,
                city: complaint.city,
                area: complaint.area,
                status: complaint.status
            }
        });
    } catch (error) {
        console.error('Process complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process complaint request.'
        });
    }
};

// Update complaint status (called by Nexus when officer accepts/processes)
export const updateComplaintStatus = async (req, res) => {
    try {
        const { requestId, status, remarks, processedBy } = req.body;

        const complaint = await Complaint.findOne({ nexusRequestId: requestId });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        complaint.status = status;
        complaint.remarks = remarks || '';
        complaint.processedBy = processedBy;
        complaint.processedAt = new Date();

        await complaint.save();

        res.json({
            success: true,
            message: 'Complaint status updated.',
            data: complaint
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update complaint status.'
        });
    }
};

// Get citizen's complaints
export const getCitizenComplaints = async (req, res) => {
    try {
        const citizenId = req.headers['x-citizen-id'] || req.query.citizenId;

        const complaints = await Complaint.find({ citizenId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: complaints
        });
    } catch (error) {
        console.error('Get citizen complaints error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints.'
        });
    }
};

// Get all complaints (for department officers)
export const getAllComplaints = async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        const filter = status ? { status } : {};

        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: complaints
        });
    } catch (error) {
        console.error('Get all complaints error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints.'
        });
    }
};

// Get complaint by ID
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        res.json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error('Get complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaint.'
        });
    }
};
