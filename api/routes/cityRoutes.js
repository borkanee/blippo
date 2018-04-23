const cityController = require('../cityController.js')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => cityController.list(req, res))


router.get('/:id', (req, res) => cityController.get(req, res))

module.exports = router