import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de municipios.
 * @method getMunicipios
 * @memberof module:municipios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getMunicipios(entity, filter, limit) {
  try {
    const table = `${entity}_Municipios`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          territorioIdentidade: true,
          escritorioRegional: true,
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
          excluido: false,
        },
        include: {
          territorioIdentidade: true,
          escritorioRegional: true,
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
