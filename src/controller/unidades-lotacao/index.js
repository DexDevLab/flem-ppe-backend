import _ from "lodash";
import { prisma } from "services";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de unidades de lotação.
 * @method getUnidadesLotacao
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @param {String} municipio_Id o ID do município
 * @param {String} escritorioRegional_Id o ID do escritório regional
 * @param {String} demandante_Id o ID do demandante
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getUnidadesLotacao(
  entity,
  filter,
  limit,
  municipio_Id,
  escritorioRegional_Id,
  demandante_Id
) {
  try {
    const table = `${entity}_Unidade_Lotacao`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where:
          _.isUndefined(municipio_Id) &&
          _.isUndefined(escritorioRegional_Id) &&
          _.isUndefined(demandante_Id)
            ? { ...queryComposer(filter) }
            : { filter },
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
 * Adiciona uma nova unidade de lotação à listagem de unidades de lotação
 * @method addUnidadeLotacao
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosUnidadeLotacao detalhes da unidade de lotação:
 *
 *  nome - nome da unidade de lotação
 *
 *  cep - cep da unidade de lotacão
 *
 *  logradouro - nome da rua da unidade de lotação e seu número
 *
 *  complemento - complementos da rua da unidade de lotação
 *
 *  bairro - bairro da unidade de lotação
 *
 *  municipio - municipio da unidade de lotação
 *
 *  uf - UF da unidade de lotação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addUnidadeLotacao(entity, dadosUnidadeLotacao) {
  try {
    const { nome, cep, logradouro, complemento, bairro, municipio, uf } =
      dadosUnidadeLotacao;
    const table = `${entity}_Unidade_Lotacao`;
    return await prisma[table].create({
      data: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        municipio,
        uf,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica uma unidade de lotação da listagem de unidades de lotação.
 * @method modifyUnidadeLotacao
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosUnidadeLotacao detalhes da unidade de lotação:
 *
 *  id - ID da unidade de lotação
 *
 *  nome - nome da unidade de lotação
 *
 *  cep - cep da unidade de lotacão
 *
 *  logradouro - nome da rua da unidade de lotação e seu número
 *
 *  complemento - complementos da rua da unidade de lotação
 *
 *  bairro - bairro da unidade de lotação
 *
 *  municipio - municipio da unidade de lotação
 *
 *  uf - UF da unidade de lotação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyUnidadeLotacao(entity, dadosUnidadeLotacao) {
  try {
    const table = `${entity}_Unidade_Lotacao`;
    const { id, nome, cep, logradouro, complemento, bairro, municipio, uf } =
      dadosUnidadeLotacao;
    return prisma[table].update({
      data: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        municipio,
        uf,
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
 * Remove uma unidade de lotação.
 * @method deleteUnidadeLotacao
 * @memberof module:unidades-lotacao
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID da unidade de lotação a ser removida
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deleteUnidadeLotacao(entity, id) {
  try {
    const table = `${entity}_Unidade_Lotacao`;
    const tablePontoFocal = `${entity}_Unidade_Lotacao_Ponto_Focal`;

    await prisma[tablePontoFocal].updateMany({
      data: {
        excluido: true,
      },
      where: {
        unidadeLotacao_Id: id,
      },
    });

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

/**
 * Fornece a listagem de pontos focais.
 * @method getPontosFocais
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getPontosFocais(entity, filter, limit) {
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
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
        include: {
          contato: true,
        },
      });
    } else {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          excluido: {
            equals: false,
          },
        },
        include: {
          contato: true,
        },
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona uma novo ponto focal à lista de pontos focais
 * @method addPontoFocal
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosPontoFocal detalhes do ponto focal:
 *
 *  idUnidadeLotacao - ID da unidade de lotação respectiva ao ponto focal
 *
 *  nome - nome do ponto focal
 *
 *  email - email do ponto focal
 *
 *  contato - números de contato do ponto focal
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addPontoFocal(entity, dadosPontoFocal) {
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
    const { idUnidadeLotacao, nome, email, contato } = dadosPontoFocal;
    const listaContatos = () => {
      const arr = [];
      if (Array.isArray(email)) {
        arr.push(
          ...email.map((email) => ({
            contato: email,
            tipoContato_Id: "email",
          }))
        );
      }
      if (Array.isArray(contato)) {
        arr.push(
          ...contato.map((contato) => ({
            contato,
            tipoContato_Id: "celular",
          }))
        );
      }
      return arr;
    };
    return await prisma[table].create({
      data: {
        nome,
        contato: {
          createMany: {
            data: listaContatos(),
          },
        },
        unidadeLotacao_Id: idUnidadeLotacao,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um ponto focal da lista de pontos focais.
 * @method modifyPontoFocal
 * @memberof module:unidades-lotacao
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id o ID do ponto focal
 * @param {Object} dadosPontoFocal detalhes do ponto focal:
 *
 *  idUnidadeLotacao - ID da unidade de lotação respectiva ao ponto focal
 *
 *  nome - nome do ponto focal
 *
 *  email - email do ponto focal
 *
 *  contato - números de contato do ponto focal
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyPontoFocal(entity, id, dadosPontoFocal) {
  try {
    const { idUnidadeLotacao, nome, email, contato } = dadosPontoFocal;
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
    const tableContatosPontosFocais = `${entity}_Contatos_Pontos_Focais`;

    const listaContatos = () => {
      const arr = [];
      if (Array.isArray(email)) {
        arr.push(
          ...email.map((email) => ({
            contato: email,
            tipoContato_Id: "email",
          }))
        );
      }
      if (Array.isArray(contato)) {
        arr.push(
          ...contato.map((contato) => ({
            contato,
            tipoContato_Id: "celular",
          }))
        );
      }
      return arr;
    };

    await prisma[tableContatosPontosFocais].deleteMany({
      where: {
        pontoFocal_Id: id,
      },
    });

    return prisma[table].update({
      data: {
        nome,
        contato: {
          createMany: {
            data: listaContatos(),
          },
        },
        unidadeLotacao_Id: idUnidadeLotacao,
      },
      where: {
        id: id,
      },
    });
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Remove um ponto focal.
 * @method deletePontoFocal
 * @memberof module:unidades-lotacao
 * @param {String} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @param {Object} id o ID do ponto focal a ser removido
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function deletePontoFocal(entity, id) {
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
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
