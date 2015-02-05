require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var values = [ 0 ]
    var iterator = require('advance')(values, function (record, callback) {
        callback(null, record, record)
    })
    var filter = require('../..')(iterator, function () {})
    async([function () {
        filter.unlock(async())
    }], function () {
        async([function () {
            filter.next(async())
        }, function (_, error) {
            assert(error.message, 'invalid return from filter', 'invalid return')
        }])
    })
}
