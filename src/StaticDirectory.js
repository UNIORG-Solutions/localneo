const Router = require('./Router')
const ecstatic = require('ecstatic')

class StaticDirectory extends Router {
  constructor ({ root, index }) {
    super()
    this.rootDir = root
    this.index = index
    this.static = ecstatic({
      root: root,
      autoIndex: false,
      handleError: false,
      showDir: false,
      cache: 0
    })
  }

  handle (request, response) {
    if (request.url.indexOf('~') !== -1) {
      request.url = request.url.replace(/\/~\d+~\//, '/')
    }

    if (request.url.endsWith('/')) {
      response.setHeader('Location', this.index)
      response.statusCode = 302
      response.end()
      return
    }

    return this.static(request, response)
  }
}

module.exports = StaticDirectory
