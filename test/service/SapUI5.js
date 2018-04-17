const test = require('tape')
require('tape-chai')
const SapUi5 = require('../../src/service/SapUI5')

test('SapUI5 creates a proxy to openui5.hana.ondemand by default', function (t) {
  t.plan(1)
  let subject = new SapUi5({ remotePath: '', serviceConfig: {} })
  t.equals(subject.proxy.options.target, 'https://openui5.hana.ondemand.com/')
})

test('SapUI5 appends the remotePath', function (t) {
  t.plan(1)
  let subject = new SapUi5({ remotePath: 'some/remote/path', serviceConfig: {} })
  t.equals(subject.proxy.options.target, 'https://openui5.hana.ondemand.com/some/remote/path')
})

test('SapUI5 can use sapui when asked to', function (t) {
  t.plan(1)
  let subject = new SapUi5({ remotePath: '', serviceConfig: { useSAPUI5: true } })
  t.equals(subject.proxy.options.target, 'https://sapui5.hana.ondemand.com/')
})

test('SapUI5 can use a different resource url', function (t) {
  t.plan(1)
  let subject = new SapUi5({ remotePath: '', serviceConfig: { resourceUrl: 'https://google.com/' } })
  t.equals(subject.proxy.options.target, 'https://google.com/')
})

test('SapUI5 can use a different version', function (t) {
  t.plan(1)
  let subject = new SapUi5({ remotePath: '', serviceConfig: { version: '1.33.7' } })
  t.equals(subject.proxy.options.target, 'https://openui5.hana.ondemand.com/1.33.7/')
})
