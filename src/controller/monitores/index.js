import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { maskCapitalize } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de Monitores.
 * @method getMonitores
 * @memberof module:monitores
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getMonitores(entity, filter, limit) {
  try {
    const table = `${entity}_Monitores`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          escritoriosRegionais: true,
          demandantes: true,
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
        include: {
          escritoriosRegionais: true,
          demandantes: true,
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
 * Modifica um monitor da lista de monitores
 * @method modifyMonitor
 * @memberof module:monitores
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosMonitor detalhes do monitor:
 *
 *  id - ID do monitor
 *
 *  monitor - nome do monitor
 *
 *  erAssoc - Escritórios Regionais associados ao monitor
 *
 *  demandantesAssociados - Demandantes associados ao monitor
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyMonitor(entity, dadosMonitor) {
  try {
    const table = `${entity}_Monitores`;
    const { id, erAssoc, demandantesAssociados } = dadosMonitor;
    return prisma[table].update({
      data: {
        escritoriosRegionais: {
          set: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          set: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
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
 * Adiciona um novo monitor à lista de monitores
 * @method addMonitor
 * @memberof module:monitores
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosMonitor detalhes do monitor:
 *
 *  monitor - nome do monitor
 *
 *  erAssoc - Escritórios Regionais associados ao monitor
 *
 *  demandantesAssociados - Demandantes associados ao monitor
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addMonitor(entity, dadosMonitor) {
  try {
    const table = `${entity}_Monitores`;
    const { monitor, erAssoc, demandantesAssociados } = dadosMonitor;
    const filter = {
      matricula: monitor.matriculaDominio,
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getMonitores(entity, queryFilter, 1))) {
      const error = new Error("Monitor já existe");
      error.status = 409;
      throw error;
    }

    return await prisma[table].upsert({
      where: {
        matricula: monitor.matriculaDominio,
      },
      update: {
        nome: maskCapitalize(monitor.nome),
        excluido: false,
        escritoriosRegionais: {
          set: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          set: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
      },
      create: {
        nome: maskCapitalize(monitor.nome),
        matricula: monitor.matriculaDominio,
        escritoriosRegionais: {
          connect: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          connect: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Remove um Monitor.
 * @method deleteMonitor
 * @memberof module:monitores
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} id o ID do colaborador
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteMonitor(entity, id) {
  try {
    const table = `${entity}_Monitores`;
    return prisma[table].update({
      data: {
        excluido: true,
        escritoriosRegionais: {
          set: [],
        },
        demandantes: {
          set: [],
        },
      },
      where: {
        id,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
