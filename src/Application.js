const StaticDirectory = require('./StaticDirectory')

class Application extends StaticDirectory {
  /**
   * @param {string}   root      root directory
   * @param {string}   index     index file / welcome file
   * @param {Router[]} subRoutes handlers for other resources
   */
  constructor ({ root, index, subRoutes, secure }) {
    super({ root, index, secure })
    this.subRoutes = subRoutes
  }

  handle (request, response) {
    for (let router of this.subRoutes) {
      if (request.url.startsWith(router.path)) {
        if (!router.target) {
          console.error('no Router to handle ', request.url)
          response.statusCode = 404
          response.end()
          return
        }

        request.url = request.url.replace(new RegExp('^' + router.path), '')
        if (!request.url.startsWith('/')) {
          request.url = '/' + request.url
        }

        return router.target.handle(request, response)
      }
    }

    super.handle(request, response)
  }
}

module.exports = Application
