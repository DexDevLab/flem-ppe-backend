import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Adiciona um novo histórico à lista de históricos.
 * @method addHistorico
 * @memberof module:historicos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} historicoDesc descrição do histórico
 * @param {String} historicoId id do histórico a ser adicionado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addHistorico(entity, historicoDesc, historicoId) {
  try {
    const table = `${entity}_Historico`;
    return await prisma[table].create({
      data: {
        descricao: historicoDesc,
        tipoHistorico_Id: historicoId,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

export async function updateHistoricoforImport(
  entity,
  idVaga,
  idBeneficiario,
  idRemessa,
  idHistorico
) {
  try {
    const table = `${entity}_Historico`;
    console.log(29, entity, idVaga, idBeneficiario, idRemessa, idHistorico);
    const query = await prisma[table].update({
      data: {
        vaga: {
          set: idVaga,
        },
        beneficiario: {
          set: idBeneficiario,
        },
        remessaSec: {
          connect: {
            id: idRemessa,
          },
        },
      },
      where: {
        id: idHistorico,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de tipos de histórico.
 * @method getTiposHistorico
 * @memberof module:historicos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getTiposHistorico(entity, filter, limit) {
  try {
    const table = `${entity}_Historico_Tipo`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
      });
    } else {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
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
 * Adiciona um novo tipo de histórico à lista de tipos de históricos.
 * @method addTipoHistorico
 * @memberof module:historicos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosHistorico descrição do tipo de histórico a ser
 * adicionado:
 *
 * nome - o nome do tipo de histórico
 *
 * tipoHist - se é um histórico sigiloso ou não
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addTipoHistorico(entity, dadosHistorico) {
  try {
    const table = `${entity}_Historico_Tipo`;
    const { nome, tipoHist } = dadosHistorico;
    return prisma[table].create({
      data: {
        nome,
        sigiloso: JSON.parse(tipoHist),
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

export async function deleteTipoHistorico(entity, id) {
  try {
    const table = `${entity}_Historico_Tipo`;
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
