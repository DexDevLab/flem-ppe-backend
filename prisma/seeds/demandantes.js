const axios = require("axios");

const demandantesSeed = async (prisma) => {
  const { data: demandantes } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_DEMAND_BA}`
  );
  
  const demandantesLegado = [
    {
      sigla: "CASA MILITAR",
      nome: "Casa Militar do Governo da Bahia",
    },
    {
      sigla: "CEPED",
      nome: "Centro de Pesquisas e Desenvolvimento do Estado da Bahia",
    },
    {
      sigla: "OGE",
      nome: "Ouvidoria Geral do Estado da Bahia",
    },
    {
      sigla: "SSP/SEDE - CAB",
      nome: "Secretaria De Segurança Pública/Sede - CAB",
    },
    {
      sigla: "SSP/STELECOM",
      nome: "Secretaria de Segurança Pública/STELECOM",
    },
  ];

  try {
    return prisma.$transaction([
      prisma.ba_Demandantes.deleteMany(),

      prisma.ba_Demandantes.createMany({
        data: demandantes.map(({ sigla, nome }) => ({ nome, sigla })),
      }),
      prisma.ba_Demandantes.createMany({
        data: demandantesLegado.map(({ sigla, nome }) => ({ nome, sigla })),
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { demandantesSeed };
