const express = require('express');
const router = express.Router();

const db = require('../db/index')

router.post('/shortly', db.shortlyCode);

module.exports = router;