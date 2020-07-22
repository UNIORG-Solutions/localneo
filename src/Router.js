const http = require('http')
const https = require('https')
const util = require('util')
const pem = require('pem')
const EventEmitter = require('events')

class Router extends EventEmitter {
  constructor (options) {
    super()
    this.secure = options && options.secure
  }

  handle (request, response) {
    throw new Error('unimplemented')
  }

  async listen (port, hostname) {
    if (this.secure) {
      // Create self-signed certificate and start HTTPS server
      const keys = await util.promisify(pem.createCertificate)({
        days: 1,
        selfSigned: true
      })
      this.server = https.createServer({
        key: keys.serviceKey,
        cert: keys.certificate
      }, this.handle.bind(this))
      this.server.protocol = 'https'
    } else {
      this.server = http.createServer(this.handle.bind(this))
      this.server.protocol = 'http'
    }

    return this.server.listen(port, hostname, undefined, () => {
      this.emit('listening', this.server)
    })
  }
}

module.exports = Router
