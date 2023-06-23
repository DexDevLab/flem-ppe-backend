import { prisma } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de Contatos realizados pela CR.
 * @method getContatoAcoesCr
 * @memberof module:fila-acoes
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getContatoAcoesCr(entity) {
  try {
    const table = `${entity}_Acoes_Cr`;
    const query = prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        benefAssoc: true,
        colabCr: true,
      },
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e);
  }
}

/**
 * Cria um contato realizado dentro de uma Ação no BD.
 * @method addContatoAcaoCr
 * @memberof module:fila-acoes
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosAcao os detalhes do contato da Ação:
 *
 * contato Realizado - Se o contato com determinado beneficiário foi feito
 *
 * descricao - A descrição do contato realizado
 *
 * benef - Beneficiário contatado
 *
 * acaoCr - Identificação da Ação CR realizada
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function addContatoAcaoCr(entity, dadosAcao) {
  try {
    const {
      contatoRealizado,
      descricao,
      benef: { id: idBenef },
      acaoCR: { id: idAcao },
    } = dadosAcao;
    const table = `${entity}_Contatos_Acoes_Cr`;
    return prisma[table].create({
      data: {
        acaoCr_id: idAcao,
        beneficiario_id: idBenef,
        concluido: JSON.parse(contatoRealizado),
        descricao,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um contato realizado dentro de uma Ação no BD.
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosAcao os detalhes do contato da Ação:
 *
 * contato Realizado - Se o contato com determinado beneficiário foi feito
 *
 * descricao - A descrição do contato realizado
 *
 * benef - Beneficiário contatado
 *
 * acaoCr - Identificação da Ação CR realizada
 *
 * contatoAcao - Identificação do Contato realizado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyContatoAcaoCr(entity, dadosAcao) {
  try {
    const {
      contatoRealizado,
      descricao,
      benef: { id: idBenef },
      acaoCR: { id: idAcao },
      contatoAcao: { id: idContato },
    } = dadosAcao;
    const table = `${entity}_Contatos_Acoes_Cr`;
    return await prisma[table].update({
      data: {
        acaoCr_id: idAcao,
        beneficiario_id: idBenef,
        concluido: JSON.parse(contatoRealizado),
        descricao,
      },
      where: {
        id: idContato,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
