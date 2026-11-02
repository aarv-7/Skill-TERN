const Internship = require('../models/Internship');
const Application = require('../models/Application');
const User = require('../models/User');

// Explainable prototype score from the role's base score, profile readiness,
// listed-skill overlap, and completed platform swaps. This is not an AI model.
function calculateScore(user, internship) {
  let score = internship.baseScore || 80;
  if (!user) return score;

  // Bonus for completed peer swaps (shows proof of collaboration & practice)
  const swapBonus = Math.min(10, (user.completedSwaps || 0) * 2);
  
  // Factor in radar metrics if available
  const radarAvg = user.radarMetrics
    ? (user.radarMetrics.skills + user.radarMetrics.projects + user.radarMetrics.interview) / 3
    : 75;

  const profileSkills = [...(user.skillsToTeach || []), ...(user.skillsToLearn || [])]
    .map((skill) => String(skill?.name || skill).toLowerCase().trim());
  const requiredSkills = internship.requiredSkills || [];
  const skillFit = requiredSkills.length
    ? (requiredSkills.filter((skill) => profileSkills.includes(String(skill).toLowerCase().trim())).length / requiredSkills.length) * 100
    : 0;

  const finalScore = Math.min(99, Math.round(score * 0.3 + radarAvg * 0.4 + skillFit * 0.2 + swapBonus));
  return Math.max(65, finalScore);
}

async function getInternships(req, res, next) {
  try {
    const internships = await Internship.find({ status: 'open' }).populate('postedBy', 'name company');
    
    // Add the deterministic profile-to-role score for signed-in users.
    const user = req.user;
    const data = internships.map((item) => {
      const doc = item.toObject ? item.toObject() : { ...item };
      doc.matchScore = calculateScore(user, doc);
      return doc;
    });

    res.json({ success: true, count: data.length, internships: data });
  } catch (error) {
    next(error);
  }
}

async function getInternshipById(req, res, next) {
  try {
    const internship = await Internship.findById(req.params.id).populate('postedBy', 'name company');
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    const doc = internship.toObject ? internship.toObject() : { ...internship };
    doc.matchScore = calculateScore(req.user, doc);
    res.json({ success: true, internship: doc });
  } catch (error) {
    next(error);
  }
}

async function getRecruiterInternships(req, res, next) {
  try {
    const internships = await Internship.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: internships.length, internships });
  } catch (error) {
    next(error);
  }
}

async function createInternship(req, res, next) {
  try {
    const { title, company, location, type, duration, stipend, requiredSkills, description, requirements } = req.body;

    if (typeof title !== 'string' || !title.trim() || typeof company !== 'string' || !company.trim()) {
      return res.status(400).json({ success: false, message: 'Title and company are required' });
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    const reqsArray = Array.isArray(requirements)
      ? requirements
      : String(requirements || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);

    const internship = await Internship.create({
      title: title.trim().slice(0, 120),
      company: company.trim().slice(0, 120) || req.user.company || 'Tech Recruiter',
      location: location || 'Remote',
      type: type || 'Internship',
      duration: duration || '3 Months',
      stipend: stipend || '₹15,000 - ₹25,000 / month',
      requiredSkills: skillsArray,
      description: description || '',
      requirements: reqsArray,
      postedBy: req.user._id,
      baseScore: 85,
      status: 'open',
      applicantsCount: 0
    });

    res.status(201).json({ success: true, message: 'Internship posted successfully', internship });
  } catch (error) {
    next(error);
  }
}

async function applyInternship(req, res, next) {
  try {
    const internshipId = req.params.id;
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    if (internship.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This internship is no longer accepting applications' });
    }

    const existing = await Application.findOne({
      internship: internshipId,
      applicant: req.user._id
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
    }

    const profileFitScore = calculateScore(req.user, internship);

    const application = await Application.create({
      internship: internshipId,
      applicant: req.user._id,
      status: 'applied',
      profileFitScore,
      verifiedSwaps: req.user.completedSwaps || 0,
      coverLetter: req.body.coverLetter || ''
    });

    // Increment applicantsCount
    internship.applicantsCount = (internship.applicantsCount || 0) + 1;
    await internship.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Your readiness score and completed swaps were included.',
      application
    });
  } catch (error) {
    next(error);
  }
}

async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('internship')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
}

async function getRecruiterApplications(req, res, next) {
  try {
    const ownedInternships = await Internship.find({ postedBy: req.user._id }).select('_id');
    const applications = await Application.find({ internship: { $in: ownedInternships.map((item) => item._id) } })
      .populate('internship')
      .populate('applicant', 'name email erpId profileImage bio rating completedSwaps credits radarMetrics location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const internship = await Internship.findById(application.internship);
    if (!internship || String(internship.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only update applications for your own listings' });
    }
    const validStatuses = ['reviewing', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Choose a valid application status' });
    }
    if (notes !== undefined && (typeof notes !== 'string' || notes.length > 1000)) {
      return res.status(400).json({ success: false, message: 'Notes must be 1000 characters or less' });
    }
    application.status = status;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    res.json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInternships,
  getInternshipById,
  getRecruiterInternships,
  createInternship,
  applyInternship,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus
};
