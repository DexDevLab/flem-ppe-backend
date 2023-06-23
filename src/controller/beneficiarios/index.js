import { addRemessa } from "controller/remessas";
import { getSituacoesVaga } from "controller/situacoes-vaga";
import {
  createHistoricoToBenefFromImport,
  createUpsertBenefsFromImport,
  getColumnsIdToImport,
  getDemandMunicEtniaFormacao,
  updateBenefData,
} from "controller/transactions";
import _ from "lodash";
import { DateTime } from "luxon";
import { celularMask } from "masks-br";
import { prisma } from "services";
import { axios, filesAPIService } from "services/apiService";
import { queryComposer } from "services/prisma/queryComposer";
import { maskCPF, maskCapitalize, normalizeString } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de beneficiários.
 * @method getBeneficiarios
 * @memberof module:beneficiarios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export async function getBeneficiarios(entity, filter, limit) {
  try {
    const table = `${entity}_Beneficiarios`;
    if (!_.isEmpty(filter)) {
      const query = await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        include: {
          acoes: true,
          contatosAcoes: true,
          eventos: true,
          eventosListaPresenca: true,
          materiais: true,
          comunicados: true,
          enviosComunicados: true,
          oficios: true,
          enviosOficios: true,
          documentos: {
            orderBy: {
              createdAt: "desc",
            },
          },
          contatos: true,
          vaga: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              demandante: true,
              municipio: {
                include: {
                  escritorioRegional: true,
                  territorioIdentidade: true,
                },
              },
              situacaoVaga: {
                include: {
                  tipoSituacao: true,
                },
              },
              remessaSec: true,
            },
          },
          etnia: true,
          materiaisEntregues: {
            include: {
              tamanhoEntregue: true,
              tipo: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          tamanhoUniforme: true,
          formacao: true,
          pendencias: true,
          historico: {
            include: {
              tipoHistorico: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: {
          ...queryComposer(filter),
        },
        orderBy: [
          {
            nome: "asc",
          },
        ],
      });
      return query;
    } else {
      const query = await prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          excluido: false,
        },
        include: {
          acoes: true,
          contatosAcoes: true,
          eventos: true,
          eventosListaPresenca: true,
          materiais: true,
          comunicados: true,
          enviosComunicados: true,
          oficios: true,
          enviosOficios: true,
          documentos: {
            orderBy: {
              createdAt: "desc",
            },
          },
          contatos: true,
          vaga: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              demandante: true,
              municipio: {
                include: {
                  escritorioRegional: true,
                  territorioIdentidade: true,
                },
              },
              situacaoVaga: {
                include: {
                  tipoSituacao: true,
                },
              },
              remessaSec: true,
            },
          },
          etnia: true,
          materiaisEntregues: {
            include: {
              tamanhoEntregue: true,
              tipo: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          tamanhoUniforme: true,
          formacao: true,
          pendencias: true,
          historico: {
            include: {
              tipoHistorico: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: [
          {
            nome: "asc",
          },
        ],
      });
      return query;
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Adiciona Beneficiários por um lote de fornecimento.
 * @method addBeneficiariosByLote
 * @memberof module:beneficiarios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} numRemessa número da remessa
 * @param {Object} dataRemessa data da remessa
 * @param {Object} benef dados do Beneficiário
 * @param {Object} fileDetails dados do arquivo
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addBeneficiariosByLote(
  entity,
  numRemessa,
  dataRemessa,
  benef,
  fileDetails
) {
  try {
    const remessaCreate = await addRemessa(
      entity,
      numRemessa,
      dataRemessa,
      fileDetails
    );

    const dataToImport = benef.map(
      async ({
        demandante,
        municipioDaVaga,
        cursoDeFormacao,
        raca_cor,
        ...rest
      }) => {
        const [demandanteId, municipioVagaId, cursoFormacaoId, etniaId] =
          await getColumnsIdToImport(
            entity,
            demandante,
            municipioDaVaga,
            cursoDeFormacao,
            raca_cor
          );

        Object.keys(rest).forEach((key) => {
          if (rest[key] === "" || rest[key] == null) {
            rest[key] = null;
          }
        });

        return {
          demandanteId,
          municipioVagaId,
          cursoFormacaoId,
          etniaId,
          ...rest,
        };
      }
    );

    const situacaoDefault = await getSituacoesVaga(entity, {
      ["nome"]: "Realizar Contato",
    });

    const benefsToCreate = (await Promise.all(dataToImport)).map((benef) => ({
      nome: benef.nome,
      matriculaSec: benef.matricula.toString(),
      cpf: benef.cpfAluno,
      dataNasc: DateTime.fromFormat(
        benef.dataDeNascimento,
        "dd/MM/yyyy"
      ).toISO(),
      escolaConclusao: benef.nomeDoColegio,
      sexo: maskCapitalize(benef.sexo),
      formacao_Id: benef.cursoFormacaoId,
      etnia_Id: benef.etniaId,
      municipio: benef.municipioDoAluno,
      contatos: {
        createMany: {
          data: [benef.telefone01, benef.telefone02]
            .filter((contato) => contato)
            .map((contato) => ({
              contato: celularMask(contato),
              tipoContato_Id: "telefone",
            })),
        },
      },
      vaga: {
        create: {
          demandante_Id: benef.demandanteId,
          dataConvocacao: DateTime.fromFormat(
            benef.dataDaConvocacao,
            "dd/MM/yyyy"
          ).toISO(),
          situacaoVaga_Id: situacaoDefault[0].id,
          municipio_Id: benef.municipioVagaId,
          remessaSec_Id: remessaCreate.id,
        },
      },
    }));

    const query = await createUpsertBenefsFromImport(entity, benefsToCreate);

    const historico = await createHistoricoToBenefFromImport(
      entity,
      remessaCreate,
      numRemessa,
      query
    );

    const fileIndex = await filesAPIService.patch(
      `/indexFile`,
      { referenceObj: remessaCreate },
      {
        params: { fileId: fileDetails.id },
      }
    );

    return { query, historico };
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Modifica Beneficiários e seus dados.
 * @method modifyBeneficiarios
 * @memberof module:beneficiarios
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
export async function modifyBeneficiarios(
  entity,
  idBeneficiario,
  dadosBeneficiario
) {
  try {
    Object.keys(dadosBeneficiario).forEach((key) => {
      if (dadosBeneficiario[key] === "" || dadosBeneficiario[key] == null) {
        dadosBeneficiario[key] = null;
      }
      if (dadosBeneficiario[key] === undefined) {
        delete dadosBeneficiario[key];
      }
    });

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

    const tableHistorico = `${entity}_Historico`;
    const tableSituacoesVaga = `${entity}_Situacoes_Vaga`;

    const [queryDocumento, queryMaterial, queryHistorico, ...restQuery] =
      await updateBenefData(entity, idBeneficiario, dadosBeneficiario);

    const vagaId = restQuery.reverse()[0].vaga.pop().id;

    if (queryMaterial.id) {
      await prisma[tableHistorico].create({
        data: {
          // categoria: "Entrega de Material",
          descricao: `Entrega do material: ${queryMaterial.tipo.nome}, tamanho: ${queryMaterial.tamanhoEntregue.tamanho}, qtd.: ${queryMaterial.quantidade}`,
          beneficiario: {
            connect: {
              id: queryMaterial.beneficiarios_Id,
            },
          },
          materialEntregue: {
            connect: {
              id: queryMaterial.id,
            },
          },
          tipoHistorico_Id: (
            await getTiposHistorico(entity, { nome: "Entrega de Material" }, 1)
          )[0].id,
        },
      });
    }

    if (queryDocumento.id) {
      await filesAPIService.patch(
        `/indexFile`,
        { referenceObj: queryDocumento },
        {
          params: { fileId: anexos.id },
        }
      );
      await prisma[tableHistorico].create({
        data: {
          descricao: `Incluído novo documento: ${descricaoDocumento}`,
          beneficiario: {
            connect: {
              id: idBeneficiario,
            },
          },
          sigiloso: queryDocumento.sigiloso,
          documentos: {
            connect: {
              id: queryDocumento.id,
            },
          },
          tipoHistorico_Id: (
            await getTiposHistorico(
              entity,
              {
                nome: queryDocumento.sigiloso
                  ? "Documento Sigiloso"
                  : "Documento",
              },
              1
            )
          )[0].id,
        },
      });
    }

    if (JSON.parse(situacaoVagaHasChanged)) {
      await prisma[tableHistorico].create({
        data: {
          descricao: `Alterado situação da vaga do beneficiário. Nova situação: ${
            (
              await prisma[tableSituacoesVaga].findFirst({
                where: {
                  id: situacaoVaga_Id,
                },
              })
            ).nome
          }`,
          beneficiario: {
            connect: {
              id: idBeneficiario,
            },
          },
          vaga: {
            connect: {
              id: vagaId,
            },
          },
          situacaoVaga: {
            connect: {
              id: situacaoVaga_Id,
            },
          },
          tipoHistorico_Id: (
            await getTiposHistorico(
              entity,
              {
                nome: queryDocumento.sigiloso
                  ? "Documento Sigiloso"
                  : "Documento",
              },
              1
            )
          )[0].id,
        },
      });
    }

    return { queryDocumento, queryMaterial, queryHistorico };
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Pela Regra de Negócio, beneficiários com status de vaga
 * diferente de ATIVO, não são incluídos no BD. Beneficiários
 * sem registro encontrado são incluídos no BD. Beneficiários
 * com status igual a ATIVO são desprezados.
 *
 * Essa função localiza beneficiários por matrícula e/ou por
 * CPF dentro dos sistemas legado. Para que a implementação
 * de validação de campos pudesse ser testada, foi necessário
 * fazer com que a aplicação procurasse por uma lista de
 * beneficiários em um BD já populado.
 *
 * Desse modo, poderia ser verificado se o beneficiário
 * informado constava no sistema, se sua entrada na importação
 * estaria apta para sobrescrever os dados antigos ou, se os
 * dados, por já constarem, deveriam ser descartados.
 *
 * Caso encontre uma matrícula que coincida com alguma informada
 * dentro do BD, verifica se o nome é o mesmo, a fim de prevenir
 * erros de digitação na planilha de importação. Se a matrícula e
 * o nome forem os mesmos, marca como "item.found". Se não forem os
 * mesmos, marcam com * os campos de nome, matrícula e CPF para que
 * o colaborador valide e verifique se existe alguma informação que
 * foi colocada equivocadamente. Se o status da vaga daquele
 * beneficiário não é "ativo", marca como "item.update". Se o
 * beneficiário da lista na planilha não for encontrado nem pela
 * sua matrícula e nem pelo seu CPF, é marcado como FALSE em "item.found",
 * e marcado como FALSE em "item.update". Valores de CPF nulos são
 * marcados como uma String com 0 de comprimento ("").
 *
 * @param {Boolean} bdLegado se a função deverá procurar do BD
 * legado ou não
 * @param {String} entity a entidade do Projeto (Bahia, Tocantins etc).
 * A entidade é provida pela query string da URL da API, em [entity]
 * @param {Object} sheet a planilha pré-formatada, com suas colunas e linhas
 * @returns {Object} Objeto contendo os beneficiários encontrados ativos
 * (que são ignorados), não-ativos (que atualizam o BD)  e beneficiários não
 * encontrados (que devem alimentar o BD)."item.found" indica se foi encontrado
 * no BD, seja por matrícula ou por CPF; "item.update" indica se deve ser atualizado,
 * ou seja, se os dados recebidos na planilha irão sobrescrever a
 * base de dados (exceto nome e matrícula).
 */
export async function benefCheckBd(bdLegado, entity, sheet) {
  try {
    const sheets = bdLegado ? Object.values(sheet["Plan1"]) : sheet;
    const matriculas = [];
    const cpfs = [];
    sheets.forEach((item) => {
      if (item.matricula) {
        matriculas.push(item.matricula.toString());
      }
      if (item.cpfAluno) {
        cpfs.push(maskCPF(item.cpfAluno));
      }
    });
    const respQuery = [];
    if (bdLegado) {
      const urlAPIQuery = `${
        process.env.NEXT_PUBLIC_API_PPE_BD_LEGADO
      }/${entity}/beneficiarios?condition=OR${
        matriculas.length ? `&matriculaSAEB=["${matriculas.join('","')}"]` : ""
      }${cpfs.length ? `&cpf=["${cpfs.join('","')}"]` : ""}`;
      respQuery.push(await axios.get(urlAPIQuery));
    } else {
      const filter = {
        condition: "OR",
        matriculaSec: matriculas,
        cpf: cpfs,
      };
      const result = await getBeneficiarios(entity, filter);
      respQuery.push(result);
    }

    return await Promise.all(
      sheets.map(async (item) => {
        const respQueryData = bdLegado ? respQuery[0].data.query : respQuery[0];
        respQueryData.forEach((resp) => {
          // PROPRIEDADES ENCONTRADAS NO BANCO
          const respData = {
            matriculaSec:
              bdLegado && entity === "ba"
                ? resp.matriculaSAEB
                : resp.matriculaSec,
            nome: normalizeString(true, resp.nome),
            situacao: bdLegado
              ? resp.Vaga[0].Situacao.nome
              : resp.vaga[0].situacaoVaga.nome,
            cpf: maskCPF(JSON.stringify(resp.cpf)),
          };

          // FORMATANDO NOME DO OBJETO A VALIDAR
          item.nome = normalizeString(true, item.nome);

          // FORMATANDO CPF DO OBJETO A VALIDAR
          if (item.cpfAluno) {
            item.cpfAluno = maskCPF(JSON.stringify(item.cpfAluno));
          }

          //PROCURA BENEFICIÁRIO PELA MATRÍCULA DA SECRETARIA
          if (item.matricula) {
            if (respData.matriculaSec.localeCompare(item.matricula) === 0) {
              /**
               * VERIFICA SE O NOME DO BENEFICIÁRIO É IGUAL AO QUE CONSTA NO BD.
               * EM CASOS ONDE HOUVE UMA MUDANÇA DE NOME (EX. CASAMENTOS E DIVÓRCIOS),
               * O COLABORADOR DEVE ALTERAR O NOME, INSERINDO O NOME CONSTANTE NO BD
               * (PODE SER FEITO POR CONSULTA NA TELA DE BENEFICIÁRIO) E DEPOIS O NOME
               * DEVE SER ALTERADO VIA CONTATO DA CR
               *  */
              if (respData.nome === item.nome) {
                if (normalizeString(false, respData.situacao) !== "ativo") {
                  item.found = true;
                  item.update = true;
                  item.situacao = respData.situacao;
                } else {
                  item.found = true;
                  item.update = false;
                  item.situacao = respData.situacao;
                }
              } else {
                item.nome = `*${item.nome}`;
                item.matricula = `*${item.matricula}`;
              }
            }
          } else {
            if (entity === "ba") {
              item.matricula = "*";
            }
          }

          //PROCURA BENEFICIÁRIO PELO CPF
          if (item.cpfAluno) {
            if (respData.cpf.localeCompare(item.cpfAluno) === 0) {
              /**
               * VERIFICA SE O NOME DO BENEFICIÁRIO É IGUAL AO QUE CONSTA NO BD.
               * EM CASOS ONDE HOUVE UMA MUDANÇA DE NOME (EX. CASAMENTOS E DIVÓRCIOS),
               * O COLABORADOR DEVE ALTERAR O NOME, INSERINDO O NOME CONSTANTE NO BD
               * (PODE SER FEITO POR CONSULTA NA TELA DE BENEFICIÁRIO) E DEPOIS O NOME
               * DEVE SER ALTERADO VIA CONTATO DA CR
               *  */
              if (respData.nome === item.nome) {
                /**
                 * VERIFICA SE A SITUAÇÃO DO BENEFICIÁRIO ENCONTRADO É "ATIVO". SE TIVER
                 * QUALQUER STATUS DIFERENTE DE "ATIVO", O ALGORITMO MARCA PARA ATUALIZAR
                 * O BANCO DE DADOS COM OS VALORES DA PLANILHA
                 */
                if (normalizeString(false, respData.situacao) !== "ativo") {
                  item.found = true;
                  item.update = true;
                  item.situacao = respData.situacao;
                } else {
                  item.found = true;
                  item.update = false;
                  item.situacao = respData.situacao;
                }
              } else {
                item.nome = `*${item.nome}`;
                item.cpfAluno = `*${item.cpfAluno}`;
              }
            }
          } else {
            item.cpfAluno = "";
          }
          //MARCA COMO FALSE AUTOMATICAMENTE QUEM NÃO FOI VALIDADO PELA PROCURA NO BD
          if (!item.found) {
            item.found = false;
          }
          if (!item.update) {
            item.update = false;
          }
        });
        return { ...item };
      })
    );
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Realiza a validação dos dados contidos na planilha de importação ou uma série de dados.
 * @param {String} entity a entidade do Projeto (Bahia, Tocantins etc). A entidade é provida pela query
 * string da URL da API, em [entity]
 * @param {Object} sheet Objeto contendo os dados que haviam na planilha de importação
 * @returns um Objeto com os dados da planilha já devidamente formatados e normalizados.
 */
export async function benefValidate(entity, sheet) {
  try {
    const [demandantes, municipios, etnias, formacoes] =
      await getDemandMunicEtniaFormacao(entity);
    const listaDemand = demandantes;
    const listaMunic = municipios;
    const listaEtnia = etnias;
    const listaFormacao = formacoes;

    return await Promise.all(
      sheet.map(async (item) => {
        if (!item.found || item.update) {
          //VERIFICA DEMANDANTE PELA SIGLA OU PELO SEU NOME. DEMANDANTES SEM SIGLA NÃO SÃO ACEITOS.
          for (let i = 0; i < listaDemand.length; i++) {
            const itemSiglaListaDemand = listaDemand[i].sigla;
            const itemDemandListaDemand = listaDemand[i].nome;
            // VERIFICA SE O DEMANDANTE CONTÉM SIGLA
            if (item.demandante.includes("-")) {
              const itemDemand = item.demandante.trim().split("-");

              if (
                normalizeString(true, itemSiglaListaDemand) ===
                normalizeString(true, itemDemand[0])
              ) {
                //SE A SIGLA FOR ENCONTRADA, RETORNA OS VALORES CONFORME FORMATADO NA API
                item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
                break;
              }
              // VERIFICA SE O NOME DO DEMANDANTE É IGUAL COM O DA API
              if (
                normalizeString(true, itemDemandListaDemand) ===
                normalizeString(true, itemDemand[1])
              ) {
                // SE O NOME DO DEMANDANTE FOR IGUAL, RETORNA OS VALORES CONFORME FORMATADO NA API
                item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
                break;
              }
            }
            // VERIFICA O DEMANDANTE PELO NOME, MESMO SE NÃO CONTÉM SIGLA
            if (
              normalizeString(true, itemDemandListaDemand) ===
              normalizeString(true, item.demandante)
            ) {
              // SE O NOME DO DEMANDANTE FOR IGUAL, RETORNA OS VALORES CONFORME FORMATADO NA API
              item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaDemand.length - 1) {
              item.demandante = `*${item.demandante}`;
              break;
            }
          }

          // VERIFICA MUNICÍPIO DA VAGA
          for (let i = 0; i < listaMunic.length; i++) {
            const itemListaMunic = listaMunic[i].nome;
            // VERIFICA SE O MUNICÍPIO INFORMADO É IGUAL AO LISTADO NA API
            if (
              normalizeString(true, itemListaMunic) ===
              normalizeString(true, item.municipioDaVaga)
            ) {
              //SE SIM, FORMATA CONFORME O DA API
              item.municipioDaVaga = itemListaMunic;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaMunic.length - 1) {
              item.municipioDaVaga = `*${item.municipioDaVaga}`;
              break;
            }
          }

          // VERIFICA MUNICÍPIO DO ALUNO
          for (let i = 0; i < listaMunic.length; i++) {
            const itemListaMunic = listaMunic[i].nome;
            if (
              normalizeString(true, itemListaMunic) ===
              normalizeString(true, item.municipioDoAluno)
            ) {
              item.municipioDoAluno = itemListaMunic;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaMunic.length - 1) {
              item.municipioDoAluno = `*${item.municipioDoAluno}`;
              break;
            }
          }

          // VERIFICA O CURSO DE FORMAÇÃO
          for (let i = 0; i < listaFormacao.length; i++) {
            const itemListaFormacao = listaFormacao[i].nome;
            if (
              normalizeString(true, item.cursoDeFormacao) ===
              normalizeString(true, itemListaFormacao)
            ) {
              item.cursoDeFormacao = itemListaFormacao;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaFormacao.length - 1) {
              item.cursoDeFormacao = `*${item.cursoDeFormacao}`;
              break;
            }
          }

          // VALIDA E FORMATA ETNIA
          for (let i = 0; i < listaEtnia.length; i++) {
            const itemListaEtnia = listaEtnia[i].etnia;
            // VERIFICA SE A ETNIA INFORMADA NÃO É NULA OU EM BRANCO
            if (item.raca_cor !== "" && item.raca_cor) {
              if (
                normalizeString(true, item.raca_cor) ===
                normalizeString(true, itemListaEtnia)
              ) {
                //SE A ETNIA FOR IGUAL A INFORMADA PELO BD, APLICA A DO BD
                item.raca_cor = itemListaEtnia;
                break;
              }
              // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
              if (i === listaEtnia.length - 1) {
                item.raca_cor = `*${item.raca_cor}`;
                break;
              }
            }
            // SE A ETNIA É NULA OU EM BRANCO, RETORNA COMO "NÃO INFORMADA"
            else {
              item.raca_cor = listaEtnia.find(
                ({ etnia }) => etnia === "Não Informada"
              ).etnia;
              break;
            }
          }

          // FORMATA NOME DA INSTITUIÇÃO
          item.nomeDoColegio = maskCapitalize(item.nomeDoColegio);

          //FORMATA SEXO
          item.sexo = maskCapitalize(item.sexo);

          //FORMATA NOME
          item.nome = maskCapitalize(item.nome);
        }

        return item;
      })
    );
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}


/**
 * Função que realiza uma tripla validação:
 * Primeiro, recebe os dados da planilha (parâmetro 'body'), o qual vem por um
 * corpo de formulário.
 * Esses dados são verificados no BD legado para encontrar beneficiários já
 * cadastrados. Os mesmos são sinalizados, caso sejam encontrados e/ou se precisam
 * ser atualizados com os dados informados.
 * Após isso, verifica no BD do Portal PPE da mesma forma.
 * No fim, alinha e sanitiza todos os dados em benefValidate.
 * @method validarPendenciasImport
 * @memberof module:beneficiarios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} body estrutura de dados contendo as informações utilizadas na
 * validação.
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function validarPendenciasImport(entity, body) {
  try {
    const bdCheckLegado = await benefCheckBd(true, entity, { Plan1: body });
    const bdCheck = await benefCheckBd(false, entity, bdCheckLegado);
    const output = await benefValidate(entity, bdCheck);
    return output;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}

/**
 * Fornece a listagem de contatos dos beneficiários.
 * @method getContatosBeneficiarios
 * @memberof module:beneficiarios
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} filter Critério de pesquisa para detalhamento da query, onde os
 * critérios de pesquisa aceitos são os parâmetros possíveis no método queryComposer.
 * @param {Number} limit limita a quantidade de resultados na pesquisa. Por questões
 * de performance, em queries longas é sugerido usar limit como '1' quando se deseja
 * obter apenas 1 (ou o primeiro) resultado.
 * @returns {Object} Objeto contendo um Array de resultados. Ao usar 'limit',
 * selecionar o índice zero no objeto ([0]) para obter o valor adequado.
 */
export function getContatosBeneficiarios(entity, filter, limit) {
  try {
    const table = `${entity}_Beneficiarios`;
    if (!_.isEmpty(filter)) {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
        where: {
          ...queryComposer(filter),
        },
      });
    } else {
      return prisma[table].findMany({
        take: _.isUndefined(limit) ? undefined : parseInt(limit),
      });
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
