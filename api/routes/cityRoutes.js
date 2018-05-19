const cityController = require('../cityController.js')
const express = require('express')
const router = express.Router()

router.get('/cities', (req, res) => cityController.list(req, res))

router.get('/capitals', (req, res) => cityController.listCapitals(req, res))

router.get('/cities/:id', (req, res) => cityController.get(req, res))

module.exports = router