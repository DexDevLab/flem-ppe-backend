import { bdRhService } from "services/apiService";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Conecta com API externa para prover lista de funcionários FLEM.
 * @method getFuncionarios
 * @memberof module:funcionarios
 * @param {Object} params a lista de parâmetros necessários para a busca,
 * os quais refletem em critérios de pesquisa definidos.
 * @returns {Object} Objeto contendo um Array de resultados.
 */
export async function getFuncionarios(params) {
  try {
    const result = await bdRhService.get("funcionarios", {
      params,
    });
    return result.data;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
