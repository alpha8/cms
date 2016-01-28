(function(){
  'use strict';

  /**
   * Yihu前端组件命名空间声明 
   *
   * 启动angular有两种方法
   *    1.自动加载：html页面指令ng-app入口(一个页面只允许出现一个ng-app)
   *    2.手动加载：js中直接调用angular.bootstrap(element, [module]);
   *
   * angular.element(document).ready(function(){
   *   angular.bootstrap(angular.element(document), ['Yihu']);
   * })
   * 
   * Author: Alpha Tan 
   */
  var Yihu = angular.module('Yihu', ['ui.bootstrap','ui.grid','ui.router','ngCookies','pascalprecht.translate', 'Yihu.ui','UserListModule','YihuCommonModule','ArticleListModule','CategoryListModule','DerivativiesListModule','FilesListModule','CustomerListModule','ProductListModule', 'CmsServices','CmsTemplates','ncy-angular-breadcrumb','ngKeditor'])

  /**
   * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
   * 这里的run方法只会在angular启动的时候运行一次。
   * @param  {[type]} $rootScope
   * @param  {[type]} $state
   * @param  {[type]} $stateParams
   * @return {[type]}
   */
  .run(function($rootScope, $state, $stateParams, $log, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$log = $log;

    $log.info('欢迎使用一虎一席组件库。');

    $http.get('/javascripts/nav.json')
    .success(function(json){
      $rootScope.navbar = json;
    });


    $rootScope.options = {
      uploadJson: '/editor/upload/images',
      fileManagerJson: '/editor/filemanager',
      allowFileManager: true,
      width:'100%',
      height:'280px'
    };
  })

  /**
   * Yihu前端路由配置，采用angular-ui-router替换
   */
  .config(function($stateProvider, $urlRouterProvider, $breadcrumbProvider){
    $breadcrumbProvider.setOptions({
      prefixStateName: 'index'
    });

    $urlRouterProvider.otherwise('/index');

    $stateProvider.state('index', {
      url:'/index',
      templateUrl:'tpls/main.html',
      ncyBreadcrumb: {
        label: 'Home',
        icon: 'fa fa-home'
      }
    })
    .state('userlist', {
      url:'/user/:userType',
      templateUrl:'tpls/user/userGrid.html',
      controller:'UserListCtrl',
      ncyBreadcrumb: {
        label: '用户管理'
      }
    })
    .state('userlist.addUser', {
      url:'/add',
      views:{
        '@':{
          templateUrl:'tpls/user/add.html'
        }
      },
      ncyBreadcrumb: {
        label: '新增用户',
        parent: 'userlist'
      }
    })
    .state('userlist.editUser', {
      url:'/edit/:id',
      views:{
        '@':{
          templateUrl:'tpls/user/edit.html'
        }
      },
      ncyBreadcrumb: {
        label: '更新用户',
        parent: 'userlist'
      }
    })
    .state('article', {
      url:'/article',
      templateUrl:'tpls/article/grid.html',
      controller:'ArticleListCtrl',
      ncyBreadcrumb: {
        label: '文章管理'
      }
    })
    .state('article.addArticle', {
      url:'/add',
      views: {
        "@" : {
          templateUrl:'tpls/article/add.html',
          controller:'AddArticleCtrl'
        }
      },
      ncyBreadcrumb: {
        label: '新增文章',
        parent: 'article'
      }, 
      resolve:{
        Categories: function(CategoryService){
          var article = {};
          CategoryService.getList({}, {currentPage:1,pageSize:500}, function(data){
            article.categoryList = data.categories;
          });
          return article;
        }
      }
    })
    .state('article.editArticle', {
      url:'/edit/{id:.*}',
      views: {
        "@" : {
          templateUrl:'tpls/article/edit.html',
          controller:'EditArticleCtrl'
        }
      },
      ncyBreadcrumb: {
        label: '更新文章',
        parent: 'article'
      },
      resolve:{
        Categories: function($q, $stateParams, CategoryService, ArticleService){
          var article = {};

          $q.all([
            CategoryService.getList({}, {currentPage:1,pageSize:500}).$promise,
            ArticleService.findOne({id: $stateParams.id}).$promise
          ]).then(function(results){
            article.categoryList = results[0].categories;
            var articleObj = results[1];
            angular.extend(article, articleObj);
          });
          return article;
        }
      }
    })
    .state('categories', {
      url:'/category/grid',
      templateUrl:'tpls/category/grid.html',
      controller:'CategoryListCtrl',
      ncyBreadcrumb: {
        label: '分类管理'
      }
    })
    .state('categories.addCategory', {
      url:'/category/add',
      views: {
        "@" : {
          templateUrl:'tpls/category/add.html'
        }
      },
      ncyBreadcrumb: {
        label: '新增分类',
        parent: 'categories'
      }
    })
    .state('files', {
      url:'/files',
      templateUrl:'tpls/files/grid.html',
      controller:'FilesListCtrl',
      ncyBreadcrumb: {
        label: '文件管理'
      }
    })
    .state('customers', {
      url:'/customers',
      templateUrl:'tpls/customer/main.html',
      controller:'CustomerListCtrl',
      ncyBreadcrumb: {
        label: '客户管理'
      }
    })
    .state('products', {
      url:'/products',
      templateUrl:'tpls/product/grid.html',
      controller:'ProductListCtrl',
      ncyBreadcrumb: {
        label: '产品管理'
      },
      resolve:{
        Artwork:function($q, BasicService){
          var artwork = {};

          $q.all([
            BasicService.getArtworkCategory({}).$promise, 
            BasicService.getArtworkType({}).$promise,
            BasicService.getCommodityStates({}).$promise
          ]).then(function(results){
            artwork.categoryList = results[0].info;
            artwork.typeList = results[1].info;
            artwork.commodityStatesList = results[2].info;
          });
          return artwork; 
        }
      }
    })
    .state('products.addProduct', {
      url:'/add',
      views: {
        "@" : {
          templateUrl:'tpls/product/add.html',
          controller:'AddProductCtrl'
        }
      },
      ncyBreadcrumb: {
        label: '新增艺术品',
        parent: 'products'
      },
      resolve:{
        Artwork:function($q, BasicService){
          var artwork = {unit:'cm'};

          $q.all([
            BasicService.getArtworkCategory({}).$promise, 
            BasicService.getArtworkAuthor({}).$promise,
            BasicService.getArtworkType({}).$promise,
            BasicService.getCommodityStates({}).$promise
          ]).then(function(results){
            artwork.categoryList = results[0].info;
            artwork.artistList = results[1].info;
            artwork.typeList = results[2].info;
            artwork.commodityStatesList = results[3].info;
          });
          return artwork; 
        }
      }
    })
    .state('products.editProduct', {
      url:'/edit/:id',
      views: {
        "@" : {
          templateUrl:'tpls/product/edit.html',
          controller:'EditProductCtrl',
        }
      },
      ncyBreadcrumb: {
        label: '更新艺术品',
        parent: 'products'
      },
      resolve:{
        Artwork:function($q, $stateParams, BasicService,ArtworkService){
          var artwork = {};

          $q.all([
            BasicService.getArtworkCategory({}).$promise, 
            BasicService.getArtworkAuthor({}).$promise,
            BasicService.getArtworkType({}).$promise,
            BasicService.getCommodityStates({}).$promise, 
            ArtworkService.findOne({id:$stateParams.id}).$promise
          ]).then(function(results){
            artwork.categoryList = results[0].info;
            artwork.artistList = results[1].info;
            artwork.typeList = results[2].info;
            artwork.commodityStatesList = results[3].info;

            var artworkObj = results[4];
            angular.extend(artwork, artworkObj);
            artwork.author = artworkObj.artworkAuthor.id;
            artwork.category = artworkObj.artworkCategory.id;
            artwork.type = artworkObj.artworkType && artworkObj.artworkType.id;
            artwork.status = artworkObj.commodityStates.id;
          });
          return artwork; 
        }
      }
    })
    .state('derivatives', {
      url:'/derivatives',
      templateUrl:'tpls/derivatives/grid.html',
      controller:'DerivativiesListCtrl',
      ncyBreadcrumb: {
        label: '衍生品管理'
      },
      resolve:{
        Derivativies:function($q, BasicService){
          var derivativies = {};

          $q.all([
            BasicService.getDerivativesCategories({}).$promise, 
            BasicService.getCommodityStates({}).$promise
          ]).then(function(results){
            derivativies.categoryList = results[0].info;
            derivativies.commodityStatesList = results[1].info;
          });
          return derivativies; 
        }
      }
    })
    .state('derivatives.addDerivativies', {
      url:'/add',
      views: {
        "@" : {
          templateUrl:'tpls/derivatives/add.html',
          controller:'AddDerivativiesCtrl'
        }
      },
      ncyBreadcrumb: {
        label: '新增衍生品',
        parent: 'derivatives'
      },
      resolve:{
        Derivativies:function($q, BasicService){
          var derivativies = {};

          $q.all([
            BasicService.getDerivativesCategories({}).$promise, 
            BasicService.getCommodityStates({}).$promise,
            BasicService.getArtworkAuthor({}).$promise,
            BasicService.getMaterialList({}).$promise,
          ]).then(function(results){
            derivativies.categoryList = results[0].info;
            derivativies.commodityStatesList = results[1].info;
            derivativies.artistList = results[2].info;
            derivativies.materialList = results[3].info;
          });
          return derivativies; 
        }
      }
    })
    .state('derivatives.editDerivativies', {
      url:'/edit',
      views: {
        "@" : {
          templateUrl:'tpls/derivatives/edit.html',
          controller:'EditDerivativiesCtrl'
        }
      },
      ncyBreadcrumb: {
        label: '更新衍生品',
        parent: 'derivatives'
      },
      resolve:{
        Derivativies:function($q, BasicService, DerivativiesService){
          var derivativies = {};

          $q.all([
            BasicService.getDerivativesCategories({}).$promise, 
            BasicService.getCommodityStates({}).$promise,
            BasicService.getArtworkAuthor({}).$promise,
            BasicService.getMaterialList({}).$promise,
            DerivativiesService.findOne({id:$stateParams.id}).$promise
          ]).then(function(results){
            derivativies.categoryList = results[0].info;
            derivativies.commodityStatesList = results[1].info;
            derivativies.artistList = results[2].info;
            derivativies.materialList = results[3].info;

            var derivativiesObj = results[4];
            angular.extend(derivativies, derivativiesObj);
          });
          return derivativies; 
        }
      }
    });
  })

  /**
   * 国际化配置
   */
  .config(function($translateProvider){
    $translateProvider.storageKey('lang');
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
  .controller('LocaleController', function($translate, $rootScope){
    $rootScope.langKey = $translate.preferredLanguage();

    $scope.changeLanguage = function(langKey){
      $translate.use(langKey);    
      $rootScope.langKey = langKey;
    };
  })

  /** 
   * 三级导航组件
   */
  .controller('NavbarCtrl', function ($scope, $http){
    $scope.logo = {
      "text":"一虎一席", 
      "link":"index"
    };

    $scope.topbar = {
      "messages":{
        "list": [{
          "link":"#",
          "text":"您有6条未读消息",
          "icon":"fa-envelope",
          "time":"1分钟前",
          "count":6
        },{
          "link":"#",
          "text":"2条新回复",
          "icon":"fa-qq",
          "time":"1天前",
          "count":2
        }],
        "more":{
          "link":"#",
          "text":"查看所有"
        },
        "total":8
      },
      setting:[{
        link:"setting",
        text:"系统设置",
        icon:"fa-gear"
      },{
        link:"message",
        text:"我的消息",
        icon:"fa-comments-o"
      },{
        link:"follow",
        text:"我的关注",
        icon:"fa-heart-o"
      },{
        link:"stats",
        text:"用户统计",
        icon:"fa-line-chart"
      },{
        link:"logOff",
        text:"退出登录",
        icon:"fa-power-off"
      }]
    };
  })

  .controller('AccordionDemoCtrl', function ($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: '系统管理',
        content: '数据字典',
        link:'#'
      },
      {
        title: '用户管理',
        content: '用户组',
        link:'#'
      }
    ];
  })

  .filter('trustHtml', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  });

})();