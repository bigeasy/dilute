require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var values = [ 0, 1, 2, 3, 5, 6, 7 ], records = [], keys = [], sizes = []
    var iterator = require('advance')(values, function (record, callback) {
        callback(null, record, record, 5)
    })
    var filter = require('../..')(iterator, function (key) {
        if (key % 2 == 0) return -1
        return 0
    })
    async([function () {
        filter.unlock(async())
    }], function () {
        async(function () {
            filter.next(async())
        }, function (record, key, size) {
            if (record) {
                records.push(record)
                keys.push(key)
                sizes.push(size)
            } else {
                return [ async ]
            }
        })()
    }, function () {
        assert(records, [ 1, 3, 5, 7 ], 'records')
        assert(keys, [ 1, 3, 5, 7 ], 'keys')
        assert(sizes, [ 5, 5, 5, 5 ], 'sizes')
        iterator.unlock(async())
    })
}
