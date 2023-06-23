import _ from "lodash";
import { parseArrayToInteger, parseArrayToStringEquals } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Função para compor o filtro da query. Caso a requisição faça uma solicitação
 * ao BD utilizando critérios de pesquisa ("condition") e um objeto de filtro,
 * aplica a alteração a um objeto de filtro para realizar a pesquisa corretamente.
 *
 * @param {Object} criteria Conjunto de critérios de pesquisa:
 *
 * condition - Define uma condição de pesquisa, quando
 * incluído mais de 1 coluna em "columns". Caso os critérios de pesquisa
 * envolvam informações em mais de 1 coluna, é obrigatório o uso deste
 * parâmetro. Se este parâmetro for omitido e exista mais de 1 critério
 * de pesquisa em "columns", a função disparará uma exceção.
 * 
 * Exemplo: condition="OR"
 * 
 * excluido - se inclui entradas no BD que foram excluídas.
 * 
 * query - restante dos critérios de pesquisa, os quais geralmente envolvem
 * entradas ou tabelas específicas onde valores devem ser procurados ou alterados.
 *
 * @param {Object} req HTTP request.
 * @returns Objeto contendo o fragmento da Query String para requisitar ao BD.
 */
export function queryComposer(criteria) {
  const { condition, excluido, ...query } = criteria;
  const queryCondition = [];
  _.isUndefined(condition)
    ? queryCondition.push("AND")
    : queryCondition.push(
        condition.toString().replaceAll('"', "").replaceAll("'", "")
      );
  const keys = Object.keys(query);
  const filter = {
    [queryCondition[0]]: [],
  };
  keys.forEach((key) => {
    switch (key) {
      case "escritorioRegional_Id":
      case "idBeneficiario":
        parseArrayToStringEquals(query[key], "id").map((item) =>
          filter[queryCondition[0]].push(item)
        );
        break;
      case "tipoAcaoCr_Id":
      case "benefAssoc_Id":
      case "contato":
      case "cpf":
      case "etnia":
      case "email":
      case "id":
      case "label":
      case "login_usuario":
      case "matriculaSec":
      case "nome":
      case "sigla":
      case "tamanho":
        parseArrayToStringEquals(query[key], key).map((item) =>
          filter[queryCondition[0]].push(item)
        );
        break;
      case "matricula":
      case "matriculaFlem":
        filter[queryCondition[0]].push({
          [key]: { in: parseArrayToInteger(query[key]) },
        });
        break;
      default:
        throw new Error(
          exceptionHandler(
            {
              message: `Critério de filtro (${key}) não encontrado na listagem em queryComposer(criteria).`,
            },
            null
          )
        );
    }
  });
  if (_.isUndefined(excluido)) {
    return { ...filter };
  } else {
    return { excluido: new RegExp("true").test(excluido), ...filter };
  }
}
