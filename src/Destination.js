const Router = require('./Router')
const proxy = require('http-proxy')

class Destination extends Router {
  constructor ({ url, auth, remotePath, headers }) {
    super()
    this.url = url
    this.remotePath = remotePath
    this.headers = headers || {}
    this.proxy = proxy.createProxyServer({
      target: (url || '') + '/' + (remotePath || ''),
      auth: auth,
      secure: false,
      prependPath: true,
      changeOrigin: true
    })

    this.proxy.on('proxyReq', (proxyReq, req, res, options) => {
      Object.keys(this.headers)
        .forEach(name => proxyReq.setHeader(name, this.headers[name]))
    })

    this.proxy.on('error', (err, req, res) => {
      console.error("Destination error: ", req.url, err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(err, null, 4));
    })
  }

  handle (request, response) {
    this.proxy.web(request, response)
  }
}

module.exports = Destination
