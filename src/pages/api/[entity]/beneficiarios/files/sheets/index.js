import { benefCheckBd, benefValidate } from "controller/beneficiarios";
import nc from "next-connect";
import { allowCors } from "services";
import { filesAPIService } from "services/apiService";
import { exceptionHandler } from "utils/exceptionHandler";
import { phoneNumberFixer } from "utils/phoneNumberFixer";
import { read, utils } from "xlsx";

/**
 * Handler de manipulação da entrada de dados das planilhas de importação
 * @method handler
 * @memberof module:sheets
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = nc({
  onError: (err, req, res, next) => {
    console.log(err);
    res
      .status(err.status || 500)
      .end(`flem-ppe-backend - NextConnect Handler: ${err.message}`);
  },
  onNoMatch: (req, res) => {
    console.log(res);
    res
      .status(res.status || 404)
      .end(`flem-ppe-backend - NextConnect Handler: ${err.message}`);
  },
});

export default allowCors(handler);

/**
 * Converte um objeto do tipo String de valor UPPERCASE,
 * lowercase ou DiVerSo em um objeto String em camelCase.
 * @method camelCase
 * @memberof module:sheets
 * @param {String} str objeto a ser convertido
 * @returns {String} string em formato camelCase
 */
function camelCase(str) {
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function (b) {
      return b.toLowerCase();
    });
}

/**
 * Normaliza e formata um objeto dentro de uma sheet, seja coluna ou linha.
 * @param {Object} object "key" a ter seu valor normalizado e formatado
 * @returns objeto formatado
 */
const replaceKeys = (object) => {
  Object.keys(object).forEach(function (key) {
    const newKey = camelCase(
      key
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\//g, "_")
        .replace(/º/g, "_")
    );
    if (object[key] && typeof object[key] === "object") {
      replaceKeys(object[key]);
    }
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });
  return object;
};

//Lista de colunas e valores oriundos da planilha os quais devem ser tratados.
const SHEETS_COLUMNS = [
  "demandante",
  "municipioDaVaga",
  "municipioDoAluno",
  "nomeDoColegio",
  "cursoDeFormacao",
  "dataDeNascimento",
  "raca_cor",
  "cpfAluno",
  "sexo",
  "matricula",
  "nome",
  "telefone01",
  "telefone02",
  "dataDaConvocacao",
];

/**
 * Manipulação do handler para receber os dados da planilha (de formato File para formato Object)
 * e preparar adequadamente seus valores para então retornar ao backend após uma série de validações.
 */
handler.get(async (req, res) => {
  try {
    const { fileId, entity } = req.query;

    const { data: fileFromApi } = await filesAPIService.get(`/downloadFile`, {
      params: { fileId },
      responseType: "arraybuffer",
    });

    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: { fileId },
    });

    const workbook = read(fileFromApi, {
      type: "array",
      cellDates: true,
    });

    // INSTANCIA O OBJETO CONTENDO OS DADOS
    const sheet = {};

    // RECEBE E MARCA OS DADOS DA PLANILHA
    workbook.SheetNames.forEach((sheetName) => {
      const rawRows = utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: true,
        defval: null,
      });

      // FORMATA OS DADOS QUE SÃO AS COLUNAS DA PLANILHA
      rawRows.map((row) => replaceKeys(row));
      const filterColumns = rawRows.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => SHEETS_COLUMNS.includes(key))
        )
      );
      /**
       * AJUSTA OS NÚMEROS DE TELEFONE E REPARA OS FORMATOS, PARA QUE FIQUE ALINHADO
       * CORRETAMENTE COM O VALOR QUE ENTRARÁ NO BD
       *
       * */
      const rows = filterColumns
        .filter((row) => Object.keys(row).length === SHEETS_COLUMNS.length)
        .map((row) => ({
          ...row,
          telefone01: phoneNumberFixer(row.telefone01, "BR"),
          telefone02: phoneNumberFixer(row.telefone02, "BR"),
        }));
      // SE A LINHA NÃO É NULA, A INCLUI DENTRO DO OBJETO DA PLANILHA
      if (rows.length > 0) {
        sheet[sheetName] = rows;
      }
    });
    // RETORNA MENSAGEM DE ERRO CASO AS COLUNAS ESTEJAM INVÁLIDAS
    if (Object.keys(sheet).length === 0) {
      const error = new Error("Colunas de arquivo inválidas");
      error.status = 400;
      error.message = "Colunas de arquivo inválidas";
      throw error;
      // console.log("flem-ppe-backend - invalid file columns");
      // return res
      //   .status(400)
      //   .json({
      //     ok: false,
      //     message: "flem-ppe-backend - invalid file columns",
      //   });
    }

    // PRIMEIRA VALIDAÇÃO - VERIFICA NO BANCO BENEFICIÁRIOS JÁ LISTADOS, MARCA BENEFICIÁRIOS ENCONTRADOS,
    // ATIVOS E INATIVOS DENTRO DO BD LEGADO
    const bdCheckLegado = await benefCheckBd(true, entity, sheet);

    // PRIMEIRA VALIDAÇÃO - VERIFICA NO BANCO BENEFICIÁRIOS JÁ LISTADOS, MARCA BENEFICIÁRIOS ENCONTRADOS,
    // ATIVOS E INATIVOS DENTRO DO BD PADRÃO
    const bdCheck = await benefCheckBd(false, entity, bdCheckLegado);

    // SEGUNDA VALIDAÇÃO - CONFERE CAMPOS SE COMUNICANDO COM API E BD E OS FORMATA
    const output = await benefValidate(entity, bdCheck);

    // RETORNO
    return res.status(200).json({ status: "ok", fileDetails, output });
  } catch (e) {
    return exceptionHandler(e, res);
  }
});

// MANIPULAÇÃO DE EXCEÇÃO (NÃO TRATADA)
handler.patch(async (req, res) => {
  throw new Error("flem-ppe-backend - NextConnect Handler");
});

//FORÇA O PARSING CORRETO PARA O CORPO DO CONTEÚDO DO UPLOAD
export const config = {
  api: {
    bodyParser: false,
  },
};
