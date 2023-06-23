import { timeNtpService } from "services";

/**
 * Fornece a hora do sistema atual através de uma chamada a um serviço.
 * @method getNetworkTime
 * @memberof module:ext
 * @returns {DateTime} Data e Hora
 */
export async function getNetworkTime() {
  try {
    const date = await timeNtpService();
    return date;
  } catch (e) {
    return exceptionHandler(e, res);
  }
}
