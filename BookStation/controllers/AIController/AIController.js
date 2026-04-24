const AIServices = require("../../services/AIServices/AIChatBotServices")
const catchAsync = require("../../middlewares/catchAsync")

const promptAI = catchAsync(async (req, res) => {
    // Pass the entire body (which has messages + chapterId) AND the userId
    const responseText = await AIServices.PromptAI(req.body, req.user.userId);
    
    res.status(200).json({
        success: true,
        response: responseText
    });
});

module.exports = {
    promptAI
}