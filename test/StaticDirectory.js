const test = require('tape')
const StaticDirectory = require('../src/StaticDirectory')

test('it accesses the requestd url', function (t) {
  t.plan(1)
  let app = new StaticDirectory({ root: '', index: 'index.html' })

  app.static = function (request) {
    t.equals(request.url, '/lib/foobar.html')
  }

  app.handle({ url: '/lib/foobar.html' }, {})
})

test('it removes the cachebuster information from urls', function (t) {
  t.plan(1)
  let app = new StaticDirectory({ root: '', index: 'index.html' })

  app.static = function (request) {
    t.equals(request.url, '/lib/foobar.html')
  }

  app.handle({ url: '/lib/~16469464~/foobar.html' }, {})
})

test('it redirects to the welcome file', function (t) {
  t.plan(3)
  let app = new StaticDirectory({ root: '', index: '/index.html' })

  let response = {
    setHeader: function (name, value) {
      t.equals(name, 'Location')
      t.equals(value, '/index.html')
    }
  }

  response.end = function () {
    t.equals(response.statusCode, 302)
  }

  app.handle({ url: '/' }, response)
})
