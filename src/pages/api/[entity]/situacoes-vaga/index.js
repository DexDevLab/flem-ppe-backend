import {
  addSituacaoVaga,
  deleteSituacaoVaga,
  getSituacoesVaga,
  modifySituacaoVaga,
} from "controller/situacoes-vaga";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de situações de vaga.
 * @method handler
 * @memberof module:situacoes-vaga
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
        const query = await getSituacoesVaga(entity, queryFilter, limit);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const { situacao, tipo } = req.body;
        const query = await addSituacaoVaga(entity, situacao, tipo);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity } = req.query;
        const query = await modifySituacaoVaga(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deleteSituacaoVaga(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
