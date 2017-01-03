const StaticDirectory = require('./StaticDirectory')

class StaticFactory {

  constructor (path, index) {
    this.path = path
    this.index = index
  }

  getRouter () {
    return new StaticDirectory({ root: this.path, index: this.index })
  }
}

module.exports = StaticFactory
