const tamanhos = [
  { tamanho: "Único" },
  { tamanho: "PP" },
  { tamanho: "P" },
  { tamanho: "M" },
  { tamanho: "G" },
  { tamanho: "GG" },
  { tamanho: "XG" },
];

const tamanhoUniformeSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_TamanhoUniforme.deleteMany(),
      prisma.ba_TamanhoUniforme.createMany({
        data: tamanhos,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { tamanhoUniformeSeed };
