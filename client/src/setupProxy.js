const { createProxyMiddleware } = require('http-proxy-middleware');

console.log("setupProxy.js is being executed!");

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );

    console.log("Proxy middleware set up!");
};
