var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer()

var tid = null
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/result', function(req, res, next) {
  res.render('result', {
    title: 'Express'
  });
});

router.post('/position', upload.array(), function(req, res, next) {
  console.log(req);
  if ( !req.body.query ) {
    next(new Error('query is empty'))
    return;
  }
  if ( !req.body.host ) {
    next(new Error('host is empty'))
    return;
  }
  tid = Date.now()
  res.send({
    tid: tid
  })
});

router.get('/position', function(req, res, next) {
  console.log(req.query);

  var result = {
    tid: req.body.tid
  };

  if ( Date.now() % 10 == 0  ) {
    result.error = 'Error'
  } else if ( Date.now() % 5 == 0 ) {
    result.position = Date.now() % 100
  }
  if ( !req.query.tid ) {
    next(new Error('tid is empty'));
    return;
  }
  if ( req.query.tid  != tid  ) {
    next(new Error('tid not found'));
    return;
  }
  res.send(result)
});

module.exports = router;
