const http = require('http')

class Router {
  handle (request, response) {
    throw new Error('unimplemented')
  }

  listen (port, hostname, backlog, callback) {
    this.server = http.createServer(this.handle.bind(this))
    return this.server.listen.apply(this.server, arguments)
  }
}

module.exports = Router
