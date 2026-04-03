const AIServices = require("../services/AIServices")
const catchAsync = require("../middlewares/catchAsync")



const promptAI = catchAsync(async (req, res) => {
    const prompt = req.body;
    const result = await AIServices.PromptAI(prompt);

    res.status(200).json({text : result})

})

module.exports = {
    promptAI
}