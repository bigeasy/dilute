require('proof')(3, require('cadence')(function (step, assert) {
    var values = [ 0, 1, 2, 3, 5, 6, 7 ], records = [], keys = [], sizes = []
    var iterator = require('advance')(values, function (record, callback) {
        callback(null, record, record, 5)
    })
    var filter = require('../..')(iterator, function (key) {
        if (key == 7) return 1
        if (key % 2 == 0) return -1
        return 0
    })
    step([function () {
        filter.unlock(step())
    }], function () {
        step(function () {
            filter.next(step())
        }, function (record, key, size) {
            if (record && key) {
                records.push(record)
                keys.push(key)
                sizes.push(size)
            } else {
                return [ step ]
            }
        })()
    }, function () {
        assert(records, [ 1, 3, 5 ], 'records')
        assert(keys, [ 1, 3, 5 ], 'keys')
        assert(sizes, [ 5, 5, 5 ], 'sizes')
        iterator.unlock(step())
    })
}))
