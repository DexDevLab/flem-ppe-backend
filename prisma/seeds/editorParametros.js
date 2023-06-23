const parametros = [
  {
    rotulo: "Nome do Beneficiário",
    nomeTabela: "ba_Beneficiario",
    nomeColuna: "nome",
  },
  {
    rotulo: "Formação do Beneficiário",
    nomeTabela: "ba_Beneficiario",
    nomeColuna: "formacao_Id",
  },
  {
    rotulo: "Código do Ofício",
    nomeTabela: "ba_Oficios",
    nomeColuna: "codOficio",
  },
  {
    rotulo: "Unidade de Lotação",
    nomeTabela: "ba_Unidade_Lotacao",
    nomeColuna: "nome",
  },
  {
    rotulo: "Logradouro da Unidade de Lotação",
    nomeTabela: "ba_Unidade_Lotacao",
    nomeColuna: "logradouro",
  },
  {
    rotulo: "Bairro Unidade de Lotação",
    nomeTabela: "ba_Unidade_Lotacao",
    nomeColuna: "bairro",
  },
  {
    rotulo: "Ponto Focal da Unidade de Lotação",
    nomeTabela: "ba_Unidade_Lotacao_Ponto_Focal",
    nomeColuna: "nome",
  },
  {
    rotulo: "Município da Vaga",
    nomeTabela: "ba_Vaga",
    nomeColuna: "municipio_Id",
  },
  {
    rotulo: "Demandante",
    nomeTabela: "ba_Demandantes",
    nomeColuna: "nome",
  },
  {
    rotulo: "Sigla do Demandante",
    nomeTabela: "ba_Demandantes",
    nomeColuna: "sigla",
  },
];

const editorParametrosSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Editor_Parametros.deleteMany(),
      prisma.ba_Editor_Parametros.createMany({
        data: parametros,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { editorParametrosSeed };
