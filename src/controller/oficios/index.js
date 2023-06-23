import { getBeneficiarios } from "controller/beneficiarios";
import { getTiposHistorico } from "controller/historicos";
import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { maskCapitalize } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de templates de ofício.
 * @method getOficioTemplates
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getOficioTemplates(entity, filter, limit) {
  try {
    const table = `${entity}_Oficio_Template`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          tipo: true,
        },
      });
    } else {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: false,
        },
        include: {
          tipo: true,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um Template de Ofício ao BD.
 * @method addOficioTemplate
 * @memberof module:oficios
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosTemplate informações do Template, necessárias para sua criação:
 *
 * titulo - Título do Template
 *
 * descricao - Descrição do Template
 *
 * conteudo - Conteúdo (corpo) do Template
 *
 * tipo - Tipo de Template de Ofício
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addOficioTemplate(entity, dadosTemplate) {
  try {
    const { titulo, descricao, conteudo, tipo } = dadosTemplate;
    const table = `${entity}_Oficio_Template`;
    const query = prisma[table].upsert({
      create: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
      },
      update: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
        excluido: false,
      },
      where: {
        titulo,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Altera um Template de Ofício do BD.
 * @method modifyOficioTemplate
 * @memberof module:oficios
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosTemplate informações do Template, necessárias para sua criação:
 * titulo - Título do Template
 * descricao - Descrição do Template
 * conteudo - Conteúdo (corpo) do Template
 * tipo - Tipo de Template de Ofício
 * id - ID do Template de Ofício
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function modifyOficioTemplate(entity, dadosTemplate) {
  try {
    const { titulo, descricao, conteudo, tipo, id } = dadosTemplate;
    const table = `${entity}_Oficio_Template`;
    const query = prisma[table].update({
      data: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
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
 * Remove um Template de Ofício do BD.
 * @method deleteOficioTemplate
 * @memberof module:oficios
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id do Template de Ofício a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function deleteOficioTemplate(entity, id) {
  try {
    const table = `${entity}_Oficio_Template`;
    const query = prisma[table].update({
      data: {
        excluido: true,
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
 * Fornece a listagem de Tipos de Ofício.
 * @method getOficioTipo
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function getOficioTipo(entity) {
  try {
    const table = `${entity}_Oficio_Tipo`;
    return prisma[table].findMany();
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um Tipo de Ofício ao BD.
 * @method addOficioTipo
 * @memberof module:oficios
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} sigla a sigla do Tipo de Ofício. Como padrão, é uma sigla de dois caracteres
 * @param {Object} descricao a descrição do Tipo de Ofício
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addOficioTipo(entity, dadosTipoOficio) {
  try {
    const table = `${entity}_Oficio_Tipo`;
    const { sigla, descricao } = dadosTipoOficio;
    const query = prisma[table].create({
      data: {
        sigla,
        descricao,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de ofícios.
 * @method getOficios
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getOficios(entity, filter, limit) {
  try {
    const table = `${entity}_Oficios`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          remetenteOficio: true,
          benefAssoc: true,
          enviosOficios: true,
          templateOficio: true,
        },
        orderBy: [
          {
            assunto: "asc",
          },
        ],
      });
    } else {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: false,
        },
        include: {
          remetenteOficio: true,
          benefAssoc: true,
          enviosOficios: true,
          templateOficio: true,
        },
        orderBy: [
          {
            assunto: "asc",
          },
        ],
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo ofício à lista de ofícios.
 * @method addOficio
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosOficio detalhes do ofício:
 *
 *  templateOficio - nome do template de ofício
 *
 *  emailRemetente - remetente do email do ofício
 *
 *  conteudoEmail - conteúdo do email do ofício
 *
 *  benefAssoc - beneficiários associados ao ofício
 *
 *  assunto - assunto do ofício
 *
 *  anexos - lista de anexos relacionados ao ofício
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addOficio(entity, dadosOficio) {
  try {
    const {
      templateOficio,
      emailRemetente,
      conteudoEmail,
      benefAssoc,
      assunto,
      anexos = [],
    } = dadosOficio;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
    const table = `${entity}_Oficios`;

    const benefToConnectOficio = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const query = await prisma[table].create({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          connect: benefToConnectOficio.map(({ id }) => ({ id })),
        },
        anexosId: anexos.length === 0 ? null : JSON.stringify(anexos),
        remetenteOficio_Id: emailRemetente,
        templateOficio_Id: templateOficio,
      },
    });

    const tableHistorico = `${entity}_Historico`;
    await prisma[tableHistorico].create({
      data: {
        // categoria: "Ofício",
        descricao: `Criação do ofício: ${assunto}`,
        beneficiario: {
          connect: benefToConnectOficio.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Ofício" }, 1)
        )[0].id,
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um anexo de um ofício.
 * @method modifyAnexosInOficio
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id o ID do ofício
 * @param {Object} dadosOficio detalhes do ofício:
 *
 *  anexosId - ID do anexo
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyAnexosInOficio(entity, id, dadosOficio) {
  try {
    const { anexosId } = dadosOficio;
    const table = `${entity}_Oficios`;
    const tableUploads = `${entity}_Uploads`;

    await prisma[tableUploads].updateMany({
      data: {
        excluido: true,
      },
      where: {
        AND: {
          referencesTo: id,
          id: {
            notIn: anexosId.map(({ id }) => id),
          },
        },
      },
    });

    const query = await prisma[table].update({
      data: {
        anexosId: anexosId.length === 0 ? null : JSON.stringify(anexosId),
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
 * Modifica um ofício da lista de ofícios.
 * @method modifyOficio
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id ID do ofício
 * @param {Object} dadosOficio detalhes do ofício:
 *
 *  templateOficio - nome do template de ofício
 *
 *  emailRemetente - remetente do email do ofício
 *
 *  conteudoEmail - conteúdo do email do ofício
 *
 *  benefAssoc - beneficiários associados ao ofício
 *
 *  assunto - assunto do ofício
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyOficio(entity, id, dadosOficio) {
  try {
    const {
      templateOficio,
      emailRemetente,
      assunto,
      conteudoEmail,
      benefAssoc = [],
    } = dadosOficio;
    const benefMatriculas = benefAssoc
      .filter(({ value }) => value)
      .map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc
      .filter(({ value }) => value)
      .map((benef) => benef?.value?.toString());

    const table = `${entity}_Oficios`;
    const tableHistorico = `${entity}_Historico`;

    const benefToConnectComunicado = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const query = await prisma[table].update({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          set: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        remetenteOficio_Id: emailRemetente,
        templateOficio_Id: templateOficio,
      },
      where: {
        id,
      },
    });

    await prisma[tableHistorico].create({
      data: {
        // categoria: "Ofício",
        descricao: `Modificação do ofício: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Ofício" }, 1)
        )[0].id,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Remove um Template de Ofício do BD.
 * @method deleteOficio
 * @memberof module:oficios
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id do Template de Ofício a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteOficio(entity, dadosOficio) {
  try {
    const { id, assunto, benefAssoc } = JSON.parse(dadosOficio);
    const table = `${entity}_Oficios`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
        benefAssoc: {
          set: [],
        },
        enviosOficios: {
          deleteMany: {
            oficio_Id: id,
          },
        },
      },
      where: {
        id,
      },
    });

    const tableHistorico = `${entity}_Historico`;
    await prisma[tableHistorico].create({
      data: {
        // categoria: "Ofício",
        descricao: `Exclusão do ofício: ${assunto}`,
        beneficiario: {
          connect: benefAssoc.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Ofício" }, 1)
        )[0].id,
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo ofício à lista de ofícios para envio.
 * @method addOficioToEnvio
 * @memberof module:oficios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosOficio detalhes do ofício:
 *
 *  id - do Ofício a ser enviado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addOficioToEnvio(entity, dadosOficio) {
  try {
    const { id } = dadosOficio;
    const table = `${entity}_Oficios_Enviados`;

    const getOficio = await getOficios(
      entity,
      {
        id,
      },
      1
    );

    const conteudoEmail = JSON.parse(getOficio[0].conteudoEmail);
    const conteudoTemplate = JSON.parse(getOficio[0].templateOficio.conteudo);

    const enviosToCreate = getOficio[0].benefAssoc.map((benef) => {
      const conteudoEmailPopulado = conteudoEmail.ops.map((obj, idx) => {
        if (obj.insert.mention) {
          switch (obj.insert.mention.id) {
            case "nome_beneficiario":
              obj.insert.mention.denotationChar = "";
              obj.insert.mention.value = maskCapitalize(benef.nome);
              break;
          }
          return obj;
        } else {
          return obj;
        }
      });
      const conteudoOficioPopulado = conteudoTemplate.ops.map((obj, idx) => {
        if (obj.insert.mention) {
          switch (obj.insert.mention.id) {
            case "nome_beneficiario":
              obj.insert.mention.denotationChar = "";
              obj.insert.mention.value = maskCapitalize(benef.nome);
              break;
          }
          return obj;
        } else {
          return obj;
        }
      });

      return {
        beneficiario_Id: benef.id,
        oficio_Id: getOficio[0].id,
        conteudoEmail: JSON.stringify({ ops: conteudoEmailPopulado }),
        conteudoOficio: JSON.stringify({ ops: conteudoOficioPopulado }),
      };
    });

    const query = await prisma[table].createMany({
      data: enviosToCreate,
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
