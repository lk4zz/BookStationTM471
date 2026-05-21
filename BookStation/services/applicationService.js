const prisma = require("../db");
const BadRequestError = require("../errors/BadRequestError");
const notificationsServices = require("../services/notificationsServices");


const submitApplication = async (userId, penName, writingIntent, agreedToPolicy, documentUrl) => {
    // enforce the Policy Agreement
    if (agreedToPolicy !== 'true' && agreedToPolicy !== true) {
        throw new BadRequestError("You must agree to the platform's policies.");
    }
    //check for existing application
    const existingApplication = await prisma.authorApplication.findFirst({
        where: {
            userId: parseInt(userId, 10),
            status: "PENDING",
        },
    });

    if (existingApplication) {
        throw new BadRequestError("You have already submitted an application.");
    }

    //create the application row 
    return await prisma.authorApplication.create({
        data: {
            userId: parseInt(userId, 10),
            penName: penName,
            writingIntent: writingIntent,
            agreedToPolicy: true,
            documentUrl: documentUrl || null,
            status: "PENDING", //state is pending upon creation
        },
    });
};

const getPendingApplications = async () => {
    return await prisma.authorApplication.findMany({
        where: {
            status: "PENDING", //find applications with pending status only for admin viewing
        },
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
    });
};


//security issue the backened isnt checking if the approving user is admin or not
const reviewApplication = async (applicationId, status) => {
    if (status !== "APPROVED" && status !== "REJECTED") {
        throw new BadRequestError("Invalid status provided.");
    }

    const application = await prisma.authorApplication.findUnique({
        where: { id: parseInt(applicationId, 10) },
    });

    if (!application) {
        throw new BadRequestError("Application not found.");
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
        const applicationRecord = await tx.authorApplication.update({
            where: { id: parseInt(applicationId, 10) },
            data: { status: status },
        });

        if (status === "APPROVED") {
            await tx.user.update({
                where: { id: application.userId },
                data: { roleId: 2 },
            });
        }

        return applicationRecord;
    });

    const title = "Author application";
    const message = `Your application to become an author has been ${status.toLowerCase()}.`;
    await notificationsServices.createNotification(application.userId, title, message);

    return updatedApplication;
};

const checkApplicationStatus = async (userId) => {
    const application = await prisma.authorApplication.findFirst({
        where: {
            userId: parseInt(userId, 10),
        },
        select: {
            status: true,
        },
    });
    const status = application ? application.status : "NOT_SUBMITTED";

    return { status };
};

module.exports = {
    submitApplication,
    getPendingApplications,
    reviewApplication,
    checkApplicationStatus
};