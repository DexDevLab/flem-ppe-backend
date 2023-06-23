import { getDashboardMonitoramento } from "controller/dashboard";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de monitoramenntos a serem exibidos na dashboard.
 * @method handler
 * @memberof module:monitoramentos
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const {periodoMonitoramento, ...queryParams} = req.query;
        const query = await getDashboardMonitoramento(periodoMonitoramento, queryParams);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
