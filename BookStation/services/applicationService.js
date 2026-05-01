const prisma = require("../db");
const BadRequestError = require("../errors/BadRequestError");

const submitApplication = async (userId, penName, writingIntent, agreedToPolicy, documentUrl) => {
    // 1. Enforce the Policy Agreement
    if (agreedToPolicy !== 'true' && agreedToPolicy !== true) {
        throw new BadRequestError("You must agree to the platform's policies.");
    }
    const existingApplication = await prisma.authorApplication.findFirst({
        where: {
            userId: parseInt(userId, 10),
            status: "PENDING",
        },
    });

    if (existingApplication) {
        throw new BadRequestError("You have already submitted an application.");
    }


    return await prisma.authorApplication.create({
        data: {
            userId: parseInt(userId, 10),
            penName: penName,
            writingIntent: writingIntent,
            agreedToPolicy: true, 
            documentUrl: documentUrl || null, 
            status: "PENDING",
        },
    });
};

const getPendingApplications = async () => {
    return await prisma.authorApplication.findMany({
        where: {
            status: "PENDING",
        },
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
    });
};

const reviewApplication = async (applicationId, status) => {
    if (status !== "APPROVED" && status !== "REJECTED") {
        throw new BadRequestError("Invalid status provided.");
    }

    return await prisma.$transaction(async (tx) => {
        const application = await tx.authorApplication.update({
            where: { id: parseInt(applicationId, 10) },
            data: { status: status },
        });

        let assignedRoleId = 1;

        if (status === "APPROVED") {
            assignedRoleId = 2;
        }

        if (status === "APPROVED") {
            await tx.user.update({
                where: { id: application.userId },
                data: { roleId: assignedRoleId },
            });
        }

        return application;
    });
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