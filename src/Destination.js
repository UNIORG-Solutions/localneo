const Router = require('./Router')
const proxy = require('http-proxy')

class Destination extends Router {
  constructor ({ url, auth, remotePath }) {
    super()
    this.url = url
    this.remotePath = remotePath
    this.proxy = proxy.createProxyServer({
      target: (url || '') + '/' + (remotePath || ''),
      auth: auth,
      secure: false,
      prependPath: true,
      changeOrigin: true
    })
  }

  handle (request, response) {
    this.proxy.web(request, response)
  }
}

module.exports = Destination
