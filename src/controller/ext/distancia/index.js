import { Client } from "@googlemaps/google-maps-services-js";
import _ from "lodash";
import { exceptionHandler } from "utils/exceptionHandler";
const maps = new Client({});

/**
 * Fornece a distância entre dois pontos, entre o município da vaga e o
 * município de residência do beneficiário.
 * @method getDistancia
 * @memberof module:ext
 * @param {String} origem Localidade de origem
 * @param {String} destino localidade de destino
 * @returns {Object} Objeto contendo informações do resultado.
 */
export async function getDistancia(origem, destino) {
  try {
    if (!origem || !destino) return ["error"];
    if (
      _.isUndefined(process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_KEY) ||
      _.isNull(process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_KEY) ||
      process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_KEY.length < 1
    ) {
      return {
        distance: {
          text: "INDISPONÍVEL",
          value: 0,
        },
        duration: {
          text: "1 min",
          value: 0,
        },
        status: "OK",
      };
    }
    const { data: query } = await maps.distancematrix({
      params: {
        key: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_KEY,
        origins: [origem],
        destinations: [destino],
      },
    });
    return query.rows[0].elements[0];
  } catch (e) {
    if (e.response.status === 404 || 403) {
      return {
        distance: {
          text: "INDISPONÍVEL",
          value: 0,
        },
        duration: {
          text: "1 min",
          value: 0,
        },
        status: "OK",
      };
    }
    throw exceptionHandler(e);
  }
}
