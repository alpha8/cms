(function(){
  'use strict';

  angular.module("Yihu.ui", [])

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
  .directive('tabs', function(){
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
            '<a href="javascript:;" ng-click="select(panel)" class="J_menuTab"><i class="{{panel.icon}}" ng-if="panel.icon"></i>{{panel.title}}</a>' + 
          '</li>' + 
        '</ul>' + 
        '<div class="tab-content" ng-transclude></div>' + 
        '</div>',
      replace:true
    };
  })

  /**
   * TAB panel, TAB内置Pane指令，依赖tabs
   */
  .directive('panel', function(){
    return {
      require:'^tabs',
      restrict:'E',
      transclude:true,
      scope:{
        title:'@',
        icon:'@'
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
  })

  .directive('breadcrumb', function(){
    return {
      restrict:'AE',
      template:
        '<ol class="breadcrumb">'+
          '<li ng-repeat="item in items">'+
            '<span ng-hide="item.link" ng-if="!item.link" ng-bind="item.text"></span>'+
            '<a ng-if="item.link" ng-show="item.link" ui-sref="{{item.link}}">{{item.text}}</a>'+
          '</li>'+
        '</ol>',
      transclude:true,
      replace:true
    };
  })

  .directive('icheck', function($timeout, $parse) {
    return {
      require: 'ngModel',
      link: function($scope, element, $attrs, ngModel) {
        return $timeout(function() {
          var value = $attrs.value;
          $scope.$watch($attrs.ngModel, function(newValue){
            $(element).iCheck('update');
          });

          return $(element).iCheck({
           checkboxClass: 'icheckbox_square-green',
           radioClass: 'iradio_square-green'
          }).on('ifChanged', function(event) {
            if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
              $scope.$apply(function() {
                return ngModel.$setViewValue(event.target.checked);
              });
            }
            if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
              return $scope.$apply(function() {
                return ngModel.$setViewValue(value);
              });
            }
          });
        });
      }
    };
  })

  .directive('idate', function(){
    return {
      restrict:'A',
      link:function(scope, element, attrs){
        laydate.skin('molv');

        $(element).addClass("laydate-icon").click(function(){
          laydate({
            elem:'#'+$(element).attr('id'),
            format: 'YYYY-MM-DD', //日期格式
            istime: false, //是否开启时间选择
            isclear: true, //是否显示清空
            istoday: true, //是否显示今天
            issure: true, //是否显示确认
            festival: true, //是否显示节日
            fixed: false, //是否固定在可视区域
            start: laydate.now(),    //开始日期
            zIndex: 99999999, //css z-index
            choose: function(dates){ //选择好日期的回调 
            }
          });
        });
      }
    };
  })

  //文件管理列表显示指令
  .directive("filegrid", function(){
    return {
      restrict:'AE',
      template:'<div class="file-box" ng-repeat="item in gridData.files">'+
        '<div class="file">'+
          '<div class="item-select">'+
            '<i class="icon-check checkbox"></i>'+
          '</div>'+
          '<a href="javascript:void(0)" ng-click="fireAction(item)" title="{{item.fileName}}">'+
            '<div class="image" ng-if="item.fileType==\'image\'">'+
              '<img alt="image" class="img-responsive" ng-if="item.thumbs.icon" ng-src="{{item.thumbs.icon}}">'+
            '</div>'+
            '<div class="icon" ng-if="item.fileType==\'video\' || item.fileType==\'audio\'">'+
              '<img alt="image" class="img-responsive" ng-if="item.thumbs.icon" ng-src="{{item.thumbs.icon}}">' +
              '<i class="play-icon"></i>'+
            '</div>'+
            '<div class="icon" ng-if="item.fileType==\'file\'">'+
              '<i class="folder-icons cloudfile"></i>'+
            '</div>'+
            '<div class="icon" ng-if="item.fileType==\'folder\' || item.isDirectory">'+
              '<i class="folder-icons folder"></i>'+
            '</div>'+
            '<span class="corner"></span>'+
          '</a>'+
          '<div class="file-name">'+
            '<small>{{item.fileName}}</small>'+
          '</div>'+
        '</div>'+
      '</div>',
      transclude:true,
      replace:true
    };
  })

  .directive('opbreadcrumb', function(){
    return {
      restrict:'AC',
      link:function($scope, elements, attrs){
        var watcher = $scope.$watch('nav.current', function(newValue, oldValue){
          var breadcrumbs = $scope.breadcrumbs;
          var opPrev = $("#op-prev");
          if(breadcrumbs.length==1){
            opPrev.hide();
          }else if(breadcrumbs.length>1){
            opPrev.show();
          }
        });

        $scope.$on("$destroy", function(){
          watcher();
        });
      }
    };
  })

  /** 文件管理器选择指令 */
  .directive('checkbox', function(){
    return {
      restrict:'AC',
      link:function(scope, element, attrs){
        var id = $(element).attr("id");        
        $(element).click(function(){
          var checkNum = scope.opbar.checkNum;
          var showToolbar = scope.opbar.showToolbar;

          if(id=='checkAll'){
            if($(this).parent().hasClass("item-checked")){
              showToolbar = false;
              $(".checkbox").parent().removeClass("item-checked");
              checkNum = 0;
            }else{
              checkNum = $(".checkbox").length-1;
              $(".checkbox").parent().addClass("item-checked");
              showToolbar = true;
            }
          }else{
            $("#checkAll").parent().removeClass("item-checked");
            $(this).parent().toggleClass("item-checked");

            if($(this).parent().hasClass("item-checked")){
              checkNum++;
            }else{
              checkNum--;
            }
            if(checkNum===0){
              showToolbar = false;
            }else{
              showToolbar = true;
            }
            if(checkNum==$(".checkbox").length-1){
              $("#checkAll").parent().addClass("item-checked");
            }
          }

          scope.$apply(function(){
            scope.opbar.checkNum = checkNum;
            scope.opbar.showToolbar = showToolbar;
          });
        });

      }
    };
  });
 
})();  


/**
 * @license AngularJS v1.2.9
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 * Created by Zed on 19-11-2014.
 */
 (function (window, angular) {
  'use strict';

  angular.module('ngKeditor', [])
  .directive('keditor', function () {
    var linkFn = function (scope, elm, attr, ctrl) {
      if (typeof KindEditor === 'undefined') {
        console.error('Please import the local resources of kindeditor!');
        return;
      }

      var _config = {
        width: '100%',
        autoHeightMode: false,
        afterCreate: function () {
          this.loadPlugin('autoheight');
        }
      };
      var editor;

      var editorId = elm[0],
      editorConfig = scope.config || _config;

      editorConfig.afterChange = function () {
        if (!scope.$$phase) {
          ctrl.$setViewValue(this.html());
            // exception happens here when angular is 1.2.28
            // scope.$apply();
        }

      };

      if (KindEditor) {
        editor = KindEditor.create(editorId, editorConfig);
      }

      var watcher = scope.$watch('article.content', function(newValue, oldValue){
        watcher();

        setTimeout(function(){
          editor.html($(elm).val());
        }, 50);
      });

      ctrl.$parsers.push(function (viewValue) {
        ctrl.$setValidity('keditor', viewValue);
        return viewValue;
      });
    };

    return {
      require: 'ngModel',
      scope: { config: '=config' },
      link: linkFn
    };
  });

})(window, window.angular);