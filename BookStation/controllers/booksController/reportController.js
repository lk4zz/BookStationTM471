// controllers/reportController.js
const reportService = require("../../services/booksServices/reportServices");
const catchAsync = require("../../middlewares/catchAsync");

//report any book
const submitReport = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const { reason, ReportReason, comment } = req.body;
  const userId = req.user.userId; 

    await reportService.createReport(
      userId, 
      parseInt(bookId, 10), 
      reason ?? ReportReason, //if there is a reason included add it
      comment
    );

    res.status(201).json({
      success: true,
      message: "Report submitted successfully."
    });

});

//get reports details for admins
const getBookReportDetails = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  
  const summaryData = await reportService.getAdminReportSummary(parseInt(bookId, 10));

  res.status(200).json({
    success: true,
    data: summaryData
  });
});

module.exports = {
  submitReport,
  getBookReportDetails
};