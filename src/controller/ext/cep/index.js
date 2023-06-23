import axios from "axios";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Controller que provê os dados de endereço conforme um CEP.
 * Consulta uma API externa para prover os dados desejados.
 * @method fetchCep
 * @memberof module:ext
 * @param {Object} cep o CEP da localidade. Aceita formatos de
 * 12345000 ou 123.456.789-00
 * @returns Objeto JSON contendo os seguintes parâmetros: cep,
 * state(Estado), city (Cidade), neighborhood (Bairro),
 * street (Rua), service (Serviço de Localização),
 * location (localização e coordenadas do CEP)
 */
export async function fetchCep(cep) {
  try {
    // API DOS CORREIOS PARA APONTAMENTO DO CEP
    const url = `${process.env.NEXT_PUBLIC_API_CEP}/${cep}`;
    const { data } = await axios.get(url);
    return data;
  } catch (e) {
    throw exceptionHandler(e, 0);
  }
}
