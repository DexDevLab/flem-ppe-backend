import { modifyAnexoComunicado } from "controller/comunicados";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação anexos dos comunicados.
 * @method handler
 * @memberof module:comunicados
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "PUT":
      try {
        const { entity, id } = req.query;
        const query = await modifyAnexoComunicado(entity, id, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
