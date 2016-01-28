var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: '一虎一席预览版',
    nav:'index'
  });
});

router.get('/order/list', function(req, res, next) {
  res.end(JSON.stringify({"records":"1000","page":1,"total":100,"rows":[{"OrderID":1,"CustomerID":"WILMK","OrderDate":"1996-07-04 00:00:00","Freight":"32.3800","ShipName":"Vins et alcools Chevalier"},{"OrderID":2,"CustomerID":"TRADH","OrderDate":"1996-07-05 00:00:00","Freight":"11.6100","ShipName":null},{"OrderID":3,"CustomerID":"HANAR","OrderDate":"1996-07-08 00:00:00","Freight":"65.8300","ShipName":"Hanari Carnes"},{"OrderID":4,"CustomerID":"VICTE","OrderDate":"1996-07-08 00:00:00","Freight":"41.3400","ShipName":"Victuailles en stock"},{"OrderID":5,"CustomerID":"SUPRD","OrderDate":"1996-07-09 00:00:00","Freight":"51.3000","ShipName":null},{"OrderID":6,"CustomerID":"HANAR","OrderDate":"1996-07-10 00:00:00","Freight":"58.1700","ShipName":"Hanari Carnes"},{"OrderID":7,"CustomerID":"CHOPS","OrderDate":"1996-07-11 00:00:00","Freight":"22.9800","ShipName":"Chop-suey Chinese"},{"OrderID":8,"CustomerID":"RICSU","OrderDate":"1996-07-12 00:00:00","Freight":"148.3300","ShipName":"Richter Supermarkt"},{"OrderID":9,"CustomerID":"WELLI","OrderDate":"1996-07-15 00:00:00","Freight":"13.9700","ShipName":"Wellington Importadora"},{"OrderID":10,"CustomerID":"HILAA","OrderDate":"1996-07-16 00:00:00","Freight":"81.9100","ShipName":null}]}));
});

router.get('/timeline', function(req, res, next) {
  res.render('timeline', {nav:'timeline'});
});

router.get('/article', function(req, res, next) {
  res.render('article', {title: '文章管理',nav:'article' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {
    nav:'contact', 
    users:[
      {name:'李彦宏', avatar:'/images/avatar/robert-lee.jpg', company:'百度技术有限公司', email:'robert@baidu.com', status:2, auth_type:'email'},
      {name:'雷军', avatar:'/images/avatar/leijun.jpg', company:'小米技术有限公司', email:'ray@mi.com', status:1, auth_type:'email'},
      {name:'马云', avatar:'/images/avatar/mayun.jpg', company:'阿里巴巴有限公司', email:'', phone:'188****8888', status:0, auth_type:'phone'}
    ],
    company:[
      {name:'百度技术有限公司', city:'北京', country:'中国', status:2},
      {name:'小米技术有限公司', city:'广州', country:'中国', status:0},
      {name:'阿里巴巴有限公司', city:'杭州', country:'中国', status:1}
    ],
    user_total:3
  });
});

router.get('/filemanager', function(req, res, next) {
  res.render('filemanager', {
    title: '文件管理',
    nav:'fm', 
    files:[{
      type:'file',
      src:'',
      fileName:"Document_2014.doc",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p1.jpg',
      fileName:"Italy street.jpg",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p2.jpg',
      fileName:"My feel.png",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p3.jpg',
      fileName:"Leaf.png",
      createTime: new Date('2014-10-01')
    },{
      type:'audio',
      src:'',
      fileName:"Michal Jackson.mp3",
      createTime: new Date('2014-10-01')
    },{
      type:'video',
      src:'',
      fileName:"Monica's birthday.mpg4",
      createTime: new Date('2014-10-01')
    },{
      type:'chart',
      src:'',
      fileName:"Annual report 2014.xls",
      createTime: new Date('2014-10-01')
    },{
      type:'file',
      src:'',
      fileName:"Document_2014.doc",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p1.jpg',
      fileName:"Italy street.jpg",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p2.jpg',
      fileName:"My feel.png",
      createTime: new Date('2014-10-01')
    },{
      type:'image',
      src:'http://www.zi-han.net/theme/hplus/img/p3.jpg',
      fileName:"Leaf.png",
      createTime: new Date('2014-10-01')
    }]
  });
});

router.get('/help', function(req, res, next) {
  res.render('help', {title: '在线帮助',nav:'help' });
});

router.get('/dialog', function(req, res, next) {
  res.render('dialog', {title: '对话框DEMO',nav:'dialog' });
});

router.get('/nav1', function(req, res, next) {
  res.render('component/nav/static-nav');
});
router.get('/nav', function(req, res, next) {
  res.render('component/nav/dynamic-nav');
});
router.get('/tabs', function(req, res, next) {
  res.render('component/tabs/tabs');
});
router.get('/login', function(req, res, next) {
  res.render('component/login/login');
});
router.get('/home', function(req, res, next) {
  res.render('home');
});

router.get('/api/lang', function(req, res, next){
  if(!req.query.lang){
    res.status(500).send();
    return;
  }

  try{
    var lang = require('../i18n/'+req.query.lang);
    res.send(lang);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/user/list/:userId', function(req, res, next){
  var userId = req.params.userId;
  if(!userId){
    res.status(500).send();
    return;
  }

  if(userId==='all'){
    userId = 0;
  }

  try{
    var users = require('../resource/user/'+userId+'.json');
    res.send(users);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/article/list', function(req, res, next){
  try{
    var list = require('../resource/article/list.json');
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/user/search', function(req, res, next){
  var resource = '0.json';
  if(req.query.keyword){
    resource = '1.json';
  }
  try{
    var list = require('../resource/user/'+resource);
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/article/search', function(req, res, next){
  var resource = 'list.json';
  if(req.query.keyword){
    resource = 'hits.json';
  }
  try{
    var list = require('../resource/article/'+resource);
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/fm/list', function(req, res, next) {
  try{
    var list = require('../resource/files/list.json');
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/customer/list', function(req, res, next) {
  try{
    var list = require('../resource/customer/list.json');
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});

router.get('/product/list', function(req, res, next) {
  try{
    var list = require('../resource/product/list.json');
    res.send(list);
  }catch(e){
    res.status(500).send();
  }
});
module.exports = router;
