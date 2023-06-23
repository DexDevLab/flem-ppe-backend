import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de situações de vaga.
 * @method getSituacoesVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getSituacoesVaga(entity, filter, limit) {
  try {
    const table = `${entity}_Situacoes_Vaga`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          tipoSituacao: true,
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
        include: {
          tipoSituacaoVaga: true,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona uma nova situação de vaga
 * @method addSituacaoVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosSituacao detalhes da situação de vaga:
 *
 *  situacao - nome da situação
 *
 *  tipo - tipo da situação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addSituacaoVaga(entity, situacao, tipo) {
  try {
    const table = `${entity}_Situacoes_Vaga`;
    if (
      (await prisma[table].findFirst({
        where: {
          nome: situacao,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error("Situação já existe");
      error.status = 409;
      throw error;
    }
    return prisma[table].upsert({
      create: {
        nome: situacao,
        tipoSituacao_Id: tipo,
      },
      update: {
        excluido: false,
        nome: situacao,
        tipoSituacao_Id: tipo,
      },
      where: {
        nome: situacao,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Altera uma Situação de Vaga no BD.
 * @method modifySituacaoVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} situacao o novo nome da Situação da Vaga
 * @param {Object} tipo o novo tipo de Situação
 * @param {Object} id o ID da Situação da Vaga a ser modificada
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifySituacaoVaga(entity, dadosSituacao) {
  try {
    const table = `${entity}_Situacoes_Vaga`;
    const { situacao, tipo, id } = dadosSituacao;
    const query = await prisma[table].update({
      data: {
        nome: situacao,
        tipoSituacao_Id: tipo,
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
 * Remove uma Situação de Vaga do BD.
 * @method deleteSituacaoVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID da Situação da Vaga a ser removida
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteSituacaoVaga(entity, id) {
  try {
    const table = `${entity}_Situacoes_Vaga`;
    const query = await prisma[table].update({
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
 * Fornece a listagem de tipos de situação de vaga.
 * @method getTiposSituacaoVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getTiposSituacaoVaga(entity, filter, limit) {
  try {
    const table = `${entity}_Tipos_Situacoes_Vaga`;
    if (!_.isEmpty(filter)) {
      const query = await prisma[table].findMany({
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
      return query;
    } else {
      const query = await prisma[table].findMany({
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
      return query;
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo tipo de situação de vaga
 * @method addSituacaoVaga
 * @memberof module:situacoes-vaga
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} nome é o nome do tipo de situação de vaga
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addTipoSituacaoVaga(entity, nome) {
  try {
    const table = `${entity}_Tipos_Situacoes_Vaga`;
    return prisma[table].create({
      data: {
        nome,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
