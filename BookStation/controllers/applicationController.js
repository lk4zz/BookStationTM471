const applicationService = require('../services/applicationService');
const catchAsync = require('../middlewares/catchAsync');

const submitApplication = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    // Extract the new fields from the FormData
    const { penName, writingIntent, agreedToPolicy } = req.body;

    let documentUrl = null;
    if (req.file) {
        documentUrl = req.file.path;
    }

    const application = await applicationService.submitApplication(
        userId,
        penName,
        writingIntent,
        agreedToPolicy,
        documentUrl
    );

    res.status(201).json({
        message: "Application submitted successfully",
        application
    });
});

const getPendingApplications = catchAsync(async (req, res) => {
    const applications = await applicationService.getPendingApplications();

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

const reviewApplication = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await applicationService.reviewApplication(id, status);

    res.status(200).json({
        success: true,
        message: `Application ${status.toLowerCase()}`,
        data: result
    });
});

const getApplicationStatus = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await applicationService.checkApplicationStatus(userId);
  
  res.status(200).json(result);
});

module.exports = {
  submitApplication,
  getPendingApplications,
  reviewApplication,
  getApplicationStatus,
};