import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de formações.
 * @method getFormacao
 * @memberof module:formacoes
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getFormacao(entity, filter, limit) {
  try {
    const table = `${entity}_Formacao`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        select: {
          id: true,
          nome: true,
          eixo: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
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
        select: {
          id: true,
          nome: true,
          eixo: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
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
 * Adiciona uma Formação ao BD.
 * @method addFormacao
 * @memberof module:formacoes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} formacao o nome do Curso de Formação
 * @param {Object} eixo o Eixo de Formação ao qual o curso pertence
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addFormacao(entity, dadosFormacao) {
  try {
    const table = `${entity}_Formacao`;
    const { formacao, eixo } = dadosFormacao;
    return await prisma[table].upsert({
      create: {
        nome: formacao,
        eixo: { connect: { id: eixo } },
      },
      update: {
        excluido: false,
        eixo: { connect: { id: eixo } },
      },
      where: {
        nome: formacao,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Altera a formação e seus dados.
 * @method modifyFormacao
 * @memberof module:formacoes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} formacao o novo nome do Curso de Formação
 * @param {Object} eixo o novo Eixo de Formação ao qual o curso pertence
 * @param {Object} id o ID do Eixo a ser modificado
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function modifyFormacao(entity, dadosFormacao) {
  try {
    const table = `${entity}_Formacao`;
    const { formacao, eixo, id } = dadosFormacao;
    return prisma[table].update({
      data: {
        nome: formacao,
        eixo: { connect: { id: eixo } },
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
 * Remove uma Formação do BD.
 * @method deleteFormacao
 * @memberof module:formacoes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID do Eixo a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function deleteFormacao(entity, id) {
  try {
    const table = `${entity}_Formacao`;
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
 * Fornece a listagem de eixos de formação.
 * @method getEixoFormacao
 * @memberof module:formacoes
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getEixoFormacao(entity, filter, limit) {
  try {
    const table = `${entity}_Eixo_Formacao`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        include: {
          formacoes: true,
        },
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
        include: {
          formacoes: true,
        },
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          excluido: false,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um Eixo de Formação ao BD.
 * @method addEixoFormacao
 * @memberof module:formacoes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} eixo o nome do Eixo de Formação a ser criado
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addEixoFormacao(entity, dadosEixo) {
  try {
    const table = `${entity}_Eixo_Formacao`;
    const { eixo } = dadosEixo;
    return prisma[table].create({
      data: {
        nome: eixo,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
