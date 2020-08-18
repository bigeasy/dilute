class Dilute {
    constructor (paginator, filter) {
        this._paginator = paginator[Symbol.asyncIterator]()
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
        const next = this._paginator.next()
        if (next.done) {
            return { done: true }
        }
        const gathered = []
        ITEMS: for (const item of next.value) {
            switch (this._filter(item)) {
            case -1:
                break
            case 0:
                gathered.push(item)
                break
            case 1:
                this._done = true
                break ITEMS
            }
        }
        return { done: false, value: gathered }
    }

    return () {
        return this._paginator['return']()
    }
}

module.exports = Dilute
