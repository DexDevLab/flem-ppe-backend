import {
  addContatoAcaoCr,
  getContatoAcoesCr,
  modifyContatoAcaoCr,
} from "controller/fila-acoes";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação da fila de ações da CR.
 * @method handler
 * @memberof module:fila-acoes
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const { entity } = req.query;
        const query = await getContatoAcoesCr(entity);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addContatoAcaoCr(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity } = req.query;
        const query = await modifyContatoAcaoCr(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
