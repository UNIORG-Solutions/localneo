const Router = require('../Router')
const proxy = require('http-proxy')

class SapUI5 extends Router {
  constructor ({ remotePath, localPath, serviceConfig }) {
    super()

    let prefix = 'https://openui5.hana.ondemand.com/'
    if (serviceConfig.resourceUrl) {
      prefix = serviceConfig.resourceUrl
    } else {
      if (serviceConfig.useSAPUI5) {
        prefix = 'https://sapui5.hana.ondemand.com/'
      }

      if (serviceConfig.version) {
        prefix += serviceConfig.version
      }
    }

    console.log("Serving UI5 from %s", prefix);
    this.proxy = proxy.createProxyServer({
      target: prefix + remotePath,
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
