import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de colaboradores da Central de Relacionamento.
 * @method getColaboradoresCr
 * @memberof module:colaboradores-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getColaboradoresCr(entity, filter, limit) {
  try {
    const table = `${entity}_Colaboradores_Cr`;
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
 * Adiciona um novo colaborador da Central de Relacionamento.
 * @method addColaboradorCr
 * @memberof module:colaboradores-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosColaborador as informações do colaborador:
 *
 * nome - Nome do colaborador
 *
 * login_usuario - O login do usuário no sistema
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addColaboradorCr(entity, dadosColaborador) {
  try {
    const { nome, login_usuario } = dadosColaborador;
    const table = `${entity}_Colaboradores_Cr`;

    const filter = {
      login_usuario: login_usuario,
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getColaboradoresCr(entity, queryFilter, 1))) {
      const error = new Error("Colaborador já existe");
      error.status = 409;
      throw error;
    }
    const query = await prisma[table].upsert({
      create: {
        nome,
        login_usuario,
      },
      update: {
        excluido: false,
        nome,
        login_usuario,
      },
      where: {
        login_usuario,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um colaborador da Central de Relacionamento.
 * @method modifyColaboradorCr
 * @memberof module:colaboradores-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosColaborador as informações do colaborador:
 *
 * nome - Nome do colaborador
 *
 * login_usuario - O login do usuário no sistema
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyColaboradorCr(entity, id, dadosColaborador) {
  try {
    const { nome, login_usuario } = dadosColaborador;
    const table = `${entity}_Colaboradores_Cr`;
    return await prisma[table].update({
      data: {
        nome,
        login_usuario,
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
 * Remove um Colaborador da Central de Relacionamento
 * @method deleteColaboradorCr
 * @memberof module:colaboradores-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} id o ID do colaborador
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteColaboradorCr(entity, id) {
  try {
    const table = `${entity}_Colaboradores_Cr`;
    return await prisma[table].update({
      data: {
        excluido: true,
      },
      where: {
        id,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
