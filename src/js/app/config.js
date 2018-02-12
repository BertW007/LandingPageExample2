import Outlines from './modules/outlines';
import Email from './modules/email';
import Features from './modules/features';

const config = {
  app: {
    NAME: 'ctheme',
    LOG: true,
    LANG: { default: 'en' },
    MODULES: [
      Outlines,
      Email,
      Features,
    ],
    RULES: {
      _isFunction: (functionToCheck) => {
        return functionToCheck && typeof functionToCheck === 'function';
      },
      _isObject: (objectToCheck) => { // is object or array :)
        return objectToCheck && objectToCheck !== null && typeof objectToCheck === 'object';
      },
      _isString: (dataToCheck) => {
        return dataToCheck && typeof functionToCheck === 'string';
      },
      _isNumber: (dataToCheck) => {
        return dataToCheck && typeof dataToCheck === 'number' && isFinite(dataToCheck);
      },
      _isArray: (dataToCheck) => {
        return dataToCheck && typeof dataToCheck === 'object' &&
        typeof dataToCheck.length === 'number' && !(dataToCheck.propertyIsEnumerable('length'));
      },
    },
  },
}

export default config;
