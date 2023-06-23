import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de materiais.
 * @method getMateriais
 * @memberof module:materiais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getMateriais(entity, filter, limit) {
  try {
    const table = `${entity}_Materiais`;
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
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica o material da lista de materiais.
 * @method modifyMaterial
 * @memberof module:materiais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosMaterial descrição do material a ser
 * adicionado:
 *
 * id - ID do material
 *
 * nome - o nome do material
 *
 * descricao - descrição do material
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyMaterial(entity, dadosMaterial) {
  try {
    const table = `${entity}_Materiais`;
    const { id, nome, descricao } = dadosMaterial;
    return prisma[table].update({
      data: {
        nome,
        descricao,
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
 * Adiciona um novo material à lista de materiais.
 * @method addMaterial
 * @memberof module:materiais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosMaterial descrição do material a ser
 * adicionado:
 *
 * nome - o nome do material
 *
 * descricao - descrição do material
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addMaterial(entity, dadosMaterial) {
  try {
    const table = `${entity}_Materiais`;
    const { nome, descricao } = dadosMaterial;
    const filter = {
      nome: nome,
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getMateriais(entity, queryFilter, 1))) {
      const error = new Error("Material já existe");
      error.status = 409;
      throw error;
    }
    return prisma[table].upsert({
      where: {
        nome,
      },
      update: {
        nome,
        descricao,
        excluido: false,
      },
      create: {
        nome,
        descricao,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Remove um material.
 * @method deleteMaterial
 * @memberof module:materiais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} id o ID do colaborador
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteMaterial(entity, id) {
  try {
    const table = `${entity}_Materiais`;
    return prisma[table].update({
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
