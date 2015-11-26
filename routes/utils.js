var fs = require('fs');
var path = require('path');

module.exports = {
  travel: function(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
      var pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        travel(pathname, callback);
      } else {
        callback(pathname);
      }
    });
  },

  listFiles:function(dir){
    if(fs.existsSync(dir)){
      return fs.readdirSync(dir);
    }
  },

  mkdirsSync:function(dirpath, mode) { 
    mode = mode || 0777;
    if (!fs.existsSync(dirpath)) {
      var pathtmp;
      dirpath.split(path.sep).forEach(function(dirname) {
        if (pathtmp) {
          pathtmp = path.join(pathtmp, dirname);
        }else {
          pathtmp = dirname;
        }
        if (!fs.existsSync(pathtmp)) {
          if (!fs.mkdirSync(pathtmp, mode)) {
            return false;
          }
        }
      });
    }
    return true; 
  },

  copy:function(src, dest){
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
  }
};