import { addLocalEvento, addTipoEvento, getLocaisEventos, getTiposEventos } from "controller/eventos";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";


/**
 * Handler de manipulação de tipos de eventos.
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
          const query = await getTiposEventos(entity, queryFilter, limit);
          return res.status(200).json(query);
        } catch (e) {
          return exceptionHandler(e, res);
        }
      case "POST":
        try {
          const { entity } = req.query;
          const { nome } = req.body;
          const query = await addTipoEvento(entity, nome);
          return res.status(200).json(query);
        } catch (e) {
          return exceptionHandler(e, res);
        }
      default:
        return exceptionHandler(null, res);
    }
  };
  
  export default allowCors(handler);