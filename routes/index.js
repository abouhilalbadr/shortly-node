const express = require('express');
const router = express.Router();

const db = require('../db/index')

router.get('/:code', db.getUrlByCode);

module.exports = router;