const fs = require('fs')
const path = require('path')
const StaticFactory = require('./StaticFactory')
const Destination = require('./Destination')
const Application = require('./Application')
const ServiceFactory = require('./ServiceFactory')
const AppRegistry = require('./Registry')
const OpenListener = require('./OpenListener')
const TargetInfo = require('./TargetInfo')

class MapReader {
  constructor (neoApp, destinations, basePath) {
    this.neoApp = neoApp
    this.dest = destinations
    this.dir = basePath
    this.name = path.basename(basePath)

    this.port = 4567
    this.hostname = 'localhost'
    if (this.dest.server && this.dest.server.port) {
      this.port = this.dest.server.port
    }
    if (this.dest.server && this.dest.server.hostname) {
      this.hostname = this.dest.server.hostname
    }
  }

  getApplication () {
    let subRoutes = this.neoApp.routes.map(route => {
      let path = route.path
      let desc = route.description
      let name = route.name
      let target = this.getTarget(route.target, route.path)

      return new TargetInfo({path, desc, target, name})
    })

    const app = new Application({
      subRoutes,
      index: this.neoApp.welcomeFile || 'index.html',
      root: this.dir
    })

    if (this.dest.server && this.dest.server.open) {
      OpenListener.addTo(app)
    }

    return app
  }

  getRouter () {
    return this.getApplication()
  }

  getTarget (targetInfo, targetPath) {
    const reg = AppRegistry.getInstance()
    switch (targetInfo.type) {
      case 'application':
        if (!this.dest.applications || !this.dest.applications[targetInfo.name]) {
          console.error(`${this.name}: cannot find application definition for target ${targetInfo.name}`)
          if (reg.has('app:' + targetInfo.name)) {
            console.error(`${this.name}: using cached version...`)
            return reg.get('app:' + targetInfo.name)
          }
          return
        }

        let app = this.getAppTarget(Object.assign({
          name: targetInfo.name,
          localUrl: targetPath
        }, this.dest.applications[targetInfo.name]))

        if (app) {
          reg.put('app:' + targetInfo.name, app)
        }
        return app
      case 'destination':
        if (!this.dest.destinations || !this.dest.destinations[targetInfo.name]) {
          console.error(`${this.name}: cannot find destination definition for target ${targetInfo.name}`)
          if (reg.has('dest:' + targetInfo.name)) {
            console.error(`${this.name}: using cached version...`)
            return reg.get('dest:' + targetInfo.name)
          }
          return
        }

        let dest = this.getDestTarget(this.dest.destinations[targetInfo.name], targetInfo, targetPath)
        if (dest) {
          reg.put('dest:' + targetInfo.name, dest)
        }
        return dest

      case 'service':
        let serviceConfig = {}
        if (this.dest && this.dest.service && this.dest.service[targetInfo.name]) {
          serviceConfig = this.dest.service[targetInfo.name]
        }

        return ServiceFactory.create(targetInfo, targetPath, serviceConfig)
    }
  }

  getDestTarget ({url: proxyUrl, auth}, {entryPath}, incomingPath) {
    return new Destination({
      url: proxyUrl,
      auth,
      remotePath: entryPath,
      localPath: incomingPath
    })
  }

  directoryExists (path) {
    try {
      return fs.statSync(path).isDirectory()
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(err)
      }
      return false
    }
  }

  getAppTarget ({path: appPath, name, remotePath, preferLocal, localUrl}) {
    if (!path.isAbsolute(appPath)) {
      appPath = path.normalize(path.join(this.dir, appPath))
    }

    const dirExists = this.directoryExists(appPath)

    if (!dirExists && remotePath === undefined) {
      console.error(`cannot find direcory "${appPath}" for target ${name}`)
      return
    }

    if (remotePath && (preferLocal === false || !dirExists)) {
      // proxy remote
      console.warn(`redirecting to remote destination ${remotePath}`)
      return new Destination({
        url: remotePath,
        localPath: localUrl
      })
    }

    let appReader = MapReader.fromApplicationDirectory(appPath)

    if (!appReader) {
      return
    }

    return appReader.getRouter()
  }

  static fromApplicationDirectory (dir) {
    let fullDir = path.normalize(dir)

    try {
      if (!fs.existsSync(fullDir + '/neo-app.json')) {
        console.log(`application direcory "${fullDir}" does not contain a neo-app.json. Falling back to static file serving`)
        return new StaticFactory(fullDir)
      }
      let dest = {}
      if (fs.existsSync(fullDir + '/destinations.json')) {
        dest = JSON.parse(fs.readFileSync(fullDir + '/destinations.json'))
      }
      const neoApp = fs.readFileSync(fullDir + '/neo-app.json')
      return new MapReader(JSON.parse(neoApp), dest, fullDir)
    } catch (err) {
      console.error(`Error while reading application files from "${fullDir}": ${err.message}`)
    }
  }
}

module.exports = MapReader
