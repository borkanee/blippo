const router = require('express').Router()

router.route('/')
    .get((req, res, next) => {
        try {
            res.render('sketches/sketch1')
        } catch (error) {
            return next(error)
        }
    })

router.route('/weather-music')
    .get(async (req, res, next) => {
        try {
            res.render('sketches/sketch2')
        } catch (error) {
            return next(error)
        }
    })

// Exports.
module.exports = router
