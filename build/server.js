// Generated by CoffeeScript 1.10.0
var application, base, fs;

fs = require('fs');

if ((base = process.env).NODE_ENV == null) {
  base.NODE_ENV = "development";
}

process.on('uncaughtException', function(err) {
  console.error(err.message);
  return console.error(err.stack);
});

if (!process.env.DEFAULT_REDIRECT_PORT) {
  process.env.DEFAULT_REDIRECT_PORT = 9103;
}

application = module.exports = function(callback) {
  var americano, crtPath, errorMiddleware, initialize, keyPath, options;
  americano = require('americano');
  initialize = require('./server/initialize');
  errorMiddleware = require('./server/middlewares/errors');
  options = {
    name: 'proxy',
    port: process.env.PORT || 9104,
    host: process.env.HOST || "127.0.0.1",
    root: __dirname
  };
  if (process.env.USE_SSL) {
    crtPath = process.env.SSL_CRT_PATH || '/etc/cozy/server.crt';
    keyPath = process.env.SSL_KEY_PATH || '/etc/cozy/server.key';
    options.tls = {
      cert: fs.readFileSync(crtPath),
      key: fs.readFileSync(keyPath)
    };
  }
  return americano.start(options, function(err, app, server) {
    app.use(errorMiddleware);
    return initialize(app, server, callback);
  });
};

if (!module.parent) {
  application();
}
