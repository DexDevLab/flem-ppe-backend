import { modifyEscRegMunicMonit } from "controller/escritorios-regionais";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação do gerenciamento dos escritórios regionais.
 * @method handler
 * @memberof module:escritorios-regionais
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "PUT":
      try {
        const { entity } = req.query;
        const { id, municipios = [], monitores = [] } = req.body;
        const query = await modifyEscRegMunicMonit(
          entity,
          id,
          municipios,
          monitores
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
