var express = require('express');
const { exec } = require("child_process");
const { syncBuiltinESMExports } = require('module');
const multer = require("multer");
const path = require('path');
const axios = require('axios');
const https = require("https");

const structuredLogging = require('structured-logging');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: "webapp-node-logger",
  serializers: structuredLogging.serializers,
});

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

router.get("/header", (req, res) => {
  res.json(req.headers)
})

router.get("/status", (req, res) => {
  const status = req.query.status || 200
  res.status(status)
  res.json({message: "Returning status: " + status})
})

router.get('/200', (req, res) => {
  res.status(200); // Always success
  res.end()
});

router.get('/liveness', (req, res) => {
  res.status(200); // Always success
  res.end()
});

router.get('/readiness', (req, res) => {
  res.status(200); // Always success
  res.end()
});

router.get('/500', (req, res) => {
  res.status(500); // Always fail
  res.end()
});

router.get('/terminate', (req, res) => {
  process.exit(1);
});

const upload = multer({ dest: 'public/uploads/' })
router.use(express.static(path.join(__dirname, 'public')))
router.post('/upload', upload.single('file'), function (req, res, next) {
  const file = req.file
  res.send('Upload successfully completed; size: ' + file.size);
});

router.get("/console", (req, res) => {
  const message = req.query.message || "Message"
  console.log(message);

  res.json({message: "Wrote on console: " + message})
});

// Output structured log in JSON
router.get("/log", (req, res) => {
  const message = req.query.message || "Message"
  const type = req.query.type || "info"
  logger[type](message);
  res.end()
});


router.get('/http_get', async (req, res) => {
  const url = req.query.url

  const https = require('https');
  https.get(url, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
      res.status(200);
      res.end()
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});


module.exports = router;
