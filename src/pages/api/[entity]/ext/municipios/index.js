import { fetchMunicipios } from "controller/ext/municipios";
import { getTerritorioByMunic } from "controller/ext/territorios-identidade";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler para conexão com API externa para prover dados de municípios.
 * @method handler
 * @memberof module:ext
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const { entity, id, municipio } = req.query;
        const fetch = await fetchMunicipios(entity);
        const promiseFetch = async () =>
          await Promise.all(
            fetch.data.map(async (item) => {
              if (id || municipio) {
                const nome = [];
                if (municipio.startsWith("'")) {
                  nome.push(`'${item.nome}'`);
                } else if (municipio.startsWith('"')) {
                  nome.push(`"${item.nome}"`);
                } else {
                  nome.push(item.nome);
                }
                if (
                  item.id === id ||
                  nome[0]
                    .trim()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase() ===
                    municipio
                      .trim()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                ) {
                  return {
                    id: item.id,
                    nome: item.nome,
                    territorio: await getTerritorioByMunic(item.nome),
                    ...item,
                  };
                }
              } else {
                return {
                  id: item.id,
                  nome: item.nome,
                  territorio: await getTerritorioByMunic(item.nome),
                  ...item,
                };
              }
            })
          );
        const promiseFilter = await promiseFetch();
        const munic = promiseFilter.filter((item2) => item2);
        return res.status(200).json(munic);
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
