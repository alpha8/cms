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

module.exports = router;