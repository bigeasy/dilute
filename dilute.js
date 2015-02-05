var cadence = require('cadence/redux'),
    assert = require('assert')

function Dilute (iterator, filter) {
    this._iterator = iterator
    this._filter = filter
}

Dilute.prototype.next = cadence(function (async) {
    async(function () {
        this._iterator.next(async())
    }, function (record, key, size) {
        if (record != null) {
            switch (this._filter(key, record)) {
            case -1:
                async(function () {
                    this.next(async())
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
