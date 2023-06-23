import { getBeneficiarios } from "controller/beneficiarios";
import { getTiposHistorico } from "controller/historicos";
import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de Ações à Central de Relacionamento.
 * @method getAcoesCr
 * @memberof module:acoes-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getAcoesCr(entity, filter, limit) {
  try {
    const table = `${entity}_Acoes_Cr`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          benefAssoc: {
            include: {
              contatosAcoes: true,
            },
          },
          colabCr: true,
          contatos: true,
        },
        orderBy: [
          {
            id: "asc",
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
          benefAssoc: {
            include: {
              contatosAcoes: true,
            },
          },
          colabCr: true,
          contatos: true,
        },
        orderBy: [
          {
            id: "asc",
          },
        ],
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona uma nova Ação à Central de Relacionamento.
 * @method addAcaoCr
 * @memberof module:acoes-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosAcao as propriedades que compõem e caracterizam a ação:
 *
 * nome - Nome da Ação
 *
 * tipo - O Tipo de Ação
 *
 * descricao - Detalhes sobre a Ação
 *
 * benefAssoc - Beneficiários associados à Ação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addAcaoCr(entity, dadosAcao) {
  try {
    const { nome, tipo, descricao, benefAssoc, colabAcaoCR } = dadosAcao;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
    const table = `${entity}_Acoes_Cr`;
    const benefToConnectAcao = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });
    const queryFilter = {
      condition: "AND",
      tipoAcaoCr_Id: tipo,
      nome,
      excluido: false,
    };
    if (!_.isEmpty(await getAcoesCr(entity, queryFilter, 1))) {
      const error = new Error("Ação já existe");
      error.status = 409;
      throw error;
    }
    return prisma[table].create({
      data: {
        nome,
        descricao,
        tipoAcaoCr_Id: tipo,
        benefAssoc: {
          connect: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        colabCr: {
          connect: colabAcaoCR.map(({ value }) => ({ id: value })),
        },
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Altera uma Ação da Central de Relacionamento.
 * @method modifyAcaoCr
 * @memberof module:acoes-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosAcao as propriedades que compõem e caracterizam a ação:
 *
 * nome - Nome da Ação
 *
 * tipo - O Tipo de Ação
 *
 * descricao - Detalhes sobre a Ação
 *
 * benefAssoc - Beneficiários associados à Ação
 *
 * colabAcaoCR - Colaboradores que foram designados a esta Ação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyAcaoCr(entity, dadosAcao) {
  try {
    const { id, nome, tipo, descricao, benefAssoc, colabAcaoCR } = dadosAcao;
    const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
    const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
    const colabMatriculas = colabAcaoCR.map((colab) => colab.value.toString());
    const table = `${entity}_Acoes_Cr`;
    const benefToConnectAcao = await getBeneficiarios(entity, {
      cpf: benefCPFs,
      matriculaFlem: benefMatriculas,
      condition: "OR",
    });
    return prisma[table].update({
      data: {
        nome,
        descricao,
        tipoAcaoCr_Id: tipo,
        benefAssoc: {
          set: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        colabCr: {
          set: colabMatriculas.map((value) => ({ id: value })),
        },
      },
      include: {
        benefAssoc: true,
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
 * Remove uma Ação do BD.
 * @method deleteAcaoCr
 * @memberof module:acoes-cr
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID da Ação a ser excluída
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteAcaoCr(entity, id) {
  try {
    const table = `${entity}_Acoes_Cr`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
      },
      where: {
        id,
      },
      include: {
        benefAssoc: true,
      },
    });

    const historicoTable = `${entity}_Historico`;
    await prisma[historicoTable].create({
      data: {
        descricao: `Exclusão da ação: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        acoesCr: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await getTiposHistorico(entity, { nome: "Ação CR" }, 1)
        )[0].id,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de Tipos de Ações à Central de Relacionamento.
 * @method getTiposAcoesCr
 * @memberof module:acoes-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getTiposAcoesCr(entity, filter, limit) {
  try {
    const table = `${entity}_Tipos_Acoes_Cr`;
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
 * Adiciona um novo Tipo de Ação da Central de Relacionamento.
 * @method addTipoAcaoCr
 * @memberof module:acoes-cr
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} nome o nome do Tipo de Ação.
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addTipoAcaoCr(entity, nome) {
  try {
    const table = `${entity}_Tipos_Acoes_Cr`;
    return await prisma[table].create({
      data: {
        nome,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
