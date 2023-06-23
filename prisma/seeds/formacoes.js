// const { prisma } = require("services/prisma/prismaClient");

const eixosEFormacoes = [
  {
    nome: "Ambiente e Saúde",
    formacoes: [
      { nome: "Técnico em Agente Comunitário de Saúde" },
      { nome: "Técnico em Análises Clínicas" },
      { nome: "Técnico em Biotecnologia" },
      { nome: "Técnico em Controle Ambiental" },
      { nome: "Técnico em Cuidados de Idosos" },
      { nome: "Técnico em Enfermagem" },
      { nome: "Técnico em Farmácia" },
      { nome: "Técnico em Gerência em Saúde" },
      { nome: "Técnico em Meio Ambiente" },
      { nome: "Técnico em Nutrição e Dietética" },
      { nome: "Técnico em Saúde Bucal" },
    ],
  },
  {
    nome: "Controle e Processos Industriais",
    formacoes: [
      { nome: "Técnico em Eletroeletrônica" },
      { nome: "Técnico em Eletromecânica" },
      { nome: "Técnico em Eletrônica" },
      { nome: "Técnico em Eletrotécnica" },
      { nome: "Técnico em Manutenção Automotiva" },
      { nome: "Técnico em Mecânica" },
      { nome: "Técnico em Mecatrônica" },
      { nome: "Técnico em Refrigeração e Climatização" },
      { nome: "Técnico em Sistemas a Gás" },
      { nome: "Técnico em Sistemas de Energia Renovável" },
    ],
  },
  {
    nome: "Desenvolvimento Educacional e Social",
    formacoes: [{ nome: "Técnico em Secretaria Escolar" }],
  },
  {
    nome: "Gestão e Negócios",
    formacoes: [
      { nome: "Técnico em Administração" },
      { nome: "Técnico em Comércio" },
      { nome: "Técnico em Condomínio" },
      { nome: "Técnico em Contabilidade" },
      { nome: "Técnico em Cooperativismo" },
      { nome: "Técnico em Finanças" },
      { nome: "Técnico em Logística" },
      { nome: "Técnico em Recursos Humanos" },
      { nome: "Técnico em Secretariado" },
      { nome: "Técnico em Serviços Jurídicos" },
      { nome: "Técnico em Serviços Públicos" },
      { nome: "Técnico em Transações Imobiliárias" },
      { nome: "Técnico em Vendas" },
    ],
  },
  {
    nome: "Informação e Comunicação",
    formacoes: [
      { nome: "Técnico em Computação Gráfica" },
      { nome: "Técnico em Informática" },
      { nome: "Técnico em Manutenção e Suporte em Informática" },
      { nome: "Técnico em Programação de Jogos Digitais" },
      { nome: "Técnico em Publicidade" },
      { nome: "Técnico em Redes de Computadores" },
      { nome: "Técnico em Telecomunicações" },
    ],
  },
  {
    nome: "Infraestrutura",
    formacoes: [
      { nome: "Técnico em Agrimensura" },
      { nome: "Técnico em Desenho da Construção Civil" },
      { nome: "Técnico em Edificações" },
    ],
  },
  {
    nome: "Produção Alimentícia",
    formacoes: [
      { nome: "Técnico em Agroindústria" },
      { nome: "Técnico em Alimentos" },
      { nome: "Técnico em Apicultura" },
      { nome: "Técnico em Panificação" },
    ],
  },
  {
    nome: "Produção Cultural e Design",
    formacoes: [
      { nome: "Técnico em Arte Dramática" },
      { nome: "Técnico em Artes Visuais" },
      { nome: "Técnico em Canto" },
      { nome: "Técnico em Comunicação Visual" },
      { nome: "Técnico em Conservação e Restauro" },
      { nome: "Técnico em Design de Móveis" },
      { nome: "Técnico em Documentação Musical" },
      { nome: "Técnico em Instrumento Musical" },
      { nome: "Técnico em Multimídia" },
      { nome: "Técnico em Produção de Moda" },
      { nome: "Técnico em Regência" },
      { nome: "Técnico em Teatro" },
    ],
  },
  {
    nome: "Produção Industrial",
    formacoes: [
      { nome: "Técnico em Açúcar e Álcool" },
      { nome: "Técnico em Análises Químicas" },
      { nome: "Técnico em Biocombustíveis" },
      { nome: "Técnico em Design de Artefatos em Couro" },
      { nome: "Técnico em Petróleo e Gás" },
      { nome: "Técnico em Petroquímica" },
      { nome: "Técnico em Química" },
    ],
  },
  {
    nome: "Recursos Naturais",
    formacoes: [
      { nome: "Técnico em Agricultura" },
      { nome: "Técnico em Agroecologia" },
      { nome: "Técnico em Agronegócio" },
      { nome: "Técnico em Agropecuária" },
      { nome: "Técnico em Fruticultura" },
      { nome: "Técnico em Geologia" },
      { nome: "Técnico em Mineração" },
      { nome: "Técnico em Pesca" },
      { nome: "Técnico em Recursos Pesqueiros" },
      { nome: "Técnico em Zootecnia" },
    ],
  },
  {
    nome: "Segurança",
    formacoes: [{ nome: "Técnico em Segurança do Trabalho" }],
  },
  {
    nome: "Turismo, Hospitalidade e Lazer",
    formacoes: [
      { nome: "Técnico em Cozinha" },
      { nome: "Técnico em Ecoturismo" },
      { nome: "Técnico em Eventos" },
      { nome: "Técnico em Guia de Turismo" },
      { nome: "Técnico em Hospedagem" },
      { nome: "Técnico em Lazer" },
      { nome: "Técnico em Restaurante e Bar" },
    ],
  },
];

const formacoesSeed = async (prisma) => {
  try {
    return prisma.$transaction([
      prisma.ba_Formacao.deleteMany(),
      prisma.ba_Eixo_Formacao.deleteMany(),
      ...new Array().concat(
        ...eixosEFormacoes.map(({ nome: eixo, formacoes }) =>
          formacoes.map(({ nome: formacao }) =>
            prisma.ba_Formacao.create({
              data: {
                nome: formacao,
                eixo: {
                  connectOrCreate: {
                    where: {
                      nome: eixo,
                    },
                    create: {
                      nome: eixo,
                    },
                  },
                },
              },
            })
          )
        )
      ),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { formacoesSeed };
