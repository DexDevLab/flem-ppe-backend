const etnias = [
  { etnia: "Não Informada" },
  { etnia: "Amarela" },
  { etnia: "Branca" },
  { etnia: "Indígena" },
  { etnia: "Parda" },
  { etnia: "Preta" },
];

const etniaSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Etnia.deleteMany(),
      prisma.ba_Etnia.createMany({
        data: etnias,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {etniaSeed};
