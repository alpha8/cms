var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var utils = require('./utils');

router.post('/upload/images', multipartMiddleware, function(req, res, next) {
  var file = req.files.imgFile;
  var originalFileName = file.originalFilename;

  fs.readFile(file.path, function(err, data){
    var type = originalFileName.substr(originalFileName.lastIndexOf('.')).toLowerCase();
    var newFileName = uuid.v1().replace(/-/g, '') + type;
    var uploadDir = path.join(__dirname, '../public/upload/image/');
    utils.mkdirsSync(uploadDir, 0777);

    var newPath = path.join(uploadDir, newFileName);
    //console.log('newPath='+newPath);
    fs.writeFile(newPath, data, function(err){
      if(err){
        console.log(err);
        res.json({error:1, message:'upload failed.'});
      }else{
        res.json({url:'/upload/image/'+newFileName, error:0});
      }
    });    
  });
});



router.get('/filemanager', function(req, res, next) {
  var p = req.query.path || '/';
  var order = req.query.order;
  var dir = req.query.dir;

  var uploadDir = path.join(__dirname, '../public/upload', p, dir);

  var files = utils.listFiles(uploadDir);
  var filesList = [];
  if(files){
    files.forEach(function(file){
      var pathname = path.join(uploadDir, file);
      var meta = fs.statSync(pathname);

      var isDirectory = meta.isDirectory();
      var suffix = isDirectory ? '' : pathname.substr(pathname.lastIndexOf('.')+1);

      var o = {};
      o.filename = file;
      o.filesize = meta.size;
      o.filetype = isDirectory ? '' : suffix;
      o.has_file = isDirectory;
      o.is_dir = isDirectory;
      o.is_photo = (suffix=='png'||suffix=='jpg'||suffix=='gif'||suffix=='bmp'||suffix=='jpeg');
      o.datetime = meta.mtime;
      filesList.push(o);
    });
  }  

  if(filesList && filesList.length > 1){
    if(order=='NAME'){
      filesList.sort();
    }else if(order=='SIZE'){
      filesList.sort(function(a, b){
        return a.filesize-b.filesize;
      });
    }else if(order=='TYPE'){
      filesList.sort(function(a, b){
        return b.filetype-a.filetype;
      });
    }
  }

  var url = '/upload/'+dir+'/';
  var output = {};
  output.file_list = filesList;
  output.total_count = filesList.length;
  output.moveup_dir_path = '';
  output.current_dir_path = (p=='/') ? '' : p;
  output.current_url = (p=='/') ? url : url+p;
  res.json(output);
});

router.post('/upload', multipartMiddleware, function(req, res, next) {
  var dir = req.query.dir;
  var file = req.files.imgFile;
  var originalFileName = file.originalFilename;

  fs.readFile(file.path, function(err, data){
    var type = originalFileName.substr(originalFileName.lastIndexOf('.')).toLowerCase();
    var newFileName = uuid.v1().replace(/-/g, '') + type;
    var uploadDir = path.join(__dirname, '../public/upload/'+dir);
    utils.mkdirsSync(uploadDir, 0777);

    var newPath = path.join(uploadDir, newFileName);
    //console.log('newPath='+newPath);
    fs.writeFile(newPath, data, function(err){
      if(err){
        console.log(err);
        res.json({error:1, message:'upload failed.'});
      }else{
        res.json({url:'/upload/'+dir+'/'+newFileName, error:0});
      }
    });    
  });
});

router.get('/filemanager/list', function(req, res, next) {
  var p = req.query.path || '/';
  var order = req.query.order || 'NAME';
  var uploadDir = path.join(__dirname, '../public/upload', p);

  var files = utils.listFiles(uploadDir);
  var filesList = [];
  if(files){
    files.forEach(function(file){
      var pathname = path.join(uploadDir, file);
      var meta = fs.statSync(pathname);

      var isDirectory = meta.isDirectory();
      var suffix = isDirectory ? '' : pathname.substr(pathname.lastIndexOf('.')).toLowerCase();

      var o = {};
      o.fileName = file;
      o.fileSize = meta.size;

      var fileType = "file";
      var imageTypes = ".png,.jpg,.gif,.bmp,.jpeg";
      var movieTypes = ".mp4,.3gp,.mov,.avi,.mkv,.rm,.rmvb,.mpg,.mpeg,.mpe,.mpa,.m15,.m1v,.mp2,.asf,.wmv";
      var audioTypes = ".mp3,.wav,.mid,.ogg,.wma,.amr";
      if(suffix === ''){
        fileType = "folder";
      }else if(imageTypes.indexOf(suffix) >= 0){
        fileType = "image";
        o.thumbs = {
          icon:'/upload/image/'+file,
          url:'/upload/image/'+file
        };
      }else if(movieTypes.indexOf(suffix) >= 0){
        fileType = "video";
        o.thumbs = {
          icon:'/images/thumbnail.JPG',
          url:'/upload/image/'+file
        };
      }else if(audioTypes.indexOf(suffix) >= 0){
        fileType = "audio";
      }
      o.fileType = fileType;
      o.hasFile = isDirectory;
      o.isDirectory = isDirectory;
      o.createTime = meta.mtime;
      filesList.push(o);
    });
  }  

  if(filesList && filesList.length > 1){
    if(order=='NAME'){
      filesList.sort();
    }else if(order=='SIZE'){
      filesList.sort(function(a, b){
        return a.fileSize-b.fileSize;
      });
    }else if(order=='TYPE'){
      filesList.sort(function(a, b){
        return b.fileType-a.fileType;
      });
    }
  }

  var url = '/upload/'+p+'/';
  var output = {};
  output.files = filesList;
  output.totalCount = filesList.length;
  output.path = (p=='/') ? '' : p;
  // output.currentPath = (p=='/') ? url : url+p;
  res.json(output);
});

module.exports = router;