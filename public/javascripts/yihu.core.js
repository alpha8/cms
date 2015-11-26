(function(){
  var Yihu = {
    error: function( msg ) {
      throw new Error( msg );
    },

    noop: function() {},

    isFunction: function( obj ) {
      return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray,

    isWindow: function( obj ) {
      return obj && obj === obj.window;
    },

    isNumeric: function( obj ) {
      // parseFloat NaNs numeric-cast false positives (null|true|false|"")
      // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
      // subtraction forces infinities to NaN
      // adding 1 corrects loss of precision from parseFloat (#15100)
      return !Yihu.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
    },

    type: function( obj ) {
      if (!obj) {
        return obj + "";
      }
      // Support: Android<4.0, iOS<6 (functionish RegExp)
      return typeof obj === "object" || typeof obj === "function" ?
        class2type[ toString.call(obj) ] || "object" :
        typeof obj;
    }
  };

  Yihu.version = "1.0";
  window.Yihu = Yihu;

  function class2type(){
      return {};
  }

  function isArraylike(obj) {
    var length = "length" in obj && obj.length,  type = Yihu.type( obj );
    if ( type === "function" || Yihu.isWindow( obj ) ) {
      return false;
    }
    if ( obj.nodeType === 1 && length ) {
      return true;
    }
    return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
  }

  /**
   * utils通用模块
   */
  var utils = Yihu.utils = {

    /**
     * 用给定的迭代器遍历数组或类数组对象
     * @method each
     * @param { Array } array 需要遍历的数组或者类数组
     * @param { Function } iterator 迭代器，该方法接受两个参数，第一个参数是当前所处理的value，第二个参数是当前遍历对象的key
     * 
     * @example
     * ```javascript
     * var divs = document.getElementsByTagName("div");
     * Yihu.utils.each(divs, function(value, key) {
     *     console.log(key + ":" + value.tagName);
     * });
     */
    each : function(obj, iterator, context) {
      if (obj === null) return;
      if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if(iterator.call(context, obj[i], i, obj) === false)
            return false;
        }
      }else{
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if(iterator.call(context, obj[key], key, obj) === false)
              return false;
          }
        }
      }
    },

    /**
     * 将source对象中的属性扩展到target对象上， 根据指定的isKeepTarget值决定是否保留目标对象中与
     * 源对象属性名相同的属性值。
     * @param  {Object} target     目标对象，新的属性将附加到该对象上
     * @param  {Object} source     源对象，该对象的属性会被附加到target对象上
     * @param  {Boolean}keepTarget 是否保留目标对象中与源对象中属性名相同的属性
     * @return {Object}            返回target对象
     *
     * @example
     * ```javascript
     *
     * var target = {name: 'target', sex: 1},
     *      source = {name: 'source', age: 17};
     * Yihu.utils.extend( target, source, true);
     * //output: {name: 'target', sex: 1, age: 17}
     * console.log(target);
     */
    extend:function (target, source, keepTarget) {
      if (source) {
        for (var k in source) {
          if (!keepTarget || !target.hasOwnProperty(k)) {
            target[k] = source[k];
          }
        }
      }
      return target;
    },

    /**
     * 将给定的多个对象的属性复制到目标对象target上
     * @method extend2
     * @remind 该方法将强制把源对象上的属性复制到target对象上
     * @remind 该方法支持两个及以上的参数， 从第二个参数开始， 其属性都会被复制到第一个参数上。 如果遇到同名的属性，
     *          将会覆盖掉之前的值。
     * @param { Object }    target 目标对象，新的属性将附加到该对象上
     * @param { Object... } source 源对象，支持多个对象， 该对象的属性会被附加到target对象上
     * @return { Object }   返回target对象
     * @example
     * ```javascript
     *
     * var target = {},
     *     source1 = { name: 'source', age: 17 },
     *     source2 = { title: 'dev' };
     * Yihu.utils.extend2( target, source1, source2);
     * //output: { name: 'source', age: 17, title: 'dev' }
     * console.log( target );
     */
    extend2:function (t) {
      var a = arguments;
      for (var i = 1; i < a.length; i++) {
        var x = a[i];
        for (var k in x) {
          if (!t.hasOwnProperty(k)) {
            t[k] = x[k];
          }
        }
      }
      return t;
    },

    /**
     * 以给定对象作为原型创建一个新对象
     * @method makeInstance
     * @param { Object } protoObject 该对象将作为新创建对象的原型
     * @return { Object } 新的对象， 该对象的原型是给定的protoObject对象
     * @example
     * ```javascript
     *
     * var protoObject = { sayHello: function () { console.log('Hello!'); } };
     *
     * var newObject = Yihu.utils.makeInstance( protoObject );
     * //output: Hello!
     * newObject.sayHello();
     * ```
     */
    makeInstance:function (obj) {
      var noop = new Function();
      noop.prototype = obj;
      obj = new noop();
      noop.prototype = null;
      return obj;
    },

    /**
     * 创建延迟指定时间后执行的函数fn, 如果在延迟时间内再次执行该方法， 将会根据指定的exclusion的值，
     * 决定是否取消前一次函数的执行， 如果exclusion的值为true， 则取消执行，反之，将继续执行前一个方法。
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @param { Boolean } exclusion 如果在延迟时间内再次执行该函数，该值将决定是否取消执行前一次函数的执行，
     *                     值为true表示取消执行， 反之则将在执行前一次函数之后才执行本次函数调用。
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     *
     * function test(){
     *     console.log(1);
     * }
     *
     * var testDefer = UE.utils.defer( test, 1000, true );
     * //output: (两次调用仅有一次输出) 1
     * testDefer();
     * testDefer();
     * ```
     */
    defer:function (fn, delay, exclusion) {
        var timerID;
        return function () {
            if (exclusion) {
                clearTimeout(timerID);
            }
            timerID = setTimeout(fn, delay);
        };
    },

    /**
     * 用指定的context对象作为函数fn的上下文
     * @method bind
     * @param { Function } fn 需要绑定上下文的函数对象
     * @param { Object } content 函数fn新的上下文对象
     * @return { Function } 一个新的函数， 该函数作为原始函数fn的代理， 将完成fn的上下文调换工作。
     * @example
     * ```javascript
     *
     * var name = 'window',
     *     newTest = null;
     *
     * function test () {
     *     console.log( this.name );
     * }
     *
     * newTest = UE.utils.bind( test, { name: 'object' } );
     *
     * //output: object
     * newTest();
     *
     * //output: window
     * test();
     *
     * ```
     */
    bind:function (fn, context) {
        return function () {
            return fn.apply(context, arguments);
        };
    },

    /**
     * 模拟继承机制， 使得subClass继承自superClass
     * @method inherits
     * @param { Object } subClass 子类对象
     * @param { Object } superClass 超类对象
     * @warning 该方法只能让subClass继承超类的原型， subClass对象自身的属性和方法不会被继承
     * @return { Object } 继承superClass后的子类对象
     * @example
     * ```javascript
     * function SuperClass(){
     *     this.name = "小李";
     * }
     *
     * SuperClass.prototype = {
     *     hello:function(str){
     *         console.log(this.name + str);
     *     }
     * }
     *
     * function SubClass(){
     *     this.name = "小张";
     * }
     *
     * UE.utils.inherits(SubClass,SuperClass);
     *
     * var sub = new SubClass();
     * //output: '小张早上好!
     * sub.hello("早上好!");
     * ```
     */
    inherits:function (subClass, superClass) {
        var oldP = subClass.prototype,
            newP = utils.makeInstance(superClass.prototype);
        utils.extend(newP, oldP, true);
        subClass.prototype = newP;
        return (newP.constructor = subClass);
    },

    /**
     * 将str中的html符号转义,将转义“'，&，<，"，>”五个字符
     * @method unhtml
     * @param { String } str 需要转义的字符串
     * @return { String } 转义后的字符串
     * @example
     * ```javascript
     * var html = '<body>&</body>';
     *
     * //output: &lt;body&gt;&amp;&lt;/body&gt;
     * console.log( UE.utils.unhtml( html ) );
     *
     * ```
     */
    unhtml:function (str, reg) {
        return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
            if (b) {
                return a;
            } else {
                return {
                    '<':'&lt;',
                    '&':'&amp;',
                    '"':'&quot;',
                    '>':'&gt;',
                    "'":'&#39;'
                }[a];
            }

        }) : '';
    },

    /**
     * 将str中的转义字符还原成html字符
     * @see UE.utils.unhtml(String);
     * @method html
     * @param { String } str 需要逆转义的字符串
     * @return { String } 逆转义后的字符串
     * @example
     * ```javascript
     *
     * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
     *
     * //output: <body>&</body>
     * console.log( UE.utils.html( str ) );
     *
     * ```
     */
    html:function (str) {
        return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
            return {
                '&lt;':'<',
                '&amp;':'&',
                '&quot;':'"',
                '&gt;':'>',
                '&#39;':"'",
                '&nbsp;':' '
            }[m];
        }) : '';
    },

    /**
     * 获取元素item数组array中首次出现的位置, 如果未找到item， 则返回-1。通过start的值可以指定搜索的起始位置。
     * @method indexOf
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @param { Array } array 需要查找的数组对象
     * @param { * } item 需要在目标数组中查找的值
     * @param { int } start 搜索的起始位置
     * @return { int } 返回item在目标数组array中的start位置之后首次出现的位置， 如果在数组中未找到item， 则返回-1
     * @example
     * ```javascript
     * var item = 1,
     *     arr = [ 3, 4, 6, 8, 1, 2, 8, 3, 2, 1, 1, 4 ];
     *
     * //output: 9
     * console.log( UE.utils.indexOf( arr, item, 5 ) );
     * ```
     */
    indexOf:function (array, item, start) {
        var index = -1;
        start = this.isNumber(start) ? start : 0;
        this.each(array, function (v, i) {
            if (i >= start && v === item) {
                index = i;
                return false;
            }
        });
        return index;
    },

    /**
     * 移除数组array中所有的元素item
     * @method removeItem
     * @param { Array } array 要移除元素的目标数组
     * @param { * } item 将要被移除的元素
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @example
     * ```javascript
     * var arr = [ 4, 5, 7, 1, 3, 4, 6 ];
     *
     * UE.utils.removeItem( arr, 4 );
     * //output: [ 5, 7, 1, 3, 6 ]
     * console.log( arr );
     *
     * ```
     */
    removeItem:function (array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    }
  };

  /**
   * 浏览器判断模块
   */
  var browser = Yihu.browser = function(){
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
          ie    :  /(msie\s|trident.*rv:)([\w.]+)/.test(agent),
          opera : ( !!opera && opera.version ),
          webkit  : ( agent.indexOf( ' applewebkit/' ) > -1 ),
          mac : ( agent.indexOf( 'macintosh' ) > -1 ),
          quirks : ( document.compatMode == 'BackCompat' )
        };
    browser.gecko =( navigator.product == 'Gecko' && !browser.webkit && !browser.opera && !browser.ie);
    var version = 0;
    if ( browser.ie ){
        var v1 =  agent.match(/(?:msie\s([\w.]+))/);
        var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
        if(v1 && v2 && v1[1] && v2[1]){
            version = Math.max(v1[1]*1,v2[1]*1);
        }else if(v1 && v1[1]){
            version = v1[1]*1;
        }else if(v2 && v2[1]){
            version = v2[1]*1;
        }else{
            version = 0;
        }

        browser.ie11Compat = document.documentMode == 11;
        browser.ie9Compat = document.documentMode == 9;
        browser.ie8 = !!document.documentMode;
        browser.ie8Compat = document.documentMode == 8;
        browser.ie7Compat = ( ( version == 7 && !document.documentMode ) || document.documentMode == 7 );
        browser.ie6Compat = ( version < 7 || browser.quirks );
        browser.ie9above = version > 8;
        browser.ie9below = version < 9;
        browser.ie11above = version > 10;
        browser.ie11below = version < 11;
    }

    // Gecko.
    if ( browser.gecko ){
        var geckoRelease = agent.match( /rv:([\d\.]+)/ );
        if ( geckoRelease )
        {
            geckoRelease = geckoRelease[1].split( '.' );
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }

    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = + RegExp['\x241'];
    }

    if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
      browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
    }

    // Opera 9.50+
    if ( browser.opera )
        version = parseFloat( opera.version() );

    // WebKit 522+ (Safari 3+)
    if ( browser.webkit )
        version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

    browser.version = version;
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
  }();

  /**
   * 字符串工具类
   * Author: Alpha Tan
   * Date: 2014/1/1
   */
  String.prototype.formatURI = function(){
    var s = this.toString();
    for(var i in arguments){
      s = s.replace('{' + i+'}', arguments[i].encode());
    }
    return s;
  };

  String.prototype.encode = function(){
    return encodeURI(this);
  };

  String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, '');
  };

  String.prototype.ltrim = function(){
    return this.replace(/(^\s*)/g, '');
  };

  String.prototype.rtrim = function(){
    return this.replace(/(\s*$)/g, '');
  };

  if(!window.console){
    var console = {
      log : function(){},
      trace : function(){},
      debug : function(){},
      info : function(){},
      warn : function(){},
      error : function(){},
      clear : function(){}
    };
    window.console = console;
  }
})();