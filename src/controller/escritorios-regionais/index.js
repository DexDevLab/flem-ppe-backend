import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de escritórios regionais.
 * @method getEscritoriosRegionais
 * @memberof module:escritorios-regionais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getEscritoriosRegionais(entity, filter, limit) {
  try {
    const table = `${entity}_Escritorio_Regional`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
        include: {
          monitores: true,
          municipios: true,
        },
      });
    } else {
      return prisma[table].findMany({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: {
            equals: false,
          },
        },
        include: {
          monitores: true,
          municipios: true,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um Escritório Regional do BD.
 * @method addEscritorioRegional
 * @memberof module:escritorios-regionais
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosEscRegional detalhes do Escritório Regional, necessários
 * para sua inclusão:
 *
 * cep -  o CEP da sede do Escritório Regional
 *
 * num_contato - telefone de contato do Escritório Regional
 *
 * nome - nome do Escritório Regional
 *
 * logradouro - identificação do logradouro (rua com número) do Escritório Regional
 *
 * complemento - dados adicionais do endereço do Escritório Regional
 *
 * bairro - bairro do endereço do Escritório Regional
 *
 * cidade - cidade do endereço do Escritório Regional
 *
 * uf - UF do Escritório Regional
 *
 * email - email de contato do Escritório Regional
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addEscritorioRegional(entity, dadosEscRegional) {
  try {
    const {
      cep,
      num_contato,
      nome,
      logradouro,
      complemento,
      bairro,
      cidade,
      uf,
      email,
    } = dadosEscRegional;
    const filter = {
      nome: nome,
    };
    const queryFilter = {
      excluido: false,
      ...filter,
    };
    if (!_.isEmpty(await getEscritoriosRegionais(entity, queryFilter, 1))) {
      const error = new Error("Escritório Regional já existe");
      error.status = 409;
      throw error;
    }
    const table = `${entity}_Escritorio_Regional`;
    return await prisma[table].upsert({
      create: {
        cep,
        num_contato,
        nome,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
      },
      update: {
        excluido: false,
        cep,
        num_contato,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
      },
      where: {
        nome,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Altera um Escritório Regional no BD.
 * @method getEditorParametros
 * @memberof module:editor-parametros
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} dadosEscRegional detalhes do Escritório Regional, os quais alterarão
 * os já existentes:
 *
 * cep -  o CEP da sede do Escritório Regional
 *
 * num_contato - telefone de contato do Escritório Regional
 *
 * nome - nome do Escritório Regional
 *
 * logradouro - identificação do logradouro (rua com número) do Escritório Regional
 *
 * complemento - dados adicionais do endereço do Escritório Regional
 *
 * bairro - bairro do endereço do Escritório Regional
 *
 * cidade - cidade do endereço do Escritório Regional
 *
 * uf - UF do Escritório Regional
 *
 * email - email de contato do Escritório Regional
 *
 * id - ID do Escritório Regional a ser modificado
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function modifyEscritorioRegional(entity, dadosEscRegional) {
  try {
    const {
      cep,
      num_contato,
      nome,
      logradouro,
      complemento,
      bairro,
      cidade,
      uf,
      email,
      id,
    } = dadosEscRegional;
    const table = `${entity}_Escritorio_Regional`;
    return prisma[table].update({
      data: {
        cep,
        num_contato,
        nome,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
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
 * Remove um Escritório Regional do BD.
 * @method deleteEscritorioRegional
 * @memberof module:escritorios-regionais
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id ID do Escritório Regional a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export function deleteEscritorioRegional(entity, id) {
  try {
    const table = `${entity}_Escritorio_Regional`;
    const query = prisma[table].update({
      data: {
        excluido: true,
        municipios: {
          set: [],
        },
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
 * Altera um Escritório Regional e seus dados no BD.
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id ID do Escritório Regional a ser modificado
 * @param {Object} municipios os Municípios vinculados ao Escritório Regional
 * @param {Object} monitores os Monitores relacionados ao Escritório Regional
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyEscRegMunicMonit(
  entity,
  id,
  municipios,
  monitores
) {
  try {
    const table = `${entity}_Escritorio_Regional`;
    return prisma[table].update({
      data: {
        municipios: {
          set: municipios.map((munic) => ({ id: munic.value })),
        },
        monitores: {
          set: monitores.map((monit) => ({ id: monit.value })),
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
