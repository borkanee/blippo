const cities = Object.freeze(require('./cities.json').sort((a, b) => a.name.localeCompare(b.name)))
const capitals = Object.freeze(require('./capitals.json').sort((a, b) => a.name.localeCompare(b.name)))

module.exports.listCapitals = (req, res) => {
    let result = capitals
    result = result.map(city => { return { id: city.id, name: city.name, country: city.country } })
    res.json({ cities: result })
}

module.exports.list = (req, res) => {
    let result = cities
    if (req.query.q) {
        const regexp = new RegExp(req.query.q, 'i')
        result = result.filter(city => regexp.test(city.name))
    }
    result = result.map(city => { return { id: city.id, name: city.name, country: city.country } })

    res.json({ cities: result })
}