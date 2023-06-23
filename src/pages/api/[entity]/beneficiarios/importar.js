import { addBeneficiariosByLote } from "controller/beneficiarios";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de dados durante o processo de importação
 * de beneficiários.
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
        const query = await getBeneficiarios(entity, filter, limit);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const { numRemessa, dataRemessa, benef, fileDetails } = req.body;
        const query = await addBeneficiariosByLote(
          entity,
          numRemessa,
          dataRemessa,
          benef,
          fileDetails
        );
        return res.status(200).json({ query });
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
