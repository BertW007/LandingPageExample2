import logsCreate from './logs';
import $ from 'jquery';
import velocity from 'velocity-animate';
import Events from './events';
// import loader from './loader';
import config from './config';

const events = new Events(),
      logs = logsCreate(config.app.LOG),
      throwError = (msg) => {
        throw new Error(msg);
      };


class App {
  constructor(name) {
    try {
      !$ || !velocity || !Events? // && !loader
      throwError('App creation faild. Unable to find one or more dependencies'):
      !name? throwError('App creation faild. App name not provided'):
      false;
    } catch(e) {
      logs.log(e);
    }
  }

  createModules() {
    // this.imagesLoaded = loader();
    this.modules = config.app.MODULES.map((creator) => {
      try {
        let module;
        config.app.RULES._isFunction(creator)?
        module = new creator():
        throwError('Module creation faild. Uninitialized module should be a function');

        module.modulePrefix = '.';
        module.moduleSuffix = '-';
        module.emit = events.emit.bind(events);
        module.sub = events.on.bind(events);
        module.unsub = events.off.bind(events);

        return module;

      } catch(e) {
        logs.log(e);
      }
    });
  }

  initModules() {
    try {
      this.modules.forEach((module) => {
        module.init &&
        config.app.RULES._isFunction(module.init)?
        module.init():
        throwError('Unable to init module. Module init should be a function')
      })
    }
    catch(e) {
      logs.log(e);
    }
  }

  handleRemove() {
    // this.loader.remove();
    // delete this.loader;
    // delete this.imagesLoaded;
  }

  handleIn() {

    const complete = () => {
      events.emit('ACL', null);
    }

    const animOut = () => {
      this.loader.velocity('stop').velocity(
        'fadeOut',
        {
          duration: 1000,
          complete: complete
        }
      );
    }
    this.query.velocity('stop').velocity(
      'fadeIn',
      {
        duration: 1000,
        begin: animOut
      }
    );
  }

  init() {
    // this.loader = $('#loader');
    this.createModules();
    this.initModules();
    console.log(this);
    // Promise.all(this.imagesLoaded).then(() => {
    //     this.handleIn();
    //     this.handleRemove();
    // })
  };
}

const appCreate = (app, config) => {

  const namespace = {};

  try {
    !namespace[ config.app.NAME ] && config.app.RULES._isFunction(app)?
     (
       namespace[ config.app.NAME ] = new app(config.app.NAME),
       namespace[ config.app.NAME ].lang = config.app.LANG.current? config.app.LANG.current: config.app.LANG.default
     ):
    throwError('Invalid app name or app is not a function');
  }
  catch(e) {
    logs.log(e);
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
        logs.log(e);
      }
    }

  const remove = () => {
    $(window).off('load', init);
    window.removeEventListener('unload', remove);
  }

  window.addEventListener('unload', remove);
  $(window).on('load', init);
  }

  return start;
}
// Create App
const start = appCreate(App, config);
export default start;
