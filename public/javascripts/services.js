var cmsService = angular.module('CmsServices', ['ngResource']);

/**
 * constant和value主要就是用于存放一些数据或方法以供使用, 区别是constant一般是存放固定内容,value存放可能会被修改的内容
 *
 * value可以被修饰：
 * app.config(function($provide){
    $provide.decorator("myConfig",function($delegate){
      $delegate.money = "100w";
      return $delegate
    })
   });
 */
cmsService.constant("Config", {
  env:'dev',  //dev, sit, uat, pro
  profiles:{
    dev:{
      context: 'http://localhost:8088/cms'
    },
    sit:{
      context: 'http://localhost:9000/cms'
    }
  }
});

/**
 * 基础服务
 */
cmsService.factory('BasicService', function($resource, Config){
  var ctx = Config.profiles[Config.env].context;
  return $resource('/api', {}, {
    //获取分类列表
    getArtworkCategory:{
      url: ctx+'/artworkCategory/listAll',
      method:'GET',
      cache:true
    },

    //获取艺术家列表
    getArtworkAuthor:{
      url: ctx+'/artworkAuthor/listAll',
      method:'GET',
      cache:true
    }, 

    //获取类型列表
    getArtworkType:{
      url: ctx+'/artworkType/listAll',
      method:'GET',
      cache:true
    }, 

    //获取状态列表
    getCommodityStates:{
      url: ctx+'/commodityStates/listAll',
      method:'GET',
      cache:true
    },

    //获取衍生品分类列表
    getDerivativesCategories:{
      url: ctx+'/derivativesCategory/listAll',
      method:'GET',
      cache:true
    }, 

    getMaterialList:{
      url: ctx+'/material/listAll',
      method:'GET',
      cache:true
    }
  });
});

/**
 * 艺术品服务
 */
