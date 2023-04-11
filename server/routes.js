const express = require('express');

const router = express.Router();

const controllers = require("./controllers.js");

router.get('/', (req, res)=> { res.send('Hello , world!'); });
router.get('/getGrid', controllers.getGrid);
router.get('/playerScores', controllers.getPlayerScores);

module.exports = router;
