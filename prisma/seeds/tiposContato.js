const tipos = [
  {
    id: "celular",
    nome: "Celular",
  },  {
    id: "telefone",
    nome: "Telefone",
  },  {
    id: "email",
    nome: "E-mail",
  },
];

const tiposContatoSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Contatos_Tipos.deleteMany(),
      prisma.ba_Contatos_Tipos.createMany({
        data: tipos,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { tiposContatoSeed };
