const http = require('http')
const EventEmitter = require('events')

class Router extends EventEmitter {
  handle (request, response) {
    throw new Error('unimplemented')
  }

  listen (port, hostname) {
    this.server = http.createServer(this.handle.bind(this))

    return this.server.listen(port, hostname, undefined, () => {
      this.emit('listening', this.server)
    })
  }
}

module.exports = Router
