// Generated by CoffeeScript 1.7.1
var AppManager, Client, logger;

Client = require('request-json').JsonClient;

logger = require('printit')({
  date: false,
  prefix: 'lib:app_manager'
});

AppManager = (function() {
  function AppManager() {
    var homePort;
    homePort = process.env.DEFAULT_REDIRECT_PORT;
    this.client = new Client("http://localhost:" + homePort + "/");
    this.router = require('./router');
  }

  AppManager.prototype.ensureStarted = function(slug, shouldStart, callback) {
    var routes;
    routes = this.router.getRoutes();
    if (routes[slug] == null) {
      callback({
        code: 404,
        msg: 'app unknown'
      });
      return;
    }
    switch (routes[slug].state) {
      case 'broken':
        return callback({
          code: 500,
          msg: 'app broken'
        });
      case 'installing':
        return callback({
          code: 404,
          msg: 'app is still installing'
        });
      case 'installed':
        return callback(null, routes[slug].port);
      case 'stopped':
        if (shouldStart) {
          return this.startApp(slug, function(err, port) {
            if (err != null) {
              return callback({
                code: 500,
                msg: "cannot start app : " + err
              });
            } else {
              return callback(null, port);
            }
          });
        } else {
          return callback({
            code: 500,
            msg: 'wont start'
          });
        }
        break;
      default:
        return callback({
          code: 500,
          msg: 'incorrect app state'
        });
    }
  };

  AppManager.prototype.startApp = function(slug, callback) {
    logger.info("Starting app " + slug);
    return this.client.post("api/applications/" + slug + "/start", {}, (function(_this) {
      return function(err, res, data) {
        var msg, routes;
        if (data.error) {
          err = err || data.msg;
        }
        if ((err != null) || res.statusCode !== 200) {
          msg = "An error occurred while starting the app " + slug;
          logger.error("" + msg + " -- " + err);
          return callback(err);
        } else {
          logger.info("App " + slug + " successfully started.");
          routes = _this.router.getRoutes();
          routes[slug] = {
            port: data.app.port,
            state: data.app.state
          };
          return callback(null, data.app.port);
        }
      };
    })(this));
  };

  return AppManager;

})();

module.exports = new AppManager();