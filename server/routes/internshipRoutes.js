const express = require('express');
const router = express.Router();
const { protect, optionalAuth, requireRole } = require('../middleware/authMiddleware');
const {
  getInternships,
  getInternshipById,
  getRecruiterInternships,
  createInternship,
  applyInternship,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus
} = require('../controllers/internshipController');

// Optional auth for browsing internships so guests/new users can see listings
router.get('/', optionalAuth, getInternships);
router.get('/recruiter/mine', protect, requireRole('recruiter'), getRecruiterInternships);
router.get('/:id', optionalAuth, getInternshipById);

router.post('/', protect, requireRole('recruiter'), createInternship);
router.post('/:id/apply', protect, requireRole('student'), applyInternship);

// Applications
router.get('/student/my-applications', protect, requireRole('student'), getMyApplications);
router.get('/recruiter/all-applications', protect, requireRole('recruiter'), getRecruiterApplications);
router.put('/applications/:id/status', protect, requireRole('recruiter'), updateApplicationStatus);

module.exports = router;
