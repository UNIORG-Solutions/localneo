const test = require('tape')
require('tape-chai')
const Application = require('../src/Application')
const TargetInfo = require('../src/TargetInfo')

test('an Application calls its subroutes', function (t) {
  t.plan(1)
  let app = new Application({
    root: '.',
    index: 'index.html',
    subRoutes: [
      new TargetInfo({
        path: '/test/',
        target: {
          handle: function (request) {
            t.equals(request.url, '/foobar')
          }
        }
      })
    ]
  })

  app.handle({ url: '/test/foobar' }, {})
})

test('an Application service the static content when there is no subroute', function (t) {
  t.plan(1)
  let app = new Application({
    root: '.',
    index: 'index.html',
    subRoutes: []
  })

  app.static = function (request) {
    t.equals(request.url, '/foobar')
  }

  app.handle({ url: '/foobar' })
})

test('an Application service the static content when there is no matching subroute', function (t) {
  t.plan(1)
  let app = new Application({
    root: '.',
    index: 'index.html',
    subRoutes: [ { path: '/test' } ]
  })

  app.static = function (request) {
    t.equals(request.url, '/foobar')
  }

  app.handle({ url: '/foobar' })
})
