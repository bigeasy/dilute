require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var values = [ 0, 1, 2, 3, 5, 6, 7 ], records = [], keys = [], sizes = []
    var iterator = require('advance').forward(null, values)
    var filter = require('../..')(iterator, function (item) {
        if (item % 2 == 0) return -1
        return 0
    })
    async([function () {
        filter.unlock(async())
    }], function () {
        var loop = async(function () {
            filter.next(async())
        }, function (more) {
            if (more) {
                var item
                while ((item = filter.get()) != null) {
                    records.push(item)
                }
            } else {
                return [ loop.break ]
            }
        })()
    }, function () {
        assert(records, [ 1, 3, 5, 7 ], 'records')
        iterator.unlock(async())
    })
}
