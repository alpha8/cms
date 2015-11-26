'use strict';

/**
 * Yihu前端组件命名空间声明 
 *
 * 启动angular有两种方法
 *    1.自动加载：html页面指令ng-app入口(一个页面只允许出现一个ng-app)
 *    2.手动加载：js中直接调用angular.bootstrap(element, [module]);
 *
 * angular.element(document).ready(function(){
 *   angular.boostrap(angular.element(document), ['Yihu']);
 * })
 * 
 * Author: Alpha Tan 
 */
var Yihu = angular.module('Yihu', ['ui.bootstrap', 'ngRoute', 'ngCookies','pascalprecht.translate'])

/**
 * Yihu前端路由配置，后续采用angular-ui-router替换
 */
.config(['$routeProvider','$locationProvider','$sceProvider', function ($routeProvider, $locationProvider, $sceProvider){
  $routeProvider
    .when('/', {controller: 'DemoCtrl'})
    .otherwise({redirectTo:'/'});
  $locationProvider.html5Mode(true);
}])

/**
 * 国际化配置
 */
.config(function($translateProvider){
  $translateProvider.useCookieStorage();

  //动态加载
  $translateProvider.useUrlLoader('/api/lang');

  //静态加载
  /* 
  $translateProvider
    .translations('en', {
      LANG:'Language: English'
    })
    .translations('zh', {
      LANG:'当前语种：中文'
    });
  */
  $translateProvider.preferredLanguage('en');
})

/**
 * 变更当前国际化语种
 */
.controller('LocaleController', function($translate, $scope){
  $scope.langKey = $translate.preferredLanguage();

  $scope.changeLanguage = function(langKey){
    $translate.use(langKey);    
    $scope.langKey = langKey;
  };
});


/**
 * TAB组件
 * 
 * 样例：
 * <tabs>
 *   <pane title="Tab1">
 *     <div>This is tab1 content.</div>
 *    </pane>
 *    <pane title="Tab2">      
 *      <div>This is tab2 content.</div>
 *    </pane>
 * </tabls>
 */
Yihu.directive('tabs', function(){
  return {
    restrict:'E',
    transclude:true,
    scope:{},
    controller:["$scope", function($scope){
      var panels = $scope.panels = [];

      $scope.select = function(panel){
        angular.forEach(panels, function(panel){
          panel.selected = false;
        });
        panel.selected = true;
      };

      this.addPanel = function(panel){
        if(panels.length === 0){
          $scope.select(panel);
        }
        panels.push(panel);
      };
    }],
    template:
      '<div class="tabble">'+
      '<ul class="nav nav-tabs">' +
        '<li ng-repeat="panel in panels" ng-class="{active:panel.selected}">' + 
          '<a href="" ng-click="select(panel)" class="J_menuTab">{{panel.title}}</a>' + 
        '</li>' + 
      '</ul>' + 
      '<div class="tab-content" ng-transclude></div>' + 
      '</div>',
    replace:true
  };
})

/**
 * TAB pane, TAB内置Pane指令，依赖tabs
 */
.directive('pane', function(){
  return {
    require:'^tabs',
    restrict:'E',
    transclude:true,
    scope:{
      title:'@'
    },
    link:function(scope, element, attrs, tabsCtrl){
      tabsCtrl.addPanel(scope);
    },
    template: '<div class="tab-pane" ng-class="{active:selected}" ng-transclude></div>',
    replace:true
  };
})

/**
 * Login登录指令，模板页面可订制
 *
 * 样例：
 * <login></login>
 */
.directive('login', function(){
  return {
    restrict:'E',
    scope:{},
    templateUrl:'../partials/loginForm.html',
    replace:true
  };
})

/** 
 * 表单整数指令
 *
 * 样例：
 * <input type="number" integer name="num1"/>
 * 非整数则返回验证失败，使用form.num1.$invalid显示隐藏错误提示
 */
.directive('integer', function(){
  var INTEGER_REGEXP = /^\-?\d*$/;
  return {
    require : 'ngModel',
    link : function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
})

/**
 * 表单浮点数指令
 * 
 * 样例：
 * <input type="number" smartfloat name="num1"/>
 * 非浮点数则返回验证失败，使用form.num1.$invalid显示隐藏错误提示
 */
.directive('smartfloat', function(){
  var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
  return {
    require : 'ngModel',
    link : function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          return parseFloat(viewValue.replace(',','.'));
        } else {
          ctrl.$setValidity('float', false);
          return undefined;
        }
      });
    }
  };
})

/**
 * 表单远程验证有效性
 *
 * <input type="text" name="username" remotecheck /> * 
 * 服务端返回验证失败，使用form.username.$invalid显示隐藏错误提示
 */
.directive('remotecheck', function($http){
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function () {
        var text = element.val();
        if(text){
          $http({
            method: 'POST', 
            url: '/api/check/' + attrs.name,
            data:{'field' : element.val()}
          }).success(function(data, status, headers, config) {
            ctrl.$setValidity('remote', data.result);
          }).error(function(data, status, headers, config) {
            ctrl.$setValidity('remote', false);
          }); 
        }
      });
    }
  };
});


/**
 * 注射器加载完所有模块后，只执行一次
 */
Yihu.run(function(){
  console.log('欢迎使用一虎一席组件库。');
});

/** 
 * 三级导航组件
 */
Yihu.controller('NavbarCtrl', function ($scope, $http){
  $http.get('/javascripts/nav.json').success(function(json){
    $scope.navbar = json;
  });
})


/**
 * 用户登录控制器
 */
.controller('UserLoginCtrl', function($scope){
  $scope.formOption = {
    action : '#'
  };

  $scope.signIn = function(valid){
    if(valid){
      alert('save');
    }
  };
});

