import { getBeneficiarios, patchBeneficiarios } from "controller/beneficiarios";
import { getDashboardEventos, getDashboardFormacoes, getDashboardTerritoriosIdentidade } from "controller/dashboard";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de dados de território de identidade para exibição
 * no dashboard.
 * @method handler
 * @memberof module:territorios-identidade
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const query = await getDashboardTerritoriosIdentidade(req.query);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
