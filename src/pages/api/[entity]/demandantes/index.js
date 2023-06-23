import {
  addDemandante,
  deleteDemandante,
  getDemandantes,
  modifyDemandante,
} from "controller/demandantes";
import _ from "lodash";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de demandantes.
 * @method handler
 * @memberof module:demandantes
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const {
          entity,
          limit,
          municipio_Id,
          escritorioRegional_Id,
          ...filter
        } = req.query;
        const queryFilter = () => {
          if (
            _.isUndefined(municipio_Id) &&
            _.isUndefined(escritorioRegional_Id)
          ) {
            return {
              excluido: false,
              ...filter,
            };
          } else {
            return {
              excluido: false,
              vagas: {
                some: {
                  municipio_Id: _.isUndefined(municipio_Id)
                    ? {}
                    : {
                        in: JSON.parse(municipio_Id),
                      },
                  municipio: _.isUndefined(escritorioRegional_Id)
                    ? {}
                    : {
                        escritorio_RegionalId: {
                          in: JSON.parse(escritorioRegional_Id),
                        },
                      },
                },
              },
            };
          }
        };
        const query = await getDemandantes(
          entity,
          queryFilter(),
          limit,
          municipio_Id,
          escritorioRegional_Id
        );
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const { nome, sigla } = req.body;
        const query = await addDemandante(entity, nome, sigla);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity } = req.query;
        const { nome, sigla, id } = req.body;
        const query = await modifyDemandante(
          entity,
          nome,
          sigla.toUpperCase(),
          id
        );
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deleteDemandante(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
