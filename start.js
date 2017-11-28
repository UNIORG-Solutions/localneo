#!/usr/bin/env node
const MapReader = require('./src/MapReader')
const map = MapReader.fromApplicationDirectory(process.cwd())
const app = map.getApplication()

app.listen(map.port, map.hostname, undefined, () => {
  console.log('Server listening on http://%s:%s/', app.server.address().address, app.server.address().port)
})
