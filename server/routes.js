const express = require('express');

const router = express.Router();

const controllers = require("./controllers.js");

router.get('/', (req, res)=> { res.send('Hello , world!'); });

module.exports = router;
