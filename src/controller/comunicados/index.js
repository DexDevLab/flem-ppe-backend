import { getBeneficiarios } from "controller/beneficiarios";
import { getTiposHistorico } from "controller/historicos";
import { createEnvios } from "controller/transactions";
import _ from "lodash";
import { convertDeltaToHtml } from "node-quill-converter";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de comunicados.
 * @method getComunicados
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getComunicados(entity, filter, limit) {
  try {
    const table = `${entity}_Comunicados`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          remetenteComunicado: true,
          benefAssoc: true,
          enviosComunicados: true,
        },
        orderBy: [
          {
            codComunicado: "desc",
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
          remetenteComunicado: true,
          benefAssoc: true,
          enviosComunicados: true,
        },
        orderBy: [
          {
            codComunicado: "desc",
          },
        ],
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um comunicado.
 * @method modifyComunicado
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosComunicado as informações do comunicado:
 *
 * id - ID do comunicado
 *
 * emailRemetente - Remetente do email
 *
 * assunto - Assunto do email
 *
 * conteudoEmail - Conteúdo presente no email do comunicado
 *
 * benefAssoc - Destinatário do comunicado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyComunicado(entity, dadosComunicado) {
  try {
    const { id, emailRemetente, assunto, conteudoEmail, benefAssoc } =
      dadosComunicado;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
    const table = `${entity}_Comunicados`;
    const benefToConnectComunicado = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });
    return prisma[table].update({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          set: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        remetenteComunicado_Id: emailRemetente,
      },
      where: {
        id,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo comunicado.
 * @method addComunicado
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosComunicado as informações do comunicado:
 *
 * emailRemetente - Remetente do email
 *
 * assunto - Assunto do email
 *
 * conteudoEmail - Conteúdo presente no email do comunicado
 *
 * benefAssoc - Destinatário do comunicado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addComunicado(entity, dadosComunicado) {
  try {
    const { emailRemetente, assunto, conteudoEmail, benefAssoc } =
      dadosComunicado;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
    const table = `${entity}_Comunicados`;
    const tableHistorico = `${entity}_Historico`;
    const benefToConnectComunicados = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });

    const query = await prisma[table].create({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          connect: benefToConnectComunicados.map(({ id }) => ({ id })),
        },
        remetenteComunicado_Id: emailRemetente,
      },
    });

    await prisma[tableHistorico].create({
      data: {
        // categoria: "Comunicado",
        descricao: `Criação do comunicado: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicados.map(({ id }) => ({ id })),
        },
        comunicados: {
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
 * Remove um comunicado.
 * @method deleteComunicado
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} id o ID do comunicado
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteComunicado(entity, id) {
  try {
    const table = `${entity}_Comunicados`;
    const tableHistorico = `${entity}_Historico`;
    const comunicadoToConnect = await getComunicados(
      entity,
      {
        id,
      },
      1
    );
    const query = await prisma[table].update({
      data: {
        excluido: true,
        benefAssoc: {
          set: [],
        },
        enviosComunicados: {
          deleteMany: {
            comunicado_Id: id,
          },
        },
      },
      where: {
        id,
      },
    });
    await prisma[tableHistorico].create({
      data: {
        // categoria: "Comunicado",
        descricao: `Exclusão do comunicado: ${query.assunto}`,
        beneficiario: {
          connect: comunicadoToConnect[0].benefAssoc.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: id,
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
 * Fornece a listagem de remetentes.
 * @method getRemetentes
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getRemetentes(entity, filter, limit) {
  try {
    const table = `${entity}_Comunicados_Remetentes`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
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
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: {
            equals: false,
          },
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
 * Adiciona um novo remetente para emails.
 * @method addRemetente
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosRemetente as informações do comunicado:
 *
 * nome - Nome do remetente
 *
 * email - Email do remetente
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addRemetente(entity, dadosRemetente) {
  try {
    const { nome, email } = dadosRemetente;
    const table = `${entity}_Comunicados_Remetentes`;
    const filter = {
      email: email,
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getRemetentes(entity, queryFilter, 1))) {
      const error = new Error("Demandante já existe");
      error.status = 409;
      throw error;
    }
    return await prisma[table].upsert({
      where: {
        email,
      },
      update: {
        nome,
        email,
        excluido: false,
      },
      create: {
        nome,
        email,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um anexo de um comunicado.
 * @method modifyAnexoComunicado
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id o ID do comunicado
 * @param {Object} dadosAnexos as informações do comunicado:
 *
 * anexosId - ID do anexo
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyAnexoComunicado(entity, id, dadosAnexos) {
  try {
    const { anexosId } = dadosAnexos;
    const table = `${entity}_Comunicados`;

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
 * Adiciona um novo comunicado para a Lista de Envios.
 * @method addComunicadoToEnvio
 * @memberof module:comunicados
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosEnvio as informações do envio:
 *
 * id - ID do comunicado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addComunicadoToEnvio(entity, dadosEnvio) {
  try {
    const { id } = dadosEnvio;
    const table = `${entity}_Comunicados_Enviados`;
    const tableHistorico = `${entity}_Historico`;
    const filter = {
      id: id,
    };
    const comunicado = await getComunicados(entity, filter, 1);

    const conteudoEmail = JSON.parse(comunicado[0].conteudoEmail);

    const enviosToCreate = comunicado[0].benefAssoc.map((benef) => {
      const conteudoPopulado = conteudoEmail.ops.map((obj, idx) => {
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
        comunicado_Id: comunicado[0].id,
        conteudoEmail: JSON.stringify({ ops: conteudoPopulado }),
        mailDetails: {
          remetente: comunicado[0].remetenteComunicado,
          contatos: benef.contatos.filter(
            ({ tipoContato_Id }) => tipoContato_Id === "email"
          ),
          assunto: comunicado[0].assunto,
          html: convertDeltaToHtml({ ops: conteudoPopulado }),
          anexosId: comunicado[0].anexosId,
        },
      };
    });

    const query = await createEnvios(entity, enviosToCreate);

    await prisma[tableHistorico].create({
      data: {
        // categoria: "Envio de Comunicado",
        descricao: `Envio do comunicado: ${comunicado[0].assunto}`,
        beneficiario: {
          connect: comunicado[0].benefAssoc.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: comunicado[0].id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Envio de Comunicado" }, 1)
        )[0].id,
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
