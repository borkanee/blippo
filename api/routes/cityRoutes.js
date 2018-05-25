const cityController = require('../cityController.js')
const router = require('express').Router()

router.get('/cities', (req, res) => cityController.list(req, res))

router.get('/capitals', (req, res) => cityController.listCapitals(req, res))

module.exports = router