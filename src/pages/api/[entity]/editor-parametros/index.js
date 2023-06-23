import { getEditorParametros } from "controller/editor-parametros";
import { allowCors } from "services";

/**
 * Handler de manipulação de parâmetros do editor de email e de texto.
 * @method handler
 * @memberof module:editor-parametros
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      const { entity, limit, ...filter } = req.query;
      const queryFilter = {
        excluido: false,
        ...filter,
      };
      const query = await getEditorParametros(entity, queryFilter, limit);
      return res.status(200).json(query);
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
