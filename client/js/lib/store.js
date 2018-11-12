class Store {
  constructor() {
    this.store = new Map()
  }

  setValue(key, value) {
    this.store.set(key, value)
  }

  getValue(key) {
    return this.store.get(key)
  }
}

export default new Store()
