const process = require('process');
const ProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues while running a local server.
 * For more details and options, see https://angular.io/guide/build#using-corporate-proxy
 */
const config = [
  {
    context: '/api/',
    pathRewrite: {
      '^/api': '',
    },
    target: 'http://localhost:45500/v1.0/private/',
    changeOrigin: true,
    secure: false,
  },
];

/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
const setupProxy = (config = []) => {
  if (!Array.isArray(config)) {
    config = [config];
  }

  const server = process.env.http_proxy || process.env.HTTP_PROXY;
  if (server) {
    console.log(`Using corporate proxy server: ${server}`);
    config.map((entry) => (entry.agent = new ProxyAgent(server)));
  }

  return config;
};

module.exports = setupProxy(config);
