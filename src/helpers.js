function listToArray (list) {
    if (!list) return []
    return Array.isArray(list) ? list : list.split(', ')
}

module.exports = { listToArray }
