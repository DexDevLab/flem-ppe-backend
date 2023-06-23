import {
  addPontoFocal,
  deletePontoFocal,
  getPontosFocais,
  modifyPontoFocal,
} from "controller/unidades-lotacao";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de pontos focais das unidades de lotação.
 * @method handler
 * @memberof module:unidades-lotacao
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
        const query = await getPontosFocais(entity, queryFilter, limit);
        return res.status(200).json(query);
      } catch (e) {
        throw exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addPontoFocal(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        throw exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity, idPontoFocal } = req.query;
        const query = await modifyPontoFocal(entity, idPontoFocal, req.body);
        return res.status(200).json(query);
      } catch (e) {
        throw exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deletePontoFocal(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        throw exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
