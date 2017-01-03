const StaticDirectory = require('./StaticDirectory')

class Application extends StaticDirectory {
  constructor ({ root, index, subRoutes }) {
    super({ root, index })
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
        return router.target.handle(request, response)
      }
    }

    super.handle(request, response)
  }
}

module.exports = Application
