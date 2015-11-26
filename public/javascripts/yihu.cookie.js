(function(){
  /**
   * Cookie工具类
   */
  var cookie = Yihu.Cookie = {
    add : function(name, value, expires, path){
      var opts = {
        name:name||'',
        value:value||'',
        expires:isNaN(expires) ? 0 : expires,
        path:path||'/'
      };

      var exp = new Date();
      exp.setTime(exp.getTime() + opts.expires);
      document.cookie = opts.name + 
        "=" + escape(opts.value) + 
        ";expires=" + exp.toGMTString() + 
        ";path=" + opts.path;
    },

    get : function(name){
      var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      if(arr) {
        return unescape(arr[2]);
      }
      return null;
    },

    remove : function(name, path){
      var opts = {
        name:name||'',
        path:path||'/'
      };

      var exp = new Date();
      exp.setTime(exp.getTime() - 1000);    
      document.cookie = opts.name + 
        "=;expires=" + exp.toGMTString() + 
        ";path=" + opts.path;
    }
  };
})();