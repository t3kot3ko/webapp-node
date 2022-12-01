var express = require('express');
const { exec } = require("child_process");
const { syncBuiltinESMExports } = require('module');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET /")
  res.render('index', { title: 'WebApp' });
});

router.get("/sleep", async function(req, res, next) {
  console.log("GET /sleep")
  const duration = req.query.duration || 0
  console.log(duration)

  await new Promise(s => setTimeout(s, duration))

  res.render('index', { title: `Timer with duration ${duration}` });
});

module.exports = router;
