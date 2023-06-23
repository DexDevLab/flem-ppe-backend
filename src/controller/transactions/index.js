import { getDemandantes } from "controller/demandantes";
import { getEtnias } from "controller/etnias";
import { getFormacao } from "controller/formacoes";
import {
  addHistorico,
  getTiposHistorico,
  updateHistoricoforImport,
} from "controller/historicos";
import { getMunicipios } from "controller/municipios";
import { prisma } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Transaction que reúne um conjunto de queries que fornece:
 * Demandantes, Municípios, Etnias e Formações.
 * @method getDemandMunicEtniaFormacao
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getDemandMunicEtniaFormacao(entity) {
  try {
    const queries = await prisma.$transaction(async (prisma) => {
      const demand = await getDemandantes(entity);
      const munic = await getMunicipios(entity);
      const etnias = await getEtnias(entity);
      const formacoes = await getFormacao(entity);
      return [demand, munic, etnias, formacoes];
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que reúne um conjunto de queries que fornece:
 * ID do Demandante, ID do Município, ID da Formação, e ID da Etnia.
 * Utilizado para correlacionar o ID das colunas na planilha de importação
 * com o ID encontrado no BD.
 * @method getColumnsIdToImport
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} demand o demandante
 * @param {String} municVaga o município da vaga
 * @param {String} formacao a formação
 * @param {String} etnia a etnia
 * @returns {Array} Array de resultados.
 */
export async function getColumnsIdToImport(
  entity,
  demand,
  municVaga,
  formacao,
  etnia
) {
  try {
    const queries = await prisma.$transaction(async (prisma) => {
      const demands = await getDemandantes(
        entity,
        { ["nome"]: demand.replace(/.*- /, "") },
        1
      );
      const munic = await getMunicipios(
        entity,
        { ["nome"]: municVaga.toLowerCase() },
        1
      );
      const etnias = await getEtnias(entity, { ["etnia"]: etnia }, 1);
      const formacoes = await getFormacao(entity, { ["nome"]: formacao }, 1);
      return [demands[0].id, munic[0].id, formacoes[0].id, etnias[0].id];
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que reúne um conjunto de beneficiários para atualizar
 * @method createUpsertBenefsFromImport
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Array} benefsToCreate Array contendo os beneficiários que serão
 * incluídos
 * @returns {Promise} Promise contendo as queries de transação do array de
 * beneficiários.
 */
export async function createUpsertBenefsFromImport(entity, benefsToCreate) {
  try {
    const table = `${entity}_Beneficiarios`;
    const queries = await prisma.$transaction(
      benefsToCreate.map((data) =>
        prisma[table].upsert({
          create: data,
          update: data,
          where: {
            matriculaSec: data.matriculaSec,
          },
          include: {
            vaga: true,
          },
        })
      )
    );
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que reúne um conjunto históricos a serem adicionados individualmente
 * com a importação dos beneficiários.
 * @method createHistoricoToBenefFromImport
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} queryRemessa Objeto contendo o resultado da query de inclusão
 * da remessa no BD
 * @param {Number} numRemessa Número da remessa
 * @param {Array} benefList Array contendo os beneficiários que serão
 * incluídos
 * @returns {Promise} Promise contendo as queries de transação do array de
 * beneficiários.
 */
export async function createHistoricoToBenefFromImport(
  entity,
  queryRemessa,
  numRemessa,
  benefList
) {
  try {
    const queries = prisma.$transaction(async (prisma) => {
      const tipoHistoricoId = await getTiposHistorico(
        entity,
        {
          ["nome"]: "Vaga",
        },
        1
      );

      const create = await addHistorico(
        entity,
        `Atribuída nova vaga ao beneficiário. Remessa nº ${numRemessa}`,
        tipoHistoricoId[0].id
      );

      const idVaga = new Array().concat(
        ...benefList.map(({ vaga }) => {
          return vaga.map(({ id }) => ({ id }));
        })
      );
      const idBeneficiario = benefList.map(({ id }) => ({ id }));
      const update = await updateHistoricoforImport(
        entity,
        idVaga,
        idBeneficiario,
        queryRemessa.id,
        create.id
      );

      return { create, update };
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}


/**
 * Transaction que reúne um conjunto de envios a serem criados baseado em um conjunto
 * de emails.
 * @method createEnvios
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Array} enviosToCreate Array contendo os envios.
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function createEnvios(entity, enviosToCreate) {
  try {
    const table = `${entity}_Comunicados_Enviados`;
    const { mailDetails, ...rest } = enviosToCreate;
    const queries = prisma.$transaction(async (prisma) => {
      return await prisma[table].create({ data: rest });
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que reúne um conjunto de pendências a serem inseridas para um
 * beneficiário específico.
 * @method pendenciasToUpsert
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} idBeneficiario o ID do beneficiário
 * @param {Object} pendencias Objeto contendo uma listagem de pendências para
 * o beneficiário.
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function pendenciasToUpsert(entity, idBeneficiario, pendencias) {
  try {
    const table = `${entity}_Beneficiarios`;

    const queries = await prisma.$transaction(async (prisma) => {
      const pendenciasBeneficiario = await prisma[table]
        .findFirst({
          where: {
            id: idBeneficiario,
          },
        })
        .pendencias();

      const pendenciasToCreate = Object.keys(pendencias)
        .map((key) => ({
          tipoPendencia_Id: key,
          value: pendencias[key],
        }))
        .filter(
          ({ tipoPendencia_Id }) =>
            !pendenciasBeneficiario
              .map(({ tipoPendencia_Id }) => tipoPendencia_Id)
              .includes(tipoPendencia_Id)
        )
        .filter(({ value }) => value);

      const pendenciasToUpdate = Object.keys(pendencias)
        .map((key) => ({
          tipoPendencia_Id: key,
          value: pendencias[key],
        }))
        .filter(({ tipoPendencia_Id }) =>
          pendenciasBeneficiario
            .map(({ tipoPendencia_Id }) => tipoPendencia_Id)
            .includes(tipoPendencia_Id)
        )
        .filter(({ value }) => value);

      return { create: pendenciasToCreate, update: pendenciasToUpdate };
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que valida e verifica quais contatos devem ser criados e quais
 * devem ser atualizados, considerando um Array de contatos de um beneficiário.
 * @method contatosToCreateAndUpdate
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} idBeneficiario o ID do beneficiário
 * @param {Array} listaContatos um Array contendo uma lista de contatos.
 * @returns {Array} Array de Objetos contendo os contatos a serem criados
 * e os que serão atualizados.
 */
export async function contatosToCreateAndUpdate(
  entity,
  idBeneficiario,
  listaContatos
) {
  try {
    const table = `${entity}_Contatos_Beneficiarios`;
    const queries = await prisma.$transaction(async (prisma) => {
      const getContatos = await prisma[table].findMany({
        where: {
          AND: [
            {
              contato: {
                in: listaContatos.map(({ contato }) => contato),
              },
            },
            {
              benefAssoc_Id: idBeneficiario,
            },
          ],
        },
      });

      const contatosCreate = listaContatos.filter(({ contato }) => {
        if (getContatos.length) {
          return !getContatos.map(({ contato }) => contato).includes(contato);
        } else {
          return true;
        }
      });

      const contatosUpdate = listaContatos.filter(({ contato }) => {
        if (getContatos.length) {
          return getContatos.map(({ contato }) => contato).includes(contato);
        } else {
          return true;
        }
      });
      return [contatosCreate, contatosUpdate];
    });
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Transaction que modifica todos os dados pertinentes a um beneficiário.
 * @method updateBenefData
 * @memberof module:transactions
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} idBeneficiario o ID do beneficiário no sistema
 * @param {Object} dadosBeneficiario detalhes do beneficiário:
 *
 * pendencias - documentos em pendência do beneficiário
 *
 * territorio - território de identidade da vaga
 *
 * eixoFormacao_Id - ID do Eixo de Formação do Beneficiário
 *
 * matriculaFlem - Número de Matrícula FLEM do beneficiário
 *
 * superiorPeriodo - Em que período o beneficiário está cursando no momento
 *
 * superiorAnoInicio - Ano de início do ingresso ao Ensino Superior
 *
 * superiorAnoConclusao - Ano de conclusão do beneficiário no Curso Superior
 *
 * email - email do beneficiário
 *
 * obsEmail - detalhes e observação sobre o email do beneficiário
 *
 * telefone - número de telefone do beneficiário
 *
 * obsTelefone - detalhes e observação sobre o número de telefone do beneficiário
 *
 * dataEntregaMaterial - data de entrega de materiais ao beneficiário
 *
 * idMaterial - ID do material recebido
 *
 * idTamanho - ID do tamanho do material recebido
 *
 * qtdMaterial - quantidade do material recebido
 *
 * obsMaterial - observações sobre o material recebido
 *
 * idCatHistorico - ID da categoria do histórico
 *
 * descricaoHistorico - descrição do histórico
 *
 * histSigiloso - se o histórico é sigiloso ou não
 *
 * demandante_Id - ID do demandante
 *
 * situacaoVaga_Id - ID da situação da vaga
 *
 * situacaoVagaHasChanged - se a situação da vaga mudou
 *
 * unidadeLotacao_Id - ID da unidade de lotação
 *
 * publicadoDiarioOficial - se foi publicado no diário oficial
 *
 * vaga_municipio_Id - ID do município da vaga
 *
 * anexos - documentos anexados
 *
 * descricaoDocumento - descrição do documento anexado
 *
 * docSigiloso - se o documento é sigiloso
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function updateBenefData(
  entity,
  idBeneficiario,
  dadosBeneficiario
) {
  try {
    const {
      pendencias,
      territorio,
      eixoFormacao_Id,
      matriculaFlem,
      superiorPeriodo,
      superiorAnoInicio,
      superiorAnoConclusao,
      email,
      obsEmail = [],
      telefone,
      obsTelefone = [],
      dataEntregaMaterial,
      idMaterial,
      idTamanho,
      qtdMaterial,
      obsMaterial,
      idCatHistorico,
      descricaoHistorico,
      histSigiloso,
      // Vaga
      demandante_Id,
      situacaoVaga_Id,
      situacaoVagaHasChanged,
      unidadeLotacao_Id,
      publicadoDiarioOficial,
      vaga_municipio_Id,
      // Anexos
      anexos,
      descricaoDocumento,
      docSigiloso,
      ...formData
    } = dadosBeneficiario;

    const table = `${entity}_Beneficiarios`;
    const tableMateriaisEntregues = `${entity}_Materiais_Entregues`;
    const tableHistorico = `${entity}_Historico`;
    const tableDocumentos = `${entity}_Documentos`;
    const tablePendencias = `${entity}_Pendencias`;
    const tableContatosBeneficiarios = `${entity}_Contatos_Beneficiarios`;
    const tableVagas = `${entity}_Vaga`;

    const listaContatos = () => {
      const arr = [];
      if (Array.isArray(email)) {
        arr.push(
          ...email
            .filter((con) => con)
            .map((email) => ({
              contato: email,
              observacao: _.isEmpty(obsEmail[idx]) ? null : obsEmail[idx],
              tipoContato_Id: "email",
            }))
        );
      }
      if (Array.isArray(telefone)) {
        arr.push(
          ...telefone
            .filter((con) => con)
            .map((telefone) => ({
              contato: telefone,
              observacao: _.isEmpty(obsTelefone[idx]) ? null : obsTelefone[idx],
              tipoContato_Id: "telefone",
            }))
        );
      }
      return arr;
    };

    const addMaterial = () => {
      if ((dataEntregaMaterial, idMaterial, idTamanho, qtdMaterial)) {
        return [
          prisma[tableMateriaisEntregues].create({
            data: {
              beneficiarios_Id: idBeneficiario,
              tamanhoUniforme_Id: idTamanho,
              tipoMaterial_Id: idMaterial,
              observacao: obsMaterial,
              dataEntrega: dataEntregaMaterial,
              quantidade: parseInt(qtdMaterial),
            },
            include: {
              tamanhoEntregue: true,
              tipo: true,
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const addHistorico = () => {
      if ((idCatHistorico, descricaoHistorico, histSigiloso)) {
        return [
          prisma[tableHistorico].create({
            data: {
              descricao: descricaoHistorico,
              tipoHistorico_Id: idCatHistorico,
              sigiloso: JSON.parse(histSigiloso),
              beneficiario: {
                connect: {
                  id: idBeneficiario,
                },
              },
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const addDocumento = () => {
      if ((anexos, descricaoDocumento, docSigiloso)) {
        return [
          prisma[tableDocumentos].create({
            data: {
              descricao: descricaoDocumento,
              sigiloso: JSON.parse(docSigiloso),
              benefAssoc_Id: idBeneficiario,
              anexosId: JSON.stringify([{ id: anexos.id }]),
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const pendenciasUpsert = await pendenciasToUpsert(
      entity,
      idBeneficiario,
      pendencias
    );

    const [contatosToCreate, contatosToUpdate] =
      await contatosToCreateAndUpdate(entity, idBeneficiario, listaContatos());

    const queries = await prisma.$transaction([
      ...addDocumento(),
      ...addMaterial(),
      ...addHistorico(),
      prisma[tablePendencias].updateMany({
        data: {
          pendente: false,
        },
        where: {
          beneficiarios: {
            some: {
              id: idBeneficiario,
            },
          },
        },
      }),
      prisma[tablePendencias].updateMany({
        data: {
          pendente: true,
        },
        where: {
          beneficiarios: {
            some: {
              id: idBeneficiario,
            },
          },
          tipoPendencia_Id: {
            in: pendenciasUpsert.update.map(
              ({ tipoPendencia_Id }) => tipoPendencia_Id
            ),
          },
        },
      }),
      ...pendenciasUpsert.create.map(({ tipoPendencia_Id }) =>
        prisma[tablePendencias].create({
          data: {
            tipoPendencia_Id,
            beneficiarios: {
              connect: {
                id: idBeneficiario,
              },
            },
          },
        })
      ),
      prisma[tableContatosBeneficiarios].deleteMany({
        where: {
          AND: [
            {
              contato: {
                notIn: listaContatos().map(({ contato }) => contato),
              },
            },
            {
              benefAssoc_Id: idBeneficiario,
            },
          ],
        },
      }),
      prisma[table].update({
        data: {
          ...formData,
          superiorAnoInicio: parseInt(superiorAnoInicio) || null,
          superiorAnoConclusao: parseInt(superiorAnoConclusao) || null,
          superiorPeriodo: parseInt(superiorPeriodo) || null,
          matriculaFlem: parseInt(matriculaFlem) || null,
          contatos: {
            createMany: {
              data: contatosToCreate,
            },
            updateMany: contatosToUpdate.map((data) => ({
              data,
              where: {
                contato: data.contato,
              },
            })),
          },
          vaga: {
            update: {
              data: {
                demandante_Id,
                situacaoVaga_Id,
                publicadoDiarioOficial,
                municipio_Id: vaga_municipio_Id,
                unidadeLotacao_Id,
              },
              where: {
                id: (
                  await prisma[tableVagas].findFirst({
                    where: {
                      beneficiario_Id: idBeneficiario,
                    },
                    orderBy: {
                      createdAt: "desc",
                    },
                  })
                ).id,
              },
            },
          },
        },
        where: {
          id: idBeneficiario,
        },
        include: {
          vaga: {
            select: {
              id: true,
              createdAt: true,
            },
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),
    ]);
    return queries;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
