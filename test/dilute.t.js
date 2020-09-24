require('proof')(2, async okay => {
    const dilute = require('..')
    const values = [ 0, 1, 2, 3, 5, 6, 7, 8, 9 ]

    {
        const next = [ { value: values, done: false }, { done: true } ]
        const dilution = dilute({
            [Symbol.asyncIterator]: function () { return this },
            next: function () {
                return next.shift()
            },
            return: () => {}
        }, item => {
            if (item == 7) return -1
            if (item % 2 == 0) return 0
            return 1
        })

        const gather = []

        for await (const got of dilution) {
            for (const item of got) {
                gather.push(item)
            }
        }

        okay(gather, [ 1, 3, 5 ], 'early return')
    }

    {
        const next = [ { value: values, done: false }, { done: true } ]
        const dilution = dilute({
            [Symbol.asyncIterator]: function () { return this },
            next: function () {
                return next.shift()
            },
            return: () => {}
        }, item => {
            if (item % 2 == 0) return 0
            return 1
        })

        const gather = []

        for await (const got of dilution) {
            for (const item of got) {
                gather.push(item)
            }
        }

        okay(gather, [ 1, 3, 5, 7, 9 ], 'complete')
    }
})
