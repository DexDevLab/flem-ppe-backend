const pendenciasTipos = [
  {
    label: "Formulários/Fichas de Admissão",
  },
  {
    label:
      "Cartão cidadão - PIS / Declaração Caixa Econômica PIS ativo (cópia)",
  },
  {
    label: "Título de Eleitor (cópia)",
  },
  {
    label: "Currículo atualizado",
  },
  {
    label: "ASO (Atestado de Saúde Ocupacional)",
  },
  {
    label:
      "Cartão de vacina - Dependentes até 05 anos (caso se aplique) (cópia)",
  },
  {
    label: "Contrato de Trabalho FLEM",
  },
  {
    label: "Carteira de Identidade (cópia)",
  },
  {
    label: "C.T.P.S. (Cópia - página de registo n° CTPS e dados pessoais)",
  },
  {
    label: "Último comprovante de votação (cópia)",
  },
  {
    label: "Dados bancários (banco/ agência / conta corrente)",
  },
  {
    label: "Certidão de casamento (caso se aplique) (cópia)",
  },
  {
    label:
      "Comprovante de escolaridade - Dependente até 06 anos (caso se aplique) (cópia)",
  },
  {
    label: "CPF (cópia)",
  },
  {
    label: "Comprovante de residência (cópia)",
  },
  {
    label: "Diploma, Histórico Escolar ou Declaração da Escola (cópia)",
  },
  {
    label: "02 Fotos 3X4",
  },
  {
    label: "Certidão de nascimento dos filhos (caso se aplique) (cópia)",
  },
  {
    label: "Carteira Reservista (caso sexo masculino) (cópia)",
  },
  {
    label:"Vale Alimentação"
  },
  {
    label:"Vale Transporte"
  },
  {
    label:"Plano de Saúde"
  },
];

const pendenciasTiposSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Pendencias_Tipos.deleteMany(),
      prisma.ba_Pendencias_Tipos.createMany({
        data: pendenciasTipos,
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { pendenciasTiposSeed };
