const http = require('http')

class Router {
  handle (request, response) {
    throw new Error('unimplemented')
  }

  listen (port) {
    return http.createServer(this.handle.bind(this)).listen(port)
  }
}

module.exports = Router
