import {
  getBeneficiarios,
  modifyBeneficiarios,
} from "controller/beneficiarios";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de beneficiários pelo ID.
 * @method handler
 * @memberof module:beneficiarios
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
        const query = await getBeneficiarios(entity, queryFilter, limit);
        return res.status(200).json(query[0]);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity, idBeneficiario } = req.query;
        const query = await modifyBeneficiarios(
          entity,
          idBeneficiario,
          req.body
        );
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
