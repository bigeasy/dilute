var cadence = require('cadence')

function Dilute (iterator, filter) {
    this._iterator = iterator
    this._filter = filter
}

Dilute.prototype.next = cadence(function (step) {
    step(function () {
        this._iterator.next(step())
    }, function (record, key) {
        switch (this._filter(key, record)) {
        case -1:
            step(function () {
                setImmediate(step())
            }, function () {
                this.next(step())
            })
            break
        case 0:
            step(null, record, key)
            break
        case 1:
            break
        default:
            throw new Error('invalid return from filter')
        }
    })
})

Dilute.prototype.unlock = function () {
    this._iterator.unlock()
}

module.exports = function (iterator, filter) {
    return new Dilute(iterator, filter)
}
