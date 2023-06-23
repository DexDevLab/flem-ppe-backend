import {
  addMonitor,
  deleteMonitor,
  getMonitores,
  modifyMonitor,
} from "controller/monitores";
import _ from "lodash";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de monitores.
 * @method handler
 * @memberof module:monitores
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
          demandante_Id,
          ...filter
        } = req.query;
        const queryFilter = () => {
          if (
            _.isUndefined(municipio_Id) &&
            _.isUndefined(escritorioRegional_Id) &&
            _.isUndefined(demandante_Id)
          ) {
            return {
              excluido: false,
              ...filter,
            };
          } else {
            return {
              excluido: false,
              escritoriosRegionais: {
                some: {
                  id: _.isUndefined(escritorioRegional_Id)
                    ? {}
                    : {
                        in: JSON.parse(escritorioRegional_Id),
                      },
                  municipios: _.isUndefined(municipio_Id)
                    ? {}
                    : {
                        some: {
                          id: {
                            in: JSON.parse(municipio_Id),
                          },
                        },
                      },
                },
              },
              demandantes: _.isUndefined(demandante_Id)
                ? {}
                : {
                    some: {
                      id: _.isUndefined(demandante_Id)
                        ? {}
                        : {
                            in: JSON.parse(demandante_Id),
                          },
                    },
                  },
            };
          }
        };
        const query = await getMonitores(
          entity,
          queryFilter(),
          limit,
          municipio_Id,
          escritorioRegional_Id,
          demandante_Id
        );
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "POST":
      try {
        const { entity } = req.query;
        const query = await addMonitor(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "PUT":
      try {
        const { entity } = req.query;
        const query = await modifyMonitor(entity, req.body);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    case "DELETE":
      try {
        const { entity, id } = req.query;
        const query = await deleteMonitor(entity, id);
        return res.status(200).json(query);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
