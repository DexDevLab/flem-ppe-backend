import { getDemandMunicEtniaFormacao } from "controller/transactions";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Fornece a listagem de Demandantes, Municípios, Etnias e Formações.
 * @method getOptionsForBenef
 * @memberof module:populate
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getOptionsForBenef(entity) {
  try {
    return await getDemandMunicEtniaFormacao(entity);
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
