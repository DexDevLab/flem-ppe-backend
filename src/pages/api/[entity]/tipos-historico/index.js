import {
  addTipoHistorico,
  deleteTipoHistorico,
  getTiposHistorico,
} from "controller/historicos";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de tipos de histórico.
 * @method handler
 * @memberof module:tipos-historico
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
        const query = await getTiposHistorico(entity, queryFilter, limit);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addTipoHistorico(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deleteTipoHistorico(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        throw exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
