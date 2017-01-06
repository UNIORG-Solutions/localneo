#!/usr/bin/env node
const MapReader = require('./src/MapReader')
const map = MapReader.fromApplicationDirectory(process.cwd())
const app = map.getApplication()

app.listen(4567)

console.log('Server listening on http://localhost:4567/')

