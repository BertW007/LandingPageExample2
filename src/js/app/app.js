import logsCreate from './logs'
import $ from 'jquery'
import velocity from 'velocity-animate'
import Events from './events'
import config from './config'

const events = new Events()
const logs = logsCreate(config.app.LOG)
const throwError = (msg) => {
  throw new Error(msg)
}

class App {
  constructor (name) {
    try {
      if (!$ || !velocity || !Events) {
        throwError('App creation faild. Unable to find one or more dependencies')
      }
      if (!name) {
        throwError('App creation faild. App name not provided')
      }
    } catch (e) {
      logs.log(e)
    }
  }

  createModules () {
    this.modules = config.app.MODULES.map((Creator) => {
      try {
        let module = null
        config.app.RULES._isFunction(Creator)
          ? module = new Creator()
          : throwError('Module creation faild. Uninitialized module should be a function')

        module.modulePrefix = '.'
        module.moduleSuffix = '-'
        module.emit = events.emit.bind(events)
        module.sub = events.on.bind(events)
        module.unsub = events.off.bind(events)
        return module
      } catch (e) {
        logs.log(e)
      }
    })
  }

  initModules () {
    try {
      this.modules.forEach((module) => {
        module.init && config.app.RULES._isFunction(module.init)
          ? module.init()
          : throwError('Unable to init module. Module init should be a function')
      })
    } catch (e) {
      logs.log(e)
    }
  }

  handleIn () {
    const complete = () => {
      events.emit('ACL', null)
    }

    const animOut = () => {
      this.loader.velocity('stop').velocity(
        'fadeOut',
        {
          duration: 1000,
          complete: complete
        }
      )
    }
    this.query.velocity('stop').velocity(
      'fadeIn',
      {
        duration: 1000,
        begin: animOut
      }
    )
  }

  init () {
    this.createModules()
    this.initModules()
  }
}

const appCreate = (App, config) => {
  const namespace = {}
  try {
    if (!namespace[ config.app.NAME ] && config.app.RULES._isFunction(App)) {
      namespace[ config.app.NAME ] = new App(config.app.NAME)
      namespace[ config.app.NAME ].lang = config.app.LANG.current
        ? config.app.LANG.current
        : config.app.LANG.default
    } else {
      throwError('Invalid app name or app is not a function')
    }
  } catch (e) {
    logs.log(e)
  }

  const stop = () => {
    delete namespace[ config.app.NAME ]
  }

  const start = () => {
    const init = () => {
      try {
        config.app.RULES._isFunction(namespace[ config.app.NAME ].init)
          ? namespace[ config.app.NAME ].init()
          : throwError('Unable to init app')
      } catch (e) {
        logs.log(e)
      }
    }

    const remove = () => {
      $(window).off('load', init)
      window.removeEventListener('unload', remove)
      stop()
    }

    window.addEventListener('unload', remove)
    $(window).on('load', init)
  }

  return start
}
// Create App
const start = appCreate(App, config)
export default start
