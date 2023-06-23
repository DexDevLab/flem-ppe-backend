import { validarPendenciasImport } from "controller/beneficiarios";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação da validação de pendências durante
 * o processo de importação
 * @method handler
 * @memberof module:sheets
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "PATCH":
      const { entity } = req.query;
      const query = await validarPendenciasImport(entity, req.body);
      return res.status(200).send(query);
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
