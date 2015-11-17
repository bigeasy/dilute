var cadence = require('cadence'),
    assert = require('assert')

function Dilute (iterator, filter) {
    this._iterator = iterator
    this._filter = filter
    this._done = false
}

Dilute.prototype.get = function () {
    var item
    while ((item = this._iterator.get()) != null) {
        switch (this._filter(item)) {
        case -1:
            break
        case 0:
            return item
        case 1:
            this._done = true
            return null
        default:
            throw new Error('invalid return from filter')
        }
    }
    return null
}

Dilute.prototype.next = function (callback) {
    if (this._done) {
        callback(null, null)
    }
    this._iterator.next(callback)
}

Dilute.prototype.unlock = function (callback) {
    assert.ok(callback, 'unlock now requires a callback')
    this._iterator.unlock(callback)
}

module.exports = function (iterator, filter) {
    return new Dilute(iterator, filter)
}
