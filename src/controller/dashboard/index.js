import _ from "lodash";
import { DateTime } from "luxon";
import QueryString from "qs";
import { prisma } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de beneficiários de acordo com critérios do dashboard.
 * @method getDashboardBenef
 * @memberof module:dashboard
 * @param {Object} queryParams critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardBenef(queryParams) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const table = `${entity}_Beneficiarios`;

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);

          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });

      return result;
    }

    const query = await prisma[table].count({
      // const query = await prisma[table].findMany({
      where: {
        excluido: false,
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de eventos de acordo com critérios do dashboard.
 * @method getDashboardEventos
 * @memberof module:dashboard
 * @param {Object} queryParams critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardEventos(queryParams) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const table = `${entity}_Eventos_Lista_Presenca`;

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });

      return result;
    }

    const query = await prisma[table].count({
      where: {
        excluido: false,
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de formações de acordo com critérios do dashboard.
 * @method getDashboardFormacoes
 * @memberof module:dashboard
 * @param {Object} queryParams critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardFormacoes(queryParams) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const table = `${entity}_Formacao`;

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });
      return result;
    }

    const query = await prisma[table].count({
      where: {
        excluido: false,
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de monitoramentos de acordo com critérios do dashboard.
 * @method getDashboardMonitoramento
 * @memberof module:dashboard
 * @param {Object} periodoMonitoramento Objeto contendo a data início e a
 * data fim do monitoramento desejado
 * @param {Object} queryParams Critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardMonitoramento(
  periodoMonitoramento,
  queryParams
) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const { startDate, endDate } = JSON.parse(periodoMonitoramento);

    const table = `${entity}_Monitoramentos`;
    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];

          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });
      return result;
    }

    const query = await prisma[table].count({
      // const query = await prisma[table].findMany({
      where: {
        excluido: false,
        dataMonitoramento: {
          gte: DateTime.fromISO(startDate).toISO(),
          lte: DateTime.fromISO(endDate).toISO(),
        },
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de remessas de acordo com critérios do dashboard.
 * @method getDashboardRemessas
 * @memberof module:dashboard
 * @param {Object} queryParams critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardRemessas(queryParams) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const table = `${entity}_RemessaSec`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];
        return (result[key] = query[idx]);
      });

      return result;
    }

    const query = await prisma[tableBeneficiarios].count({
      where: {
        excluido: false,
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de territórios de identidade de acordo com critérios do dashboard.
 * @method getDashboardTerritoriosIdentidade
 * @memberof module:dashboard
 * @param {Object} queryParams critérios para conduzir a aquisição de dados:
 *
 *  entity - a localidade do Projeto (por exemplo, "ba" para Bahia)
 *
 *  where - critério principal de busca
 *
 *  transactionParams - critério secundário de busca
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDashboardTerritoriosIdentidade(queryParams) {
  try {
    const { entity, where, transactionParams } = QueryString.parse(queryParams);

    const table = `${entity}_TerritoriosIdentidade`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const queryTable = await prisma[table].findMany({
      where: {
        municipios: {
          some: {
            vagas: {
              some: {
                situacaoVaga: {
                  nome: "Ativo",
                },
              },
            },
          },
        },
      },
      select: {
        nome: true,
        municipios: {
          select: {
            _count: {
              select: {
                vagas: true,
              },
            },
          },
        },
      },
    });

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });

      return result;
    }

    return queryTable;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
