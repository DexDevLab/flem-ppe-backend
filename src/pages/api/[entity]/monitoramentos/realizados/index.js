import { getBeneficiarios, patchBeneficiarios } from "controller/beneficiarios";
import { getDashboardEventos, getDashboardFormacoes } from "controller/dashboard";
import { getInfoMonitoramentosRealizados } from "controller/monitoramentos";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de dados de monitoramentos realizados.
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
        const { entity, id, demandanteId, dataInicio, dataFim } = req.query;
        const query = await getInfoMonitoramentosRealizados(entity, id, demandanteId, dataInicio, dataFim);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
