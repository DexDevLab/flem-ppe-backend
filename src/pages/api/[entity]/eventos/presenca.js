import { addLocalEvento, addPresencaBenefEvento, getLocaisEventos } from "controller/eventos";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";


/**
 * Handler de manipulação de presença à eventos.
 * @method handler
 * @memberof module:eventos
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
 const handler = async (req, res) => {
    switch (req.method) {
      case "POST":
        try {
          const { entity } = req.query;
          const query = await addPresencaBenefEvento(entity, req.body);
          return res.status(200).json(query);
        } catch (e) {
          return exceptionHandler(e, res);
        }
      default:
        return exceptionHandler(null, res);
    }
  };
  
  export default allowCors(handler);