cmsService.factory('ArtworkService', function($resource, Config){
  var artworkUrl = Config.profiles[Config.env].context + '/artwork';
  return $resource(artworkUrl, {}, {
    //获取艺术品分页列表
    getList:{
      url: artworkUrl+'/list',
      method:'POST', 
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params:{
        curPage:'@pageNumber', 
        pageSize:'@pageSize'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    }, 

    findOne:{
      url: artworkUrl + '/:id',
      method:'GET'
    }, 

    //新增艺术品
    create:{
      method:'POST',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //更新艺术品信息
    update:{
      method:'PUT',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //删除艺术品
    remove:{
      url: artworkUrl + '/:id',
      method:'DELETE'
    }

  });
});


/**
 * 衍生品服务
 */
cmsService.factory('DerivativiesService', function($resource, Config){
  var ctx = Config.profiles[Config.env].context + '/derivatives';
  return $resource(ctx, {}, {
    //获取衍生品分页列表
    getList:{
      url: ctx+'/list',
      method:'POST', 
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params:{
        curPage:'@pageNumber', 
        pageSize:'@pageSize', 
        category:'@category'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    }, 

    findOne:{
      url: ctx + '/:id',
      method:'GET'
    }, 

    //新增衍生品
    create:{
      method:'POST',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //更新衍生品信息
    update:{
      method:'PUT',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //删除衍生品
    remove:{
      url: ctx + '/:id',
      method:'DELETE'
    }

  });
});

/**
 * 文章管理服务
 */
cmsService.factory('ArticleService', function($resource, Config){
  var ctx = Config.profiles.sit.context + '/article';
  return $resource(ctx, {}, {
    //获取分页列表
    getList:{
      url:ctx +'/list',
      method:'POST', 
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    }, 

    findOne:{
      method:'GET',
      url:ctx +'/:id'
    }, 

    //新增
    create:{
      method:'POST',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //更新信息
    update:{
      url:ctx +'/:id',
      method:'PUT',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //删除
    remove:{
      url:ctx +'/:id',
      method:'DELETE'
    }

  });
});


/**
 * 分类管理服务
 */
cmsService.factory('CategoryService', function($resource, Config){
  var ctx = Config.profiles.sit.context + '/articleCategory';
  return $resource(ctx, {}, {
    //获取分页列表
    getList:{
      url:ctx +'/list',
      method:'POST', 
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    }, 

    findOne:{
      method:'GET',
      url:ctx +'/:id'
    }, 

    //新增
    create:{
      method:'POST',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //更新信息
    update:{
      method:'PUT',
      headers:{
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: function(obj) {  
        return JSON.stringify(obj);  
      }
    },

    //删除
    remove:{
      method:'DELETE'
    }

  });
});

/**
 * 文件管理服务
 */
cmsService.factory('FileManagerService', function($resource, Config){
  var fmUrl = '/editor/filemanager';
  return $resource(fmUrl, {}, {
    getList:{
      url: fmUrl + '/list',
      method:'GET',
      params:{
        path:'@path',
        order:'@order'
      }
    }

  });
});


/**
 * 模板动态加载器
 * 
 * @param  {[type]} $compile          [description]
 * @param  {[type]} $document         [description]
 * @param  {[type]} $controller       [description]
 * @param  {[type]} $http             [description]
 * @param  {[type]} $q                [description]
 * @param  {[type]} $rootScope        [description]
 * @return {[type]} $templateCache    [description]
 */
cmsService.factory('templateLoader', function($compile, $document, $controller, $http, $q, $rootScope, $templateCache){
  return {
    load: fetchTemplate,
    compile: loadAndCompile
  };

  function fetchTemplate(url) {
    return $http.get(url, {cache: $templateCache})
    .then(function (response) {
      return response.data && response.data.trim();
    });
  }

  function loadAndCompile(options) {
    var extend = angular.extend, 
    opts = extend({
      template: '',
      templateUrl: '',
      scope: null,
      controller: null,
      locals: {},
      appendTo: $document[0].body
    }, options || {});

    var templatePromise = opts.templateUrl ? this.load(opts.templateUrl) : $q.when(opts.template);

    return templatePromise.then(function (template) {
      var controller;
      var scope = opts.scope || $rootScope.$new();

      //Incase template doesn't have just one root element, do this
      var element = angular.element('<div>').html(template).contents();
      if (opts.controller) {
        controller = $controller(
          opts.controller,
          extend(opts.locals, {
            $scope: scope
          })
        );
        element.children().data('$ngControllerController', controller);
      }
      if (opts.appendTo) {
        angular.element(opts.appendTo).append(element);
      }
      $compile(element)(scope);

      return {
        element: element,
        scope: scope
      };
    });
  }
})

/**
 * 动态创建模态窗口
 * @return {[type]}                 [description]
 */
.factory('myModal', function (templateLoader) {
  function createModal(modal) {
    // modal.show = function () {
    //   modal.element.addClass("in").show();
    // };
    // modal.hide = function () {
    //   modal.element.removeClass("in").hide();
    //   setTimeout(function () {
    //     modal.element.removeClass("in");
    //   }, 200);
    // };
    return modal;
  }

  return {
    loadTemplateUrl: function (url, options) {
      return templateLoader.compile({
        templateUrl: url,
        scope: options.scope
      }).then(function (modal) {
        return createModal(modal);
      });
    }
  };
});

/**
 * CMS模板功能（已支持缓存）
 */
angular.module("CmsTemplates", ["template/modal/dialog.html"]);
angular.module("template/modal/dialog.html", []).run(function($templateCache) {
  $templateCache.put("template/modal/dialog.html",
    '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
      '<div class="modal-dialog">' +
      '<div class="modal-content">' + 
         '<div class="modal-header">' + 
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
            '<h4 class="modal-title" ng-bind="modal.title"></h4>' + 
         '</div>' + 
         '<div class="modal-body" ng-bind-html="modal.body | trustHtml"></div>' + 
         '<div class="modal-footer">' + 
            '<button type="button" class="btn btn-default" data-dismiss="modal" ng-if="modal.buttons.NO" ng-bind="modal.buttons.NO"></button>' + 
            '<button type="button" class="btn btn-primary" ng-click="submitConfirm()" ng-bind="modal.buttons.YES"></button>' + 
         '</div>' + 
      '</div>' + 
  '</div>');
});


/*! angular-breadcrumb - v0.4.1
 * http://ncuillery.github.io/angular-breadcrumb
 * Copyright (c) 2015 Nicolas Cuillery; Licensed MIT 
*/
(function (window, angular, undefined) {
 'use strict';

 function isAOlderThanB(scopeA, scopeB) {
   if(angular.equals(scopeA.length, scopeB.length)) {
     return scopeA > scopeB;
   } else {
     return scopeA.length > scopeB.length;
   }
 }

 function parseStateRef(ref) {
   var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
     if (!parsed || parsed.length !== 4) { throw new Error("Invalid state ref '" + ref + "'"); }
     return { state: parsed[1], paramExpr: parsed[3] || null };
   }

   function $Breadcrumb() {

     var $$options = {
       prefixStateName: null,
       template: 'bootstrap3',
       templateUrl: null,
       includeAbstract : false
     };

     this.setOptions = function(options) {
       angular.extend($$options, options);
     };

     this.$get = ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {

       var $lastViewScope = $rootScope;

         // Early catch of $viewContentLoaded event
         $rootScope.$on('$viewContentLoaded', function (event) {
             // With nested views, the event occur several times, in "wrong" order
             if(!event.targetScope.ncyBreadcrumbIgnore &&
               isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
               $lastViewScope = event.targetScope;
           }
         });

         // Get the parent state
         var $$parentState = function(state) {
             // Check if state has explicit parent OR we try guess parent from its name
             var parent = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
             var isObjectParent = typeof parent === "object";
             // if parent is a object reference, then extract the name
             return isObjectParent ? parent.name : parent;
           };

         // Add the state in the chain if not already in and if not abstract
         var $$addStateInChain = function(chain, stateRef) {
           var conf,
           parentParams,
           ref = parseStateRef(stateRef),
           force = false,
           skip = false;

           for(var i=0, l=chain.length; i<l; i+=1) {
             if (chain[i].name === ref.state) {
               return;
             }
           }

           conf = $state.get(ref.state);
          // Get breadcrumb options
          if(conf.ncyBreadcrumb) {
            if(conf.ncyBreadcrumb.force){ force = true; }
            if(conf.ncyBreadcrumb.skip){ skip = true; }
          }
          if((!conf.abstract || $$options.includeAbstract || force) && !skip) {
           if(ref.paramExpr) {
             parentParams = $lastViewScope.$eval(ref.paramExpr);
           }

           conf.ncyBreadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
           chain.unshift(conf);
         }
       };

         // Get the state for the parent step in the breadcrumb
         var $$breadcrumbParentState = function(stateRef) {
           var ref = parseStateRef(stateRef),
           conf = $state.get(ref.state);

           if(conf.ncyBreadcrumb && conf.ncyBreadcrumb.parent) {
                 // Handle the "parent" property of the breadcrumb, override the parent/child relation of the state
                 var isFunction = typeof conf.ncyBreadcrumb.parent === 'function';
                 var parentStateRef = isFunction ? conf.ncyBreadcrumb.parent($lastViewScope) : conf.ncyBreadcrumb.parent;
                 if(parentStateRef) {
                   return parentStateRef;
                 }
               }

               return $$parentState(conf);
             };

             return {

               getTemplate: function(templates) {
                 if($$options.templateUrl) {
                     // templateUrl takes precedence over template
                     return null;
                   } else if(templates[$$options.template]) {
                     // Predefined templates (bootstrap, ...)
                     return templates[$$options.template];
                   } else {
                     return $$options.template;
                   }
                 },

                 getTemplateUrl: function() {
                   return $$options.templateUrl;
                 },

             getStatesChain: function(exitOnFirst) { // Deliberately undocumented param, see getLastStep
               var chain = [];

                 // From current state to the root
                 for(var stateRef = $state.$current.self.name; stateRef; stateRef=$$breadcrumbParentState(stateRef)) {
                   $$addStateInChain(chain, stateRef);
                   if(exitOnFirst && chain.length) {
                     return chain;
                   }
                 }

                 // Prefix state treatment
                 if($$options.prefixStateName) {
                   $$addStateInChain(chain, $$options.prefixStateName);
                 }

                 return chain;
               },

               getLastStep: function() {
                 var chain = this.getStatesChain(true);
                 return chain.length ? chain[0] : undefined;
               },

               $getLastViewScope: function() {
                 return $lastViewScope;
               }
             };
           }];
         }

         var getExpression = function(interpolationFunction) {
           if(interpolationFunction.expressions) {
             return interpolationFunction.expressions;
           } else {
             var expressions = [];
             angular.forEach(interpolationFunction.parts, function(part) {
               if(angular.isFunction(part)) {
                 expressions.push(part.exp);
               }
             });
             return expressions;
           }
         };

         var registerWatchers = function(labelWatcherArray, interpolationFunction, viewScope, step) {
           angular.forEach(getExpression(interpolationFunction), function(expression) {
             var watcher = viewScope.$watch(expression, function() {
               step.ncyBreadcrumbLabel = interpolationFunction(viewScope);
             });
             labelWatcherArray.push(watcher);
           });

         };

         var deregisterWatchers = function(labelWatcherArray) {
           angular.forEach(labelWatcherArray, function(deregisterWatch) {
             deregisterWatch();
           });
         };

         function BreadcrumbDirective($interpolate, $breadcrumb, $rootScope) {
           var $$templates = {
             bootstrap2: '<ul class="breadcrumb">' +
             '<li ng-repeat="step in steps" ng-switch="$last || !!step.abstract" ng-class="{active: $last}">' +
             '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
             '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
             '<span class="divider" ng-hide="$last">/</span>' +
             '</li>' +
             '</ul>',
             bootstrap3: '<ol class="breadcrumb">' +
             '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
             '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}"><i ng-if="step.ncyBreadcrumb.icon" class="{{step.ncyBreadcrumb.icon}}"></i> {{step.ncyBreadcrumbLabel}}</a>' +
             '<span ng-switch-when="true"><i ng-if="step.ncyBreadcrumb.icon" class="{{step.ncyBreadcrumb.icon}}"></i> {{step.ncyBreadcrumbLabel}}</span>' +
             '</li>' +
             '</ol>'
           };

           return {
             restrict: 'AE',
             replace: true,
             scope: {},
             template: $breadcrumb.getTemplate($$templates),
             templateUrl: $breadcrumb.getTemplateUrl(),
             link: {
               post: function postLink(scope) {
                 var labelWatchers = [];

                 var renderBreadcrumb = function() {
                   deregisterWatchers(labelWatchers);
                   labelWatchers = [];
                   
                   var viewScope = $breadcrumb.$getLastViewScope();
                   scope.steps = $breadcrumb.getStatesChain();
                   angular.forEach(scope.steps, function (step) {
                     if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                       var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                       step.ncyBreadcrumbLabel = parseLabel(viewScope);
                             // Watcher for further viewScope updates
                             registerWatchers(labelWatchers, parseLabel, viewScope, step);
                           } else {
                             step.ncyBreadcrumbLabel = step.name;
                           }
                         });
                 };

                 $rootScope.$on('$viewContentLoaded', function (event) {
                   if(!event.targetScope.ncyBreadcrumbIgnore) {
                     renderBreadcrumb();
                   }
                 });

                 // View(s) may be already loaded while the directive's linking
                 renderBreadcrumb();
               }
             }
           };
         }
         BreadcrumbDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

         function BreadcrumbLastDirective($interpolate, $breadcrumb, $rootScope) {

           return {
             restrict: 'A',
             scope: {},
             template: '{{ncyBreadcrumbLabel}}',
             compile: function(cElement, cAttrs) {

             // Override the default template if ncyBreadcrumbLast has a value
             var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbLast);
             if(template) {
               cElement.html(template);
             }

             return {
               post: function postLink(scope) {
                 var labelWatchers = [];

                 var renderLabel = function() {
                   deregisterWatchers(labelWatchers);
                   labelWatchers = [];

                   var viewScope = $breadcrumb.$getLastViewScope();
                   var lastStep = $breadcrumb.getLastStep();
                   if(lastStep) {
                     scope.ncyBreadcrumbLink = lastStep.ncyBreadcrumbLink;
                     if (lastStep.ncyBreadcrumb && lastStep.ncyBreadcrumb.label) {
                       var parseLabel = $interpolate(lastStep.ncyBreadcrumb.label);
                       scope.ncyBreadcrumbLabel = parseLabel(viewScope);
                                 // Watcher for further viewScope updates
                                 // Tricky last arg: the last step is the entire scope of the directive !
                                 registerWatchers(labelWatchers, parseLabel, viewScope, scope);
                               } else {
                                 scope.ncyBreadcrumbLabel = lastStep.name;
                               }
                             }
                           };

                           $rootScope.$on('$viewContentLoaded', function (event) {
                             if(!event.targetScope.ncyBreadcrumbIgnore) {
                               renderLabel();
                             }
                           });

                     // View(s) may be already loaded while the directive's linking
                     renderLabel();
                   }
                 };

               }
             };
           }
           BreadcrumbLastDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

           function BreadcrumbTextDirective($interpolate, $breadcrumb, $rootScope) {

             return {
               restrict: 'A',
               scope: {},
               template: '{{ncyBreadcrumbChain}}',

               compile: function(cElement, cAttrs) {
             // Override the default template if ncyBreadcrumbText has a value
             var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbText);
             if(template) {
               cElement.html(template);
             }

             var separator = cElement.attr(cAttrs.$attr.ncyBreadcrumbTextSeparator) || ' / ';

             return {
               post: function postLink(scope) {
                 var labelWatchers = [];

                 var registerWatchersText = function(labelWatcherArray, interpolationFunction, viewScope) {
                   angular.forEach(getExpression(interpolationFunction), function(expression) {
                     var watcher = viewScope.$watch(expression, function(newValue, oldValue) {
                       if (newValue !== oldValue) {
                         renderLabel();
                       }
                     });
                     labelWatcherArray.push(watcher);
                   });
                 };

                 var renderLabel = function() {
                   deregisterWatchers(labelWatchers);
                   labelWatchers = [];

                   var viewScope = $breadcrumb.$getLastViewScope();
                   var steps = $breadcrumb.getStatesChain();
                   var combinedLabels = [];
                   angular.forEach(steps, function (step) {
                     if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                       var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                       combinedLabels.push(parseLabel(viewScope));
                                 // Watcher for further viewScope updates
                                 registerWatchersText(labelWatchers, parseLabel, viewScope);
                               } else {
                                 combinedLabels.push(step.name);
                               }
                             });

                   scope.ncyBreadcrumbChain = combinedLabels.join(separator);
                 };

                 $rootScope.$on('$viewContentLoaded', function (event) {
                   if(!event.targetScope.ncyBreadcrumbIgnore) {
                     renderLabel();
                   }
                 });

                     // View(s) may be already loaded while the directive's linking
                     renderLabel();
                   }
                 };

               }
             };
           }
           BreadcrumbTextDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

           angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
           .provider('$breadcrumb', $Breadcrumb)
           .directive('ncyBreadcrumb', BreadcrumbDirective)
           .directive('ncyBreadcrumbLast', BreadcrumbLastDirective)
           .directive('ncyBreadcrumbText', BreadcrumbTextDirective);
         })(window, window.angular);