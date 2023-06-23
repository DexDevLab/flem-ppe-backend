import { addOficioToEnvio } from "controller/oficios";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de ofícios direcionados à lista de envio.
 * @method handler
 * @memberof module:oficios
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addOficioToEnvio(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
