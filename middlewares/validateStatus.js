

const validateStatus = (req, res, next) => {

    const { requestedStatus } = req.body;
    const validStatuses = ['ONGOING', 'COMPLETED', 'DRAFT'];
    if (!validStatuses.includes(requestedStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Must be 'DRAFT', 'ONGOING' or 'COMPLETED'."
        });
    }

next();
};

module.exports = validateStatus;