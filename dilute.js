module.exports = function (paginator, filter) {
    const iterator = paginator[Symbol.asyncIterator]()

    let done = false

    return {
        [Symbol.asyncIterator]: function  () {
            return this
        },
        next: async function () {
            if (done) {
                return { done: true, value: null }
            }
            const next = await iterator.next()
            if (next.done) {
                return { done: true, value: null }
            }
            const gathered = []
            ITEMS: for (const item of next.value) {
                switch (filter(item)) {
                case -1:
                    break
                case 0:
                    gathered.push(item)
                    break
                case 1:
                    done = true
                    break ITEMS
                }
            }
            return { done: false, value: gathered }
        }
    }
}
