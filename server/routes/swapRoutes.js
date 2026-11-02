const express = require('express');
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  createValidators,
  createSwap,
  received,
  sent,
  active,
  accept,
  reject,
  complete
} = require('../controllers/swapController');

const router = express.Router();

router.post('/', protect, requireRole('student'), createValidators, createSwap);
router.get('/received', protect, requireRole('student'), received);
router.get('/sent', protect, requireRole('student'), sent);
router.get('/active', protect, requireRole('student'), active);
router.put('/:id/accept', protect, requireRole('student'), accept);
router.put('/:id/reject', protect, requireRole('student'), reject);
router.put('/:id/complete', protect, requireRole('student'), complete);

module.exports = router;
