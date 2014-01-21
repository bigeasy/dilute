require('proof')(2, function (step, deepEqual) {
    var values = [ 0, 1, 2, 3, 5, 6, 7 ], records = [], keys = []
    var iterator = require('advance')(values, function (record, callback) {
        console.log(arguments)
        callback(null, record, record)
    })
    var filter = require('../..')(iterator, function (key) {
        if (key == 7) return 1
        if (key % 2 == 0) return -1
        return 0
    })
    step([function () {
        filter.unlock()
    }], function () {
        step(function () {
            filter.next(step())
        }, function (record, key) {
            if (record && key) {
                records.push(record)
                keys.push(key)
            } else {
                step(null)
            }
        })()
    }, function () {
        deepEqual(records, [ 1, 3, 5 ], 'records')
        deepEqual(keys, [ 1, 3, 5 ], 'keys')
        iterator.unlock()
    })
})
