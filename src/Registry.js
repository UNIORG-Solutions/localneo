let instance

function getInstance () {
  if (!instance) {
    instance = new Registry()
  }

  return instance
}

class Registry {
  constructor () {
    this.cache = {}
  }

  static getInstance () {
    return getInstance()
  }

  clear () {
    this.cache = {}
    return this
  }

  has (key) {
    return this.cache[key] !== undefined
  }

  get (key) {
    return this.cache[key]
  }

  put (key, value) {
    this.cache[key] = value

    return value
  }
}

module.exports = Registry
