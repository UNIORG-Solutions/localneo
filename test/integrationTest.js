const test = require('tape')
const tmp = require('tmp')
const fs = require('fs')
const got = require('got')
const ecstatic = require('ecstatic')
const http = require('http')
require('tape-chai')
const MapReader = require('../src/MapReader')

function buildMockServer (prepare, config) {
  const oldWd = process.cwd()
  const tempdir = tmp.dirSync({unsafeCleanup: true})
  if (!prepare) {
    prepare = function () { Promise.resolve() }
  }
  process.chdir(tempdir.name)
  const ret = prepare(tempdir.name)
  let next = Promise.resolve()
  if (ret instanceof Promise) {
    next = ret
  }
  next = next.then(cfgParams => {
    if (typeof config === 'function') {
      config = config(cfgParams)
    }

    return new MapReader(
      config.neoApp,
      config.destinations,
      './'
    )
  })

  return next.then((reader) => {
    const app = reader.getApplication()
    return new Promise(resolve => {
      app.on('listening', (server) => {
        function cleanup () {
          server.close()
          tempdir.removeCallback()
          process.chdir(oldWd)
        }

        const url = `http://${server.address().address}:${server.address().port}`
        resolve({url, cleanup})
      })
      app.listen(0, 'localhost')
    })
  })
}

test('application uses local path if it exists', function (t) {
  t.plan(1)

  buildMockServer(
    () => {
      fs.mkdirSync('./app')
      fs.writeFileSync('./app/index.html', 'Hello World!')
    },
    {
      neoApp: {
        routes: [
          {
            path: '/app',
            target: {
              type: 'application',
              name: 'testApp',
              remotePath: 'https://google.com'
            }
          },
        ]
      },
      destinations: {
        applications: {
          testApp: {path: './app'}
        }
      }
    }
  ).then(({url, cleanup}) => {
    const fileUrl = `${url}/app/index.html`
    got(fileUrl)
      .then(response => {
        cleanup()
        t.equal(response.body, 'Hello World!')
      })
      .catch(err => {
        cleanup()
        console.error(err)
        t.ok(false)
      })
  })
})

test('application uses remotePath if given', function (t) {
  t.plan(1)

  buildMockServer(
    () => {
      fs.mkdirSync('./app')
      fs.writeFileSync('./app/index.html', 'Hello World!')
      fs.mkdirSync('./remote_app')
      fs.writeFileSync('./remote_app/index.html', 'Hello Server!')
      const serveStatic = ecstatic('./remote_app/')
      const server = http.createServer(serveStatic)
      return new Promise(resolve => {
        server.listen(0, 'localhost', undefined, () => {
          server.unref()
          resolve(`http://${server.address().address}:${server.address().port}`)
        })
      })
    },
    (url) => (
      {
        neoApp: {
          routes: [
            {
              path: '/app',
              target: {
                type: 'application',
                name: 'testApp'
              }
            },
          ]
        },
        destinations: {
          applications: {
            testApp: {
              path: './app',
              preferLocal: false,
              remotePath: url
            }
          }
        }
      }
    )
  ).then(({url, cleanup}) => {
    const fileUrl = `${url}/app/index.html`
    got(fileUrl)
      .then(response => {
        cleanup()
        t.equal(response.body, 'Hello Server!')
      })
      .catch(err => {
        cleanup()
        console.error(err)
        t.ok(false)
      })
  })
})



test('application uses path over remotePath', function (t) {
  t.plan(1)

  buildMockServer(
    () => {
      fs.mkdirSync('./app')
      fs.writeFileSync('./app/index.html', 'Hello World!')
      fs.mkdirSync('./remote_app')
      fs.writeFileSync('./remote_app/index.html', 'Hello Server!')
      const serveStatic = ecstatic('./remote_app/')
      const server = http.createServer(serveStatic)
      return new Promise(resolve => {
        server.listen(0, 'localhost', undefined, () => {
          server.unref()
          resolve(`http://${server.address().address}:${server.address().port}`)
        })
      })
    },
    (url) => (
      {
        neoApp: {
          routes: [
            {
              path: '/app',
              target: {
                type: 'application',
                name: 'testApp'
              }
            },
          ]
        },
        destinations: {
          applications: {
            testApp: {
              path: './app',
              remotePath: url
            }
          }
        }
      }
    )
  ).then(({url, cleanup}) => {
    const fileUrl = `${url}/app/index.html`
    got(fileUrl)
      .then(response => {
        cleanup()
        t.equal(response.body, 'Hello World!')
      })
      .catch(err => {
        cleanup()
        console.error(err)
        t.ok(false)
      })
  })
})
