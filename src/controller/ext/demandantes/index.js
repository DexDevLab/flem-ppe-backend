import axios from "axios";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Controller que lista os Demandantes baseado no Estado (ou na entity).
 * Consulta uma API externa para prover os dados desejados. Este controller
 * é utilizado para testes; o de Produção deve utilizar uma consulta via BD.
 * @method fetchDemandantes
 * @memberof module:ext
 * @param {String} entity a entidade do Projeto (Bahia, Tocantins etc).
 * A entidade é provida pela query string da URL da API, em [entity]
 * @returns Objeto JSON contendo a sigla do Demandante e o nome do Demandante
 */
export async function fetchDemandantes(entity) {
  try {
    switch (entity) {
      case "ba": {
        // API DE DEMANDANTES DA SECRETARIA DO GOVERNO DO ESTADO DA BAHIA
        const url = `${process.env.NEXT_PUBLIC_API_DEMAND_BA}`;
        const fetch = await axios.get(url);
        const data = fetch.data.map((item) => {
          return {
            sigla: item.sigla,
            demandante: item.nome,
          };
        });
        return data;
      }
      default:
        return exceptionHandler(null, res);
    }
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
