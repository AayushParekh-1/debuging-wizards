import express from 'express';
import { verifyServiceJwt } from '../middlewares/verifyServiceJwt.middleware.js';
import {
    processComplaint,
    updateComplaintStatus,
    getCitizenComplaints,
    getAllComplaints,
    getComplaintById
} from '../controllers/complaint.controller.js';

const router = express.Router();

// All internal routes require service JWT verification
router.use(verifyServiceJwt);

// Process new complaint request from Nexus
router.post('/complaints', processComplaint);

// Update complaint status (accept/process from Nexus)
router.post('/update-status', updateComplaintStatus);

// Get citizen's complaints
router.get('/complaints/citizen', getCitizenComplaints);

// Get all complaints
router.get('/complaints', getAllComplaints);

// Get complaint by ID
router.get('/complaints/:id', getComplaintById);

export default router;
