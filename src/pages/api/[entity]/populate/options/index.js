import { getOptionsForBenef } from "controller/options/populate";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Popula os itens disponíveis dentro do componente de Select
 * para a lista de beneficiários durante o processo de importação,
 * onde os dados são validados e corrigidos.
 * Realiza consulta ao BD para fornecer essas informações.
 * @method handler
 * @memberof module:options
 * @param {Object} req HTTP request.
 * @param {Object} res HTTP response
 * @returns HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const { entity } = req.query;
        const [demandantes, municipios, etnias, formacoes] =
          await getOptionsForBenef(entity);
        return res
          .status(200)
          .json({ query: { demandantes, municipios, etnias, formacoes } });
        } catch (e) {
          return exceptionHandler(e, res);
        }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
