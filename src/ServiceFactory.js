const SapUI5Service = require('./service/SapUI5.js')

class ServiceFactory {
  static create ({ name, entryPath }, { localPath }, serviceConfig) {
    switch (name) {
      case 'sapui5':
        return new SapUI5Service({ remotePath: entryPath, localPath, serviceConfig })
    }
  }
}

module.exports = ServiceFactory
