import axios from "axios";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Controller que lista os Municípios baseado no Estado (ou na entity).
 * Consulta uma API externa para prover os dados desejados. Este controller
 * é utilizado para testes; o de Produção deve utilizar uma consulta via BD.
 * @method fetchMunicipios
 * @memberof module:ext
 * @param {String} entity a entidade do Projeto (Bahia, Tocantins etc).
 * A entidade é provida pela query string da URL da API, em [entity]
 * @returns {Object} Objeto contendo informações do resultado.
 */
export async function fetchMunicipios(entity) {
  try {
    // API DO IBGE PARA MUNICÍPIOS E REGIÕES METROPOLITANAS
    const url = `${process.env.NEXT_PUBLIC_API_MUNIC}/${entity}/municipios`;
    const data = await axios.get(url);
    return data;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
