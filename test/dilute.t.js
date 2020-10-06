require('proof')(2, async okay => {
    const dilute = require('..')
    const advance = require('advance')
    const values = [ 0, 1, 2, 3, 5, 6, 7, 8, 9 ]

    {
        const iterator = dilute(advance.forward([ values ]), item => {
            if (item == 7) return -1
            if (item % 2 == 0) return 0
            return 1
        })

        const gather = [], promises = []
        while (! iterator.done) {
            iterator.next(promises, items => {
                for (const item of items) {
                    gather.push(item)
                }
            })
            while (promises.length != 0) {
                await promises.shift()
            }
        }

        okay(gather, [ 1, 3, 5 ], 'early return')
    }

    {
        const iterator = dilute(advance.forward([ values ]), item => {
            if (item % 2 == 0) return 0
            return 1
        })

        const gather = [], promises = []
        while (! iterator.done) {
            iterator.next(promises, items => {
                for (const item of items) {
                    gather.push(item)
                }
            })
            while (promises.length != 0) {
                await promises.shift()
            }
        }

        okay(gather, [ 1, 3, 5, 7, 9 ], 'complete')
    }
})
