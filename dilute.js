class Dilute {
    constructor (iterable, filter) {
        this._iterator = iterable[Symbol.asyncIterator]()
        this._filter = filter
        this._done = false
    }

    [Symbol.asyncIterator] () {
        return this
    }

    async next () {
        if (this._done) {
            this['return']()
            return { done: true }
        }
        const next = this._iterator.next()
        if (next.done) {
            return { done: true }
        }
        const iterator = next.value[Symbol.iterator]()
        return {
            done: false,
            value: {
                [Symbol.iterator]: () => {
                    return {
                        next: () => {
                            for (;;) {
                                const next = iterator.next()
                                if (next.done) {
                                    return { done: true }
                                }
                                switch (this._filter(next.value)) {
                                case -1:
                                    break
                                case 0:
                                    return {
                                        done: false,
                                        value: next.value
                                    }
                                case 1:
                                    this._done = true
                                    return { done: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return () {
        return this._iterator['return']()
    }
}

module.exports = Dilute
