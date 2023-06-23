import { fetchTerritoriosIdentidade } from "controller/ext/territorios-identidade";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler para conexão com API externa para prover dados de territórios de identidade.
 * @method handler
 * @memberof module:ext
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const territorios = await fetchTerritoriosIdentidade();
        return res.status(200).json(territorios);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
