import { getSituacoesVaga } from "controller/situacoes-vaga";
import _ from "lodash";
import { DateTime } from "luxon";
import { queryComposer } from "services/prisma/queryComposer";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a lista de monitoramentos realizados respeitando um período
 * específico.
 * @method getInfoMonitoramentosRealizados
 * @memberof module:monitoramentos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id o ID do monitoramento
 * @param {DateTime} dataInicio a data de início do período de monitoramento
 * @param {DateTime} dataFim a data de fim do período de monitoramento
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getInfoMonitoramentosRealizados(
  entity,
  id,
  demandanteId,
  dataInicio,
  dataFim
) {
  try {
    const table = `${entity}_Monitoramentos`;

    const query = _.isEmpty(id)
      ? await prisma[table].findMany({
          where: {
            beneficiario: {
              vaga: {
                some: {
                  demandante_Id: demandanteId,
                },
              },
            },
            dataMonitoramento:
              _.isEmpty(dataInicio) && _.isEmpty(dataFim)
                ? {}
                : {
                    gte: DateTime.fromISO(dataInicio).toISO(),
                    lte: DateTime.fromISO(dataFim).toISO(),
                  },
          },
          include: {
            beneficiario: {
              include: {
                vaga: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    unidadeLotacao: true,
                    municipio: true,
                    demandante: true,
                  },
                },
                formacao: true,
              },
            },
            monitor: true,
            monitoramentoComprovacao: true,
          },
        })
      : await prisma[table].findFirst({
          include: {
            beneficiario: {
              include: {
                vaga: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    unidadeLotacao: true,
                    municipio: true,
                    demandante: true,
                  },
                },
                formacao: true,
              },
            },
            monitoramentoComprovacao: true,
          },
          where: {
            id,
            dataMonitoramento:
              _.isEmpty(dataInicio) && _.isEmpty(dataFim)
                ? {}
                : {
                    gte: DateTime.fromISO(dataInicio).toISO(),
                    lte: DateTime.fromISO(dataFim).toISO(),
                  },
          },
        });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a informação sobre os monitoramentos.
 * @method getInfoMonitoramentos
 * @memberof module:monitoramentos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getInfoMonitoramentos(entity, filter, limit) {
  try {
    const table = `${entity}_Beneficiarios`;
    if (!_.isEmpty(filter)) {
      return await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          vaga: {
            some: {
              situacaoVaga_Id: (
                await getSituacoesVaga(
                  entity,
                  {
                    nome: "Ativo",
                  },
                  1
                )
              )[0].id,
            },
          },
          ...queryComposer(filter),
        },
        include: {
          vaga: {
            include: {
              demandante: true,
              municipio: {
                include: {
                  escritorioRegional: true,
                },
              },
              situacaoVaga: {
                include: {
                  tipoSituacao: true,
                },
              },
              unidadeLotacao: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          formacao: true,
          monitoramentos: {
            orderBy: {
              dataMonitoramento: "desc",
            },
          },
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
 * Adiciona uma nova comprovação de monitoramento ao monitoramento selecionado.
 * @method addComprovacaoMonitoramento
 * @memberof module:monitoramentos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosComprovacao dados da comprovação:
 *
 * monitoramentosParaAnexarComprovacao - Objeto contendo os monitoramentos os quais
 * receberão as comprovações
 *
 * comprovacaoAnexo - anexo comprobatório a ser vinculado a um monitoramento
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addComprovacaoMonitoramento(entity, dadosComprovacao) {
  try {
    const { monitoramentosParaAnexarComprovacao, comprovacaoAnexo } =
      dadosComprovacao;

    Object.keys(dadosComprovacao).forEach((key) => {
      if (dadosComprovacao[key] === "" || dadosComprovacao[key] == null) {
        dadosComprovacao[key] = null;
      }
    });

    const comprovacaoAnexo_anexoId = _.isEmpty(comprovacaoAnexo)
      ? null
      : JSON.stringify(comprovacaoAnexo.map(({ id }) => ({ id })));

    const table = `${entity}_Monitoramentos_Comprovacoes`;
    const query = await prisma[table].create({
      data: {
        anexoId: comprovacaoAnexo_anexoId,
        monitoramento: {
          connect: monitoramentosParaAnexarComprovacao.map(({ id }) => ({
            id,
          })),
        },
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(comprovacaoAnexo) &&
          comprovacaoAnexo.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          )
      )
    );

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona um novo monitoramento à lista de monitoramentos.
 * @method addMonitoramento
 * @memberof module:monitoramentos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosMonitoramento detalhes do monitoramento:
 *
 *  beneficiario_Id - ID do beneficiário
 *
 *  dataMonitoramento - data do monitoramento realizado
 *
 *  presencaTecnico - se houve presença de técnico no local
 *
 *  tipoMonitoramento - tipo de monitoramento realizado (se local ou remoto)
 *
 *  registrosVisitacao - se foi preenchido registro de visitação ao local
 *
 *  desvioFuncao - se o beneficiário teve sua função desviada ou acumulada
 *
 *  desvioFuncaoTipo - se sim, qual tipo
 *
 *  desvioFuncaoDescricao - se sim, detalhes
 *
 *  gravidez - se afastamento por gravidez
 *
 *  acidenteTrabalho - se afastamento por acidente de trabalho
 *
 *  acidenteTrabalhoDescricao - se sim, detalhes
 *
 *  impressoesConhecimento - avaliação: conhecimento do beneficiário
 *
 *  impressoesHabilidade - avaliação: habilidade do beneficiário em relação
 *     a sua função
 *
 *  impressoesAutonomia - avaliação: autonomia do beneficiário ao executar
 *    tarefas
 *
 *  impressoesPontualidade - avaliação: se o beneficiário é pontual
 *
 *  impressoesMotivacao - avaliação: se o beneficiário é motivado
 *
 *  impressoesExperienciaCompFormacao - avaliação: se o bebeficiário possui
 *     experiência compatível com a sua função e formação
 *
 *  observacoesEquipePpe - observações adicionais do monitor
 *
 *  metaType - tipo de meta (se 4.1 ou 4.2)
 *
 *  autoAvaliacao - autoavaliação do beneficiário
 *
 *  benefPontoFocal - relatório do Ponto Focal
 *
 *  ambienteTrabalho - avaliação: ambiente de trabalho do monitoramento
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addMonitoramento(entity, dadosMonitoramento) {
  try {
    const {
      beneficiario_Id,
      dataMonitoramento,
      presencaTecnico,
      tipoMonitoramento,
      registrosVisitacao,
      desvioFuncao,
      desvioFuncaoTipo = null,
      desvioFuncaoDescricao = null,
      gravidez = null,
      acidenteTrabalho,
      acidenteTrabalhoDescricao = null,
      impressoesConhecimento,
      impressoesHabilidade,
      impressoesAutonomia,
      impressoesPontualidade,
      impressoesMotivacao,
      impressoesExperienciaCompFormacao,
      observacoesEquipePpe,
      metaType,
      autoAvaliacao,
      benefPontoFocal,
      ambienteTrabalho,
    } = dadosMonitoramento;

    Object.keys(dadosMonitoramento).forEach((key) => {
      if (dadosMonitoramento[key] === "" || dadosMonitoramento[key] == null) {
        dadosMonitoramento[key] = null;
      }
    });

    const autoAvaliacao_anexoId = _.isEmpty(autoAvaliacao)
      ? null
      : JSON.stringify(autoAvaliacao.map(({ id }) => ({ id })));

    const benefPontoFocal_anexoId = _.isEmpty(benefPontoFocal)
      ? null
      : JSON.stringify(benefPontoFocal.map(({ id }) => ({ id })));

    const ambienteTrabalho_anexoId = _.isEmpty(ambienteTrabalho)
      ? null
      : JSON.stringify(ambienteTrabalho.map(({ id }) => ({ id })));

    const table = `${entity}_Monitoramentos`;
    const query = await prisma[table].create({
      data: {
        beneficiario_Id,
        dataMonitoramento: DateTime.fromISO(dataMonitoramento)
          .setLocale("pt-BR")
          .toISO(),
        presencaTecnico,
        tipoMonitoramento,
        registrosVisitacao,
        desvioFuncao,
        desvioFuncaoTipo,
        desvioFuncaoDescricao,
        gravidez,
        acidenteTrabalho,
        acidenteTrabalhoDescricao,
        impressoesConhecimento,
        impressoesHabilidade,
        impressoesAutonomia,
        impressoesPontualidade,
        impressoesMotivacao,
        impressoesExperienciaCompFormacao,
        observacoesEquipePpe,
        autoAvaliacao_anexoId,
        benefPontoFocal_anexoId,
        ambienteTrabalho_anexoId,
        metaType,
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(autoAvaliacao) &&
          autoAvaliacao.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(benefPontoFocal) &&
          benefPontoFocal.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(ambienteTrabalho) &&
          ambienteTrabalho.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          )
      )
    );
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica um monitoramento da lista de monitoramentos.
 * @method modifyMonitoramento
 * @memberof module:monitoramentos
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} id o ID do monitoramento
 * @param {Object} dadosMonitoramento detalhes do monitoramento:
 *
 *  beneficiario_Id - ID do beneficiário
 *
 *  dataMonitoramento - data do monitoramento realizado
 *
 *  presencaTecnico - se houve presença de técnico no local
 *
 *  tipoMonitoramento - tipo de monitoramento realizado (se local ou remoto)
 *
 *  registrosVisitacao - se foi preenchido registro de visitação ao local
 *
 *  desvioFuncao - se o beneficiário teve sua função desviada ou acumulada
 *
 *  desvioFuncaoTipo - se sim, qual tipo
 *
 *  desvioFuncaoDescricao - se sim, detalhes
 *
 *  gravidez - se afastamento por gravidez
 *
 *  acidenteTrabalho - se afastamento por acidente de trabalho
 *
 *  acidenteTrabalhoDescricao - se sim, detalhes
 *
 *  impressoesConhecimento - avaliação: conhecimento do beneficiário
 *
 *  impressoesHabilidade - avaliação: habilidade do beneficiário em relação
 *     a sua função
 *
 *  impressoesAutonomia - avaliação: autonomia do beneficiário ao executar
 *    tarefas
 *
 *  impressoesPontualidade - avaliação: se o beneficiário é pontual
 *
 *  impressoesMotivacao - avaliação: se o beneficiário é motivado
 *
 *  impressoesExperienciaCompFormacao - avaliação: se o bebeficiário possui
 *     experiência compatível com a sua função e formação
 *
 *  observacoesEquipePpe - observações adicionais do monitor
 *
 *  metaType - tipo de meta (se 4.1 ou 4.2)
 *
 *  autoAvaliacao - autoavaliação do beneficiário
 *
 *  benefPontoFocal - relatório do Ponto Focal
 *
 *  ambienteTrabalho - avaliação: ambiente de trabalho do monitoramento
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function modifyMonitoramento(entity, id, dadosMonitoramento) {
  try {
    const {
      beneficiario_Id,
      dataMonitoramento,
      presencaTecnico,
      tipoMonitoramento,
      registrosVisitacao,
      desvioFuncao,
      desvioFuncaoTipo = null,
      desvioFuncaoDescricao = null,
      gravidez = null,
      acidenteTrabalho,
      acidenteTrabalhoDescricao = null,
      impressoesConhecimento,
      impressoesHabilidade,
      impressoesAutonomia,
      impressoesPontualidade,
      impressoesMotivacao,
      impressoesExperienciaCompFormacao,
      observacoesEquipePpe,
      metaType,
      autoAvaliacao,
      benefPontoFocal,
      ambienteTrabalho,
    } = dadosMonitoramento;

    const autoAvaliacao_anexoId = _.isEmpty(autoAvaliacao)
      ? null
      : JSON.stringify(autoAvaliacao.map(({ id }) => ({ id })));

    const benefPontoFocal_anexoId = _.isEmpty(benefPontoFocal)
      ? null
      : JSON.stringify(benefPontoFocal.map(({ id }) => ({ id })));

    const ambienteTrabalho_anexoId = _.isEmpty(ambienteTrabalho)
      ? null
      : JSON.stringify(ambienteTrabalho.map(({ id }) => ({ id })));

    const table = `${entity}_Monitoramentos`;
    const query = await prisma[table].update({
      data: {
        beneficiario_Id,
        dataMonitoramento: DateTime.fromISO(dataMonitoramento)
          .setLocale("pt-BR")
          .toISO(),
        presencaTecnico,
        tipoMonitoramento,
        registrosVisitacao,
        desvioFuncao,
        desvioFuncaoTipo,
        desvioFuncaoDescricao,
        gravidez,
        acidenteTrabalho,
        acidenteTrabalhoDescricao,
        impressoesConhecimento,
        impressoesHabilidade,
        impressoesAutonomia,
        impressoesPontualidade,
        impressoesMotivacao,
        impressoesExperienciaCompFormacao,
        observacoesEquipePpe,
        autoAvaliacao_anexoId,
        benefPontoFocal_anexoId,
        ambienteTrabalho_anexoId,
        metaType,
      },
      where: {
        id,
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(autoAvaliacao) &&
          autoAvaliacao.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(benefPontoFocal) &&
          benefPontoFocal.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(ambienteTrabalho) &&
          ambienteTrabalho.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          )
      )
    );

    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
