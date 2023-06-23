const tiposSituacoes = [
  { nome: "A Contratar" },
  { nome: "Contratado" },
  { nome: "Desistente" },
  { nome: "Desligado" },
  { nome: "Pendente" },
  { nome: "Transferido" },
];

const situacoes = [
  { nome: "Realizar Contato", situacao: "A Contratar" },
  { nome: "Ativo", situacao: "Contratado" },
  { nome: "Desligado", situacao: "Desligado" },
  { nome: "Não tem interesse", situacao: "Desistente" },
  { nome: "Pendente", situacao: "Pendente" },
];

const situacoesVagaSeed = async (prisma) => {
  try {
    return prisma.$transaction(async (prisma) => {
      await prisma.ba_Situacoes_Vaga.deleteMany();
      await prisma.ba_Tipos_Situacoes_Vaga.deleteMany();
      await prisma.ba_Tipos_Situacoes_Vaga.createMany({
        data: tiposSituacoes,
      });

      const tiposFromBd = await prisma.ba_Tipos_Situacoes_Vaga.findMany();

      return prisma.ba_Situacoes_Vaga.createMany({
        data: situacoes.map(({ situacao, ...rest }) => ({
          ...rest,
          tipoSituacao_Id: tiposFromBd.find(({ nome }) => nome === situacao).id,
        })),
      });
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { situacoesVagaSeed };
