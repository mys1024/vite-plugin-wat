export class TimingMap<K, V> {
  #map = new Map<K, V>()
  #timeout = new Map<K, number | NodeJS.Timeout>()

  size(): number {
    return this.#map.size
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  get(key: K): V | undefined {
    return this.#map.get(key)
  }

  set(key: K, value: V, survivalTime: number) {
    const oldTimeout = this.#timeout.get(key)
    if (oldTimeout !== undefined)
      clearTimeout(oldTimeout)
    const timeout = setTimeout(() => {
      this.#map.delete(key)
      this.#timeout.delete(key)
    }, survivalTime)
    this.#map.set(key, value)
    this.#timeout.set(key, timeout)
  }
}
