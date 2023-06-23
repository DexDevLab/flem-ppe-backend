import {
  addEvento,
  deleteEvento,
  getEventos,
  modifyEvento,
} from "controller/eventos";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de dados de eventos.
 * @method handler
 * @memberof module:eventos
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const { entity, limit, ...filter } = req.query;
        const queryFilter = {
          excluido: false,
          ...filter,
        };
        const query = await getEventos(entity, queryFilter, limit);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addEvento(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity } = req.query;
        const query = await modifyEvento(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deleteEvento(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
