import axiosClient from "axios";

/**
 * Conexão padrão com o Backend pelo Axios.
 * @method axios
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const axios = axiosClient.create({
  baseURL: "/",
  timeout: 30000,
});

/**
 * Conexão padrão com a API de Arquivos pelo Axios.
 * @method filesAPIService
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const filesAPIService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});

/**
 * Conexão com a API de Arquivos pelo Axios, utilizada para upload na adição da header correta.
 * @method filesAPIUpload
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const filesAPIUpload = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});

/**
 * Conexão com a API de BD da Domínio (Legado).
 * @method bdRhService
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const bdRhService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BD_DOMINIO}/`,
  timeout: 0,
});
