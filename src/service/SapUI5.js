const Router = require('../Router')
const proxy = require('http-proxy')

class SapUI5 extends Router {
  constructor ({ remotePath, localPath }) {
    super()
    this.proxy = proxy.createProxyServer({
      target: 'https://openui5.hana.ondemand.com/' + remotePath,
      secure: false,
      prependPath: true,
      changeOrigin: true
    })
  }

  handle (request, response) {
    this.proxy.web(request, response)
  }
}

module.exports = SapUI5
