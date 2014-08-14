var cadence = require('cadence'),
    assert = require('assert')

function Dilute (iterator, filter) {
    this._iterator = iterator
    this._filter = filter
}

Dilute.prototype.next = cadence(function (step) {
    step(function () {
        this._iterator.next(step())
    }, function (record, key, size) {
        if (record != null) {
            switch (this._filter(key, record)) {
            case -1:
                step(function () {
                    setImmediate(step())
                }, function () {
                    this.next(step())
                })
                break
            case 0:
                return [ record, key, size ]
            case 1:
                return []
            default:
                throw new Error('invalid return from filter')
            }
        }
    })
})

Dilute.prototype.unlock = function (callback) {
    assert.ok(callback, 'unlock now requires a callback')
    this._iterator.unlock(callback)
}

module.exports = function (iterator, filter) {
    return new Dilute(iterator, filter)
}
