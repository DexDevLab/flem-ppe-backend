const tiposHistorico = [
  { nome: "Ação CR" },
  { nome: "Acompanhamento Médico", sigiloso: true },
  { nome: "Comunicado" },
  { nome: "Documento" },
  { nome: "Documento Sigiloso", sigiloso: true },
  { nome: "Entrega de Material" },
  { nome: "Envio de Comunicado" },
  { nome: "Evento" },
  { nome: "Ofício" },
  { nome: "Vaga" },
  { nome: "Situação da Vaga" },
];
const tipoHistoricoSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Historico_Tipo.deleteMany(),
      prisma.ba_Historico_Tipo.createMany({
        data: tiposHistorico,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { tipoHistoricoSeed };
