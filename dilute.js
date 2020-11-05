module.exports = function (source, filter) {
    let done = false
    const iterator = {
        done: false,
        type: source.type,
        next (promises, consumer, terminator = iterator) {
            if (done) {
                terminator.done = true
            } else {
                source.next(promises, items => {
                    const gathered = []
                    ITEMS: for (const item of items) {
                        switch (filter(item)) {
                        case 0:
                            break
                        case 1:
                            gathered.push(item)
                            break
                        case -1:
                            done = true
                            break ITEMS
                        }
                    }
                    consumer(gathered)
                }, terminator)
            }
        }
    }
    return iterator
}
