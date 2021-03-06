const open = require('open')

class OpenListener {
  static addTo (app) {
    app.on('listening', (server) => {
      let url = `http://${server.address().address}:${server.address().port}/`
      console.log('opening browser on %s', url)
      open(url)
    }
    )
  }
}

module.exports = OpenListener
