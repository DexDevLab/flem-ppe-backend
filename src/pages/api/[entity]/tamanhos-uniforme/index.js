import { getTamanhoUniforme } from "controller/tamanhos-uniforme";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de tamanhos de uniforme.
 * @method handler
 * @memberof module:tamanhos-uniforme
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
        const query = await getTamanhoUniforme(entity, queryFilter, limit);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
