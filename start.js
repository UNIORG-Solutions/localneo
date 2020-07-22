#!/usr/bin/env node
const MapReader = require('./src/MapReader')
const map = MapReader.fromApplicationDirectory(process.cwd())
const app = map.getApplication()

app.on('listening', (server) => {
  console.log('Server listening on %s://%s:%s/', server.protocol, server.address().address, server.address().port)
})

app.listen(map.port, map.hostname, map.secure)
