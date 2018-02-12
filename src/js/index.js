import config from './app/config';
import logsCreate from './app/logs';
import App from './app/app';
import '../scss/main.scss';

const appCreate = (app, config, logs) => {

  const namespace = {},
        throwError = (msg) => {
          throw new Error(msg);
        };

  const lgs = config.app.RULES._isFunction(logs)? logs(config.app.LOG): logs;

  try {
    !namespace[ config.app.NAME ] && config.app.RULES._isFunction(app)?
     (
       namespace[ config.app. NAME ] = new app(config.app.NAME),
       namespace[ config.app. NAME ].logs = config.app.RULES._isFunction(logs)? logs(config.app.LOG): logs,
       namespace[ config.app. NAME ].throwError = throwError,
       namespace[ config.app. NAME ].lang = config.app.LANG.current? config.app.LANG.current: config.app.LANG.default
     ):
    throwError('Invalid app name or app is not a function');
  }
  catch(e) {
    lgs.log(e);
  }

  const stop = () => {
    delete namespace[ config.app.NAME ];
  }

  const start = () => {

  const init = () => {
    try {
      config.app.RULES._isFunction(namespace[ config.app.NAME ].init)?
      namespace[ config.app.NAME ].init():
      throwError('Unable to init app');
    }
    catch(e) {
      lgs.log(e);
    }
  }

  const remove = () => {
    $(window).off('load', init);
    stop();
    window.removeEventListener('unload', remove);
  }

  // Start App
  $(window).on('load', init);
  // Remove App
  window.addEventListener('unload', remove);
  }

  return start;
}
// Create App
const start = appCreate(App, config, logsCreate);
start();
