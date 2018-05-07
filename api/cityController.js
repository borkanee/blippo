const cities = Object.freeze(require('./cities.json').sort((a, b) => a.name.localeCompare(b.name)))

module.exports.list = (req, res) => {
    let result = cities
    if (req.query.q) {
        const regexp = new RegExp(req.query.q, 'i')
        result = result.filter(city => regexp.test(city.name))
    }
    result = result.map(city => { return { id: city.id, name: city.name, country: city.country, coord: city.coord } })

    res.json({
        query: req.query.q,
        count: result.length,
        cities: result
    })
}

module.exports.get = (req, res) => {
    let id = Number(req.params.id)

    if (!id || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request'
        })
    }

    let city = cities.filter(city => city.id === id).shift()


    if (!city) {
        return res.status(404).json({
            status: 404,
            message: 'Not Found'
        })
    }

    res.json(city)
}