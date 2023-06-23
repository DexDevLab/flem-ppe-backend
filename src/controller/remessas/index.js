import { DateTime } from "luxon";
import { prisma } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Adiciona uma nova remessa de beneficiários à listagem de remessas.
 * @method addRemessa
 * @memberof module:remessas
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {Object} dadosRemessa detalhes da remessa:
 *
 *  numRemessa - número da remessa
 *
 *  dataRemessa - data da remessa
 *
 *  fileDetails - informação do arquivo utilizado para importação
 *
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function addRemessa(entity, numRemessa, dataRemessa, fileDetails) {
  try {
    const table = `${entity}_RemessaSec`;
    const query = await prisma[table].create({
      data: {
        remessa: parseInt(numRemessa),
        data_remessa: DateTime.fromSQL(dataRemessa).toISO(),
        arquivo_importacao: fileDetails.id,
      },
    });
    return query;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
