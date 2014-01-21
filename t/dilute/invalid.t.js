require('proof')(1, function (step, equal) {
    var values = [ 0 ]
    var iterator = require('advance')(values, function (record, callback) {
        callback(null, record, record)
    })
    var filter = require('../..')(iterator, function () {})
    step([function () {
        filter.unlock()
    }], function () {
        step([function () {
            filter.next(step())
        }, function (_, error) {
            equal(error.message, 'invalid return from filter', 'invalid return')
        }])
    })
})
