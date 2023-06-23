import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de demandantes.
 * @method getDemandantes
 * @memberof module:demandantes
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @param {String} municipio_Id o ID do município
 * @param {String} escritorioRegional_Id o ID do escritório regional
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getDemandantes(
  entity,
  filter,
  limit,
  municipio_Id,
  escritorioRegional_Id
) {
  try {
    const table = `${entity}_Demandantes`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where:
          _.isUndefined(municipio_Id) && _.isUndefined(escritorioRegional_Id)
            ? { ...queryComposer(filter) }
            : { ...filter },
        include: {
          vagas: {
            select: {
              demandante_Id: true,
              municipio: {
                select: {
                  escritorio_RegionalId: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            sigla: "asc",
          },
        ],
      });
    } else {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: false,
        },
        include: {
          vagas: {
            select: {
              demandante_Id: true,
              municipio: {
                select: {
                  escritorio_RegionalId: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            sigla: "asc",
          },
        ],
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo Demandante.
 * @method addDemandante
 * @memberof module:demandantes
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} nome o nome do Demandante
 * @param {Object} sigla a sigla do Demandante
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addDemandante(entity, nome, sigla) {
  try {
    const table = `${entity}_Demandantes`;
    const filter = {
      nome: nome,
      sigla: sigla,
      condition: "OR",
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getDemandantes(entity, queryFilter, 1))) {
      const error = new Error("Demandante já existe");
      error.status = 409;
      throw error;
    }
    const query = await prisma[table].upsert({
      create: {
        nome,
        sigla: sigla.toUpperCase(),
      },
      update: {
        excluido: false,
        nome,
        sigla: sigla.toUpperCase(),
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
 * Altera um Demandante dentro do BD.
 * @method modifyDemandante
 * @memberof module:demandantes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} nome o novo nome do Demandante
 * @param {Object} sigla a nova sigla do Demandante
 * @param {Object} id o ID do demandante a ser alterado
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyDemandante(entity, nome, sigla, id) {
  try {
    const table = `${entity}_Demandantes`;
    return await prisma[table].update({
      data: {
        nome,
        sigla,
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
 * Remove um Demandante do BD.
 * @method deleteDemandante
 * @memberof module:demandantes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID do Demandante a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteDemandante(entity, id) {
  try {
    const table = `${entity}_Demandantes`;
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
