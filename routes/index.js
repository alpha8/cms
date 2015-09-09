var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '一虎一席预览版',nav:'index' });
});

router.get('/timeline', function(req, res, next) {
  res.render('timeline', {nav:'timeline'});
});

router.get('/article', function(req, res, next) {
  res.render('article', {title: '文章管理',nav:'article' });
});

router.get('/filemanager', function(req, res, next) {
  res.render('filemanager', {title: '文件管理',nav:'fm' });
});
module.exports = router;
