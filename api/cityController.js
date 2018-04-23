const cities = Object.freeze(require('./cities.json').sort((a, b) => a.name.localeCompare(b.name)))

module.exports.list = (req, res) => {
    let result = cities
    if (req.query.q) {
        const regexp = new RegExp(req.query.q, 'i')
        result = result.filter(city => regexp.test(city.name))
    }
    result = result.map(city => { return { id: city.id, name: city.name } })

    // Send json response with teams - if any.

    res.json({
        query: req.query.q,
        count: result.length,
        cities: result
    })
}

/**
 * Sends a JSON response containing a team.
 *
 * @param {Object} req Node.js request object
 * @param {Object} res Node.js response object
 */
module.exports.get = (req, res) => {
    let id = Number(req.params.id)

    // If the parameter id isn't an integer greater than 0 send a 400 (bad request).
    if (!id || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request'
        })
    }

    // Get the first team that's id equals the parameter id.
    let city = cities.filter(city => city.id === id).shift()

    // If no team is found send a 404 (resource not found).
    if (!city) {
        return res.status(404).json({
            status: 404,
            message: 'Not Found'
        })
    }

    // Send json response with the wanted team.
    res.json(city)
}