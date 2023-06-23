import { getNetworkTime } from "controller/ext/time-ntp";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler para conexão com API externa para prover dados de data e hora locais.
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
        const date = await getNetworkTime();
        return res.status(200).json(date);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
