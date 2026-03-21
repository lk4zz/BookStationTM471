await prisma.role.create({
  data: {
    id: 1,
    name: "USER",
  },
});