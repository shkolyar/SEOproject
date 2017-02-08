var express = require('express');
var router = express.Router();
var url = require('url');
var multer = require('multer');
var upload = multer();
var utils = require('../tools/utils');
var HQClient = require('../tools/hqClient')
var tid = null

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/', upload.array(), function(req, res, next) {
  var errors = [];
  var host = null; 
  if ( !req.body.URL ) {
    errors.push('URL is empty')
  } else {
    try {
      var parsedURL = url.parse(req.body.URL);
      var host = parsedURL.host;
    } catch(err) {
      console.log(err)
      errors.push('URL is not valid')
    }
  }
  var list = null;
  if ( !req.body.keywords ) {
    req.body.keywords = '';
  }
  var list = req.body.keywords.split('\n');
  if ( !list.length ) {
    errors.push('keywords is empty')
  }
  if ( errors.length ) {
    console.log('errors', errors)
    res.render('index', {
      errors: errors
    });
    return;
  }
  var ids = [];
  var hqClient = new HQClient();
  return utils.queue(list, function(query) {
    query = query.replace('\r', '');
    query = query.trim();
    if ( !query ) return;
    var data = {
      command: 'yandex.query.next',
      data: {
        query: {
          query: query,
          city: 2
        },
        site: {
          host: host
        }
      }
    }
    return hqClient.get('task.add', data)
    .then(function(task) {
      ids.push(task.id);
    })
  })
  .then(function(task) {
    res.redirect('/result?ids=' + ids.join(';'))
  })
  .catch(function(err) {
    err.status = 500;
    next(err)
  })
});

router.get('/result', function(req, res, next) {
  if ( !req.query.ids ) {
    var err = new Error('Bad request')
    err.status = 400;
    next(err);
    return;
  }
  var ids = req.query.ids.split(';');
  var hqClient = new HQClient();
  var data = {};
  return hqClient.get('task.report', { ids : ids })
  .then(function(report) {
    data.report = report
    res.render('result', {
      report: report
    });
  })
  .catch(function(err) {
    err.status = 500;
    next(err)
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
