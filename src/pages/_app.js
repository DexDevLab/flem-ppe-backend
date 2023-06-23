/**
 * Componente de inicialização da aplicação.
 * @method MyApp
 * @memberof module:pages
 * @param {Component} props propriedades dos Componentes visuais.
 * @returns {Component} Componente.
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
