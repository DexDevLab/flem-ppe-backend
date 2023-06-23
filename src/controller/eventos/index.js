import { getBeneficiarios } from "controller/beneficiarios";
import { getTiposHistorico } from "controller/historicos";
import _ from "lodash";
import { DateTime } from "luxon";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de Eventos.
 * @method getEventos
 * @memberof module:eventos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getEventos(entity, filter, limit) {
  try {
    const table = `${entity}_Eventos`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          localEvento: true,
          tipoEvento: true,
          benefAssoc: true,
          acao_Cr: {
            include: {
              colabCr: true,
            },
          },
          comunicado: true,
        },
      });
    } else {
      return prisma[table].findMany({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: {
            equals: false,
          },
        },
        include: {
          localEvento: true,
          tipoEvento: true,
          benefAssoc: true,
          acao_Cr: {
            include: {
              colabCr: true,
            },
          },
          comunicado: true,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo Evento à lista de Eventos.
 * @method addEvento
 * @memberof module:eventos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosEvento detalhes do Evento, necessários
 * para sua inclusão:
 *
 * nome - nome do evento
 *
 * modalidade - modalidade do evento (se presencial ou remoto)
 *
 * data - data do evento
 *
 * local - local do evento
 *
 * tipo - tipo de evento
 *
 * benefAssoc - lista de beneficiários associados/convidados para o evento
 *
 * criarAcaoCR - booleano se deve ser criada uma Ação à CR para o evento
 *
 * colabAcaoCR - colaboradores da CR que atuarão na Ação CR
 *
 * emailAlerts - booleano se deve haver envio de email sobre o evento
 *
 * emailRemetente - remetente do email
 *
 * conteudoEmail - texto de conteúdo do email
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addEvento(entity, dadosEvento) {
  try {
    const {
      nome,
      modalidade,
      data,
      local,
      tipo,
      benefAssoc,
      criarAcaoCR,
      colabAcaoCR,
      emailAlerts,
      emailRemetente,
      conteudoEmail = null,
    } = dadosEvento;

    const benefMatriculas = benefAssoc
      .filter(({ value }) => value)
      .map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc
      .filter(({ value }) => value)
      .map((benef) => benef.value.toString());
    const parsedConteudoEmail = JSON.stringify(conteudoEmail);

    const table = `${entity}_Eventos`;

    const benefToConnectAcao = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const query = await prisma[table].create({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),
        local_EventoId: local,
        tipo_eventoId: tipo,
        benefAssoc: {
          connect: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_Cr: criarAcaoCR
          ? {
              create: {
                nome,
                descricao:
                  "Ação gerada automaticamente na criação do evento " + nome,
                benefAssoc: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                colabCr: {
                  connect: colabAcaoCR.map(({ value }) => ({ id: value })),
                },
              },
            }
          : {},
        comunicado: emailAlerts
          ? {
              create: {
                assunto: `PPE - Novo Evento: ${nome}`,
                conteudoEmail: parsedConteudoEmail,
                remetenteComunicado: {
                  connect: {
                    id: emailRemetente,
                  },
                },
                benefAssoc: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
              },
            }
          : {},
      },
      include: {
        acao_Cr: true,
        comunicado: true,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e);
  }
}

/**
 * Altera dados de Evento de um Evento no BD.
 * @method modifyEvento
 * @memberof module:eventos
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosEvento detalhes e informações adicionais sobre o Evento:
 *
 * id - o ID do Evento a ser alterado
 *
 * nome - Nome do Evento
 *
 * modalidade - Se o Evento é presencial ou remoto
 *
 * data - A data do Evento
 *
 * local - O local do Evento
 *
 * tipo - O Tipo de Evento (Seminário de Acolhimento, Oficina, Seminário etc)
 *
 * benefAssoc - Listagem de Beneficiários associados a este Evento
 *
 * acao_CrId - O ID da Ação relacionada a esse Evento
 *
 * criarAcaoCR - Se TRUE, cria uma Ação para a Central de Relacionamento, contendo
 * os dados pertinentes ao Evento
 *
 * colabAcaoCR - Colaboradores vinculados à Ação criada para atender ao Evento
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyEvento(entity, dadosEvento) {
  const {
    id,
    nome,
    modalidade,
    data,
    local,
    tipo,
    benefAssoc,
    acao_CrId,
    criarAcaoCR,
    colabAcaoCR = [],
    emailAlerts,
    comunicado_Id,
    emailRemetente,
    conteudoEmail = null,
  } = dadosEvento;

  const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc.map((benef) => benef.cpf?.toString());
  const colabMatriculas = colabAcaoCR.map((colab) => colab.value);

  try {
    const table = `${entity}_Eventos`;
    const tableAcoesCr = `${entity}_Acoes_Cr`;
    const tableComunicados = `${entity}_Comunicados`;

    const benefToConnectAcao = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const getAcaoCr = async () => {
      if (criarAcaoCR) {
        return await prisma[tableAcoesCr].upsert({
          where: {
            id: acao_CrId === undefined ? "" : acao_CrId,
          },
          update: {
            nome,
            descricao:
              "Ação gerada automaticamente na modificação do evento " + nome,
            benefAssoc: {
              set: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              set: colabMatriculas.map((value) => ({ id: value })),
            },
            historico: {
              create: {
                // categoria: "Ação CR",
                descricao:
                  "Atualização de ação em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                tipoHistorico_Id: (
                  await getTiposHistorico(entity, { nome: "Ação CR" }, 1)
                )[0].id,
              },
            },
            excluido: false,
          },
          create: {
            nome,
            descricao:
              "Ação gerada automaticamente na modificação do evento " + nome,
            benefAssoc: {
              connect: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              connect: colabMatriculas.map((value) => ({
                id: value,
              })),
            },
            historico: {
              create: {
                // categoria: "Ação CR",
                descricao:
                  "Criação de ação em função da modificação do evento: " + nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                tipoHistorico_Id: (
                  await getTiposHistorico(entity, { nome: "Ação CR" }, 1)
                )[0].id,
              },
            },
          },
        });
      } else if (acao_CrId !== undefined) {
        return prisma[tableAcoesCr].update({
          data: {
            excluido: true,
          },
          where: {
            id: acao_CrId,
          },
        });
      } else {
        return null;
      }
    };

    const getComunicado = async () => {
      if (emailAlerts) {
        return prisma[tableComunicados].upsert({
          where: {
            id: comunicado_Id === undefined ? "" : comunicado_Id,
          },
          update: {
            assunto: nome,
            remetenteComunicado: {
              connect: {
                id: emailRemetente,
              },
            },
            benefAssoc: {
              set: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            conteudoEmail: JSON.stringify(conteudoEmail),
            excluido: false,
            historico: {
              create: {
                // categoria: "Comunicado",
                descricao:
                  "Atualização de comunicado em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                tipoHistorico_Id: (
                  await getTiposHistorico(entity, { nome: "Comunicado" }, 1)
                )[0].id,
              },
            },
          },
          create: {
            assunto: nome,
            benefAssoc: {
              connect: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            remetenteComunicado: {
              connect: {
                id: emailRemetente,
              },
            },
            conteudoEmail: JSON.stringify(conteudoEmail),
            historico: {
              create: {
                // categoria: "Comunicado",
                descricao:
                  "Criação de comunicado em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },

                tipoHistorico_Id: (
                  await getTiposHistorico(entity, { nome: "Comunicado" }, 1)
                )[0].id,
              },
            },
          },
        });
      } else if (comunicado_Id !== undefined) {
        return prisma[tableComunicados].update({
          data: {
            excluido: true,
          },
          where: {
            id: comunicado_Id,
          },
        });
      } else {
        return null;
      }
    };

    const acaoCr = await getAcaoCr();
    const comunicado = await getComunicado();

    const query = await prisma[table].update({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),

        tipo_eventoId: tipo,
        local_EventoId: local || null,
        benefAssoc: {
          set: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_Cr: {
          set: acaoCr ? [{ id: acaoCr.id }] : [],
        },
        comunicado: {
          set: comunicado ? [{ id: comunicado.id }] : [],
        },
      },
      where: {
        id,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Remove um Evento do BD.
 * @method deleteEvento
 * @memberof module:eventos
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID do Evento a ser excluído
 * @returns objeto contendo o resultado da query
 */
export async function deleteEvento(entity, id) {
  try {
    const table = `${entity}_Eventos`;
    const tableHistorico = `${entity}_Historico`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
      },
      include: {
        benefAssoc: true,
      },
      where: {
        id,
      },
    });

    await prisma[tableHistorico].create({
      data: {
        descricao: `Exclusão do evento: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        eventos: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Comunicado" }, 1)
        )[0].id,
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de locais de evento.
 * @method getLocaisEventos
 * @memberof module:eventos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getLocaisEventos(entity, filter, limit) {
  try {
    const table = `${entity}_Locais_Eventos`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          ...queryComposer(filter),
        },
      });
    } else {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          excluido: {
            equals: false,
          },
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Cria um Local de Evento
 * @method addLocalEvento
 * @memberof module:eventos
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosEvento detalhes e informações adicionais sobre o local:
 *
 * nome - Nome do Local
 *
 * cep - CEP do local
 *
 * logradouro - identificação do logradouro (rua com número) do local do Evento
 *
 * complemento - dados adicionais do endereço do local do Evento
 *
 * bairro - bairro do endereço do local do Evento
 *
 * cidade - cidade do endereço do local do Evento
 *
 * uf - UF do local do Evento
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addLocalEvento(entity, dadosEvento) {
  try {
    const { nome, cep, logradouro, complemento, bairro, cidade, uf } =
      dadosEvento;
    const table = `${entity}_Locais_Eventos`;
    const query = prisma[table].upsert({
      create: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
      },
      update: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        excluido: false,
      },
      where: {
        nome,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de Tipos de Eventos.
 * @method getTiposEventos
 * @memberof module:eventos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getTiposEventos(entity, filter, limit) {
  try {
    const table = `${entity}_Tipos_Eventos`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        orderBy: [
          {
            nome: "asc",
          },
        ],
      });
    } else {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: false,
        },
        orderBy: [
          {
            nome: "asc",
          },
        ],
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um Tipo de Evento ao BD.
 * @method addTipoEvento
 * @memberof module:eventos
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} nome o nome dado ao Tipo de Evento
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addTipoEvento(entity, nome) {
  try {
    const table = `${entity}_Tipos_Eventos`;
    const query = prisma[table].upsert({
      create: {
        nome,
      },
      update: {
        nome,
      },
      where: {
        nome,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Marca presença de um beneficiário a um determinado evento.
 * @method addPresencaBenefEvento
 * @memberof module:eventos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosEvento detalhes do evento.
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addPresencaBenefEvento(entity, dadosEvento) {
  try {
    const table = `${entity}_Eventos_Lista_Presenca`;
    const { benefAssoc, eventoId } = dadosEvento;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());

    const benefToConnectPresenca = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const query = await prisma[table].createMany({
      data: benefToConnectPresenca.map(({ id }) => ({
        benefAssocId: id,
      })),
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
