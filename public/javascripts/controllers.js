/**
 * 通用模块
 * @type {[type]}
 */
var commonModule = angular.module('YihuCommonModule', [])
//面包屑
.controller('BreadCrumbCtrl', function($scope, $state){
  $scope.items = [{
    text:'Home',
    link:'index'
  }];

  var current = $state.current.name;
  if('userlist'===current){
    $scope.items.push({
      text:'用户管理',
      link:'userlist({userType:0})'
    });
    $scope.items.push({
      text:'用户分类'
    });
  }else if('articlelist'===current){
    $scope.items.push({
      text:'文章管理',
      link:'articlelist'
    });
    $scope.items.push({
      text:'文章列表'
    });
  }else if('files'===current){
    $scope.items.push({
      text:'文件管理',
      link:'files'
    });
    $scope.items.push({
      text:'文件列表'
    });
  }else if('customers'===current){
    $scope.items.push({
      text:'客户管理',
      link:'customers'
    });
    $scope.items.push({
      text:'客户列表'
    });
  }else if('products'===current){
    $scope.items.push({
      text:'产品管理',
      link:'products'
    });
    $scope.items.push({
      text:'产品列表'
    });
  }
})
//左侧导航
.controller('LeftNavCtrl', function($scope, $state){
  var current = $state.current.name;
  if('userlist'===current){
    $scope.navMenu = [{
      "title":"用户分类",
      "isFirstOpen":true,
      "children":[{
        "icon":"fa fa-users",
        "link":"userlist({userType:0})",
        "text":"全部"
      },{
        "icon":"fa fa-diamond",
        "link":"userlist({userType:1})",
        "text":"VIP用户"
      },{
        "icon":"fa fa-user",
        "link":"userlist({userType:2})",
        "text":"普通用户"
      },{
        "icon":"fa fa-user-secret",
        "link":"userlist({userType:9})",
        "text":"黑名单"
      }]
    }];
  }

});

/**
 * [userListModule description]
 *
 * export feature:
 *  enableRowHeaderSelection: false,
    modifierKeysToMultiSelect: true,
    exporterCsvFilename: 'myFile.csv',
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

 * @type {Object}
 */
var userListModule = angular.module("UserListModule", ['ui.grid.pagination', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns']);  //'ui.grid.exporter': grid's div need to add new directive:ui-grid-exporter  -> 'ui.grid.cellNav',
userListModule.controller('UserListCtrl', function($scope, $http, $q, $state, $stateParams, uiGridConstants, $log) {
  $scope.toggleFiltering = function(){
    $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
  };

  $scope.deleteUser = function(){
    if(confirm('请确认是否删除？')){
      console.log('one record had deleted.');
    }
  };

  $scope.print = function(){
    if($scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      // var columns = $scope.gridApi.grid.columns;
      angular.forEach(rows, function(row, index){
        $log.info(row.entity);
      });
    }
  };

  $scope.lockUser = function(){
    alert('lock user...');
  };

  $scope.gridOptions = {
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    enableFiltering: false,
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:true    
  };
  
  /**
   * [onRegisterApi description]
   *
   * gridApi.selection.on.rowSelectionChanged($scope,function(row){
      var msg = 'row selected ' + row.isSelected;
      $log.log(msg);
    });

    gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
      var msg = 'rows changed ' + rows.length;
      $log.log(msg);
    });

    $scope.gridApi.core.on.sortChanged($scope, function(grid, sort){
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    });

   * @param  {[type]} gridApi [description]
   * @return {[type]}         [description]
   */
  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi;    
  };
  
  $scope.gridOptions.columnDefs = [{
      field: 'userName',
      displayName: '用户名'
      // ,visible: false
    }, {
      field: 'gender',
      displayName: '性别',
      cellFilter: 'mapGender',
      filter: {
        noTerm: true, 
        type: uiGridConstants.filter.SELECT,
        selectOptions: [
          {value: '1', label: '男'}, 
          {value: '0', label: '女'}
        ]
      }
      // enableColumnResizing:false,
      // enableColumnMoving:false
    }, {
      field: 'birthday',
      displayName: '出生日期',
      type: 'date',
      allowCellFocus:false
    }, {
      field: 'userType',
      displayName: '类型',
      cellFilter:'mapUserType',
      filter: {
        noTerm: true,  //term: '1',
        type: uiGridConstants.filter.SELECT,
        selectOptions: [
          {value: '1', label: 'VIP用户'}, 
          {value: '2', label: '普通用户'},
          {value: '9', label: '黑名单'}
        ]
      }
    }, {
      name: 'id',
      displayName: '操作',
      cellTemplate: '<a class="btn-small" ui-sref=".editUser({id:{{COL_FIELD}}})">修改</a>',
      enableFiltering: false
    }
  ];

  $scope.paginationGridOptions = {
    paginationPageSizes: [5, 10, 50, 100],
    paginationPageSize: 5
  };
  angular.extend($scope.gridOptions, $scope.paginationGridOptions);

  var canceller = $q.defer();
  $http.get('/user/list/'+$stateParams.userType, {timeout:canceller.promise})
  .success(function(data) {
    $scope.gridOptions.data = data;
  });

  $scope.search = function(){
    var canceller = $q.defer();
    $http.get('/user/search?keyword='+($scope.keyword || ''), {timeout:canceller.promise})
    .success(function(data) {
      $scope.gridOptions.data = data;
    });
    
    $scope.$on('$destroy', function(){
      canceller.resolve();  //如果http请求未完成，则终止
    });
  };
  
  $scope.$on('$destroy', function(){
    canceller.resolve();  //如果http请求未完成，则终止
  });
})
.filter('mapGender', function(){
  var genderHash = {
    0:'女',
    1:'男'
  };
  return function(input){
    return genderHash[input];
  };
})
.filter('mapUserType', function(){
  var userTypeHash = {
    1:'VIP用户',
    2:'普通用户',
    3:'黑名单'
  };
  return function(input){
    if(!input){
      return 'Unknown';
    }
    return userTypeHash[input];
  };
})
.controller('AddUserCtrl', function($scope, $state){
  $scope.UserForm = {
    title:"新增用户"
  };
  var userType = $state.params.userType;
  if(!userType || userType=='0'){
    userType = '2';
  }

  $scope.user = {
    type:userType,
    typeList:[{
      value:1,
      text:"VIP用户"
    },{
      value:2,
      text:"普通用户"
    },{
      value:9,
      text:"黑名单"
    }]
  };

  $scope.submitForm = function(){
    $state.go('^');
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
.controller('EditUserCtrl', function($scope, $state){
  $scope.UserForm = {
    title:"更新用户"
  };

  $scope.user = {
    name:'alpha',
    gender:'male',
    type:'2',
    birthday:'1986-07-03',
    typeList:[{
      value:1,
      text:"VIP用户"
    },{
      value:2,
      text:"普通用户"
    },{
      value:9,
      text:"黑名单"
    }]
  };

  $scope.submitForm = function(){
    $state.go('^');
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
/**
 * 用户登录控制器
 */
.controller('UserLoginCtrl', function($scope){
  $scope.formOption = {
    action : '#',
    forgetPwd: '/forgetPwd',
    signup: '/signup'
  };

  $scope.signIn = function(valid){
    if(valid){
      alert('save');
    }
  };
});

/**
 * 文章模块列表
 * @type {[type]}
 */
var articleListModule = angular.module("ArticleListModule", ['ui.grid.pagination', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns']); 
articleListModule.controller('ArticleListCtrl', function($scope, $state, $stateParams, uiGridConstants, myModal, ArticleService) {

  var paginationOptions = {
    pageNumber:1,
    pageSize:5,
    sort:null
  };

  $scope.gridOptions = {
    paginationPageSizes: [5, 10, 50, 100],
    paginationPageSize: 5,
    useExternalPagination: true,
    useExternalSorting: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    enableFiltering: false,
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:true    
  };

  //搜索
  $scope.search = function(){
    getPage();
  };
  
  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi; 
    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      if (sortColumns.length === 0) {
        paginationOptions.sort = null;
      }else{
        paginationOptions.sort = sortColumns[0].sort.direction;
      }
      getPage();
    });

    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
      paginationOptions.pageNumber = newPage;
      paginationOptions.pageSize = pageSize;
      getPage();
    });
    init();
  };
  
  $scope.gridOptions.columnDefs = [{
      field: 'title',
      displayName: '文章标题',
      width:280
    },{
      field: 'categoryName',
      displayName: '文章分类',
      width:100
    },{
      field: 'author',
      displayName: '作者',
      width:80
    }, {
      field: 'postTime',
      displayName: '发布时间',      
      type: 'date',
      width:140
    }, {
      field: 'status',
      displayName: '状态',
      width:80,
      cellFilter:'mapStatus'
    }, {
      field: 'tags',
      displayName: '标签',
      width:120
    }, {
      field: 'public',
      displayName: '是否公开',
      width:120
    }, {
      field: 'recommned',
      displayName: '推荐',
      width:80
    }, {
      field: 'top',
      displayName: '置顶',
      width:80
    }, {
      field: 'pv',
      displayName: 'PV',
      width:80
    }, {
      field: 'sort',
      displayName: '排序',
      width:80
    }, {
      name: 'id',
      displayName: '操作',
      cellTemplate: '<a class="btn-small" ui-sref=".editArticle({id:\'{{COL_FIELD}}\'})">修改</a>',
      enableFiltering: false
    }
  ];

  $scope.article = {
    statusList:[{
      id:1,
      name:'已发布'
    },{
      id:2,
      name:'草稿'
    }]
  };

  //分页查询
  var getPage = function() {
    var articleForm = {
      currentPage:paginationOptions.pageNumber, 
      pageSize:paginationOptions.pageSize, 
      categoryId:$scope.article.category||'',
      status:$scope.article.status||'',
      tags:$scope.article.tags,
      title:$scope.article.title,
      startDate:$("#beginPublishTime").val(),
      endDate:$("#endPublishTime").val()
    };
    ArticleService.getList({}, articleForm, function(data){
      $scope.gridOptions.totalItems = data.total || 0;
      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
      $scope.gridOptions.data = data.articles || [];
    });
  };

  //注册页面跳转时，执行清理执行
  $scope.$on("$destroy", function(){
    $("#myModal").remove();
  });

  //高级搜索
  $scope.advancedSearch = function(){
    $(".hideSearchItems").toggle();
  };

  //初始化
  function init(){
    myModal.loadTemplateUrl('template/modal/dialog.html', {scope: $scope})
    .then(function(modalDialog){
      $scope.modalDialog = modalDialog;
      $scope.modal = {
        title: "系统提示",
        body:'<p>请确认是否删除?</p>',
        buttons:{ YES: '确定', NO: '关闭'}
      };
    });
    getPage();
  }
  
  //删除
  $scope.remove = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      if(rows && rows.length){
        $('#myModal').modal('show');
      }
    }
  };

  //删除确认
  $scope.submitConfirm = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      angular.forEach(rows, function(row, index){
        var id = row.entity.id;

        ArticleService.remove({
          id:id
        }, function(){
          getPage();
        });
      });
    }
    $('#myModal').modal('hide');
  };
})
.filter('mapStatus', function(){
  var statusHash = {
    1:'已发布',
    2:'草稿'
  };
  return function(input){
    return statusHash[input];
  };
})
.controller('AddArticleCtrl', function($scope, $state, Categories, ArticleService){
  $scope.ArticleForm = {
    title:"发布文章"
  };
  
  $scope.article = {};
  angular.extend($scope.article, Categories||{});

  $scope.submitForm = function(){
    var articleForm = {
      title:$scope.article.title,
      categoryId: $scope.article.category,
      categoryName:$("select[name='category']").find("option:selected").text(),
      author:$scope.article.author,
      content:$scope.article.content,
      tags:$scope.article.tags,
      summary:$scope.article.summary,
      public:$("input[name='isPublic']").prop('checked'),
      recommned:$("input[name='isRecommend']").prop('checked'),
      top:$("input[name='isTop']").prop('checked'),
      original:$("input[name='isOriginal']").prop('checked'),
      status: 1,
      sort:$scope.article.sort,
      pv:$scope.article.pv,
      createBy:$scope.article.author,
      source:$scope.article.source,
      postTime:$("#postTime").val()
    };
    ArticleService.create({}, articleForm, function(data){
      $state.go('^');
    });
  };

  $scope.saveForm = function(){
    var articleForm = {
      title:$scope.article.title,
      categoryId: $scope.article.category,
      categoryName:$("select[name='category']").find("option:selected").text(),
      author:$scope.article.author,
      content:$scope.article.content,
      tags:$scope.article.tags,
      summary:$scope.article.summary,
      public:$("input[name='isPublic']").prop('checked'),
      recommned:$("input[name='isRecommend']").prop('checked'),
      top:$("input[name='isTop']").prop('checked'),
      original:$("input[name='isOriginal']").prop('checked'),
      status: 2,
      sort:$scope.article.sort,
      pv:$scope.article.pv,
      createBy:$scope.article.author,
      source:$scope.article.source,
      postTime:$("#postTime").val()
    };
    ArticleService.create({}, articleForm, function(data){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
.controller('EditArticleCtrl', function($scope, $state, $timeout, Categories, ArticleService){
  $scope.ArticleForm = {
    title:"更新文章"
  };
  
  $scope.article = Categories || {};

  var watcher = $scope.$watch("article.title", function(newVal, oldVal){
    if(newVal){
      watcher();

      $timeout(function(){
        $scope.article.category = Categories.categoryId;
        $scope.article.isPublic = Categories.public;
        $scope.article.isOriginal = Categories.original;
        $scope.article.isTop = Categories.top;
        $scope.article.isRecommend = Categories.recommned;
      }, 50);
    }
  });
  
  $scope.submitForm = function(){
    var articleForm = {
      title:$scope.article.title,
      categoryId: $scope.article.category,
      categoryName:$("select[name='category']").find("option:selected").text(),
      author:$scope.article.author,
      content:$scope.article.content,
      tags:$scope.article.tags,
      summary:$scope.article.summary,
      public:$("input[name='isPublic']").prop('checked'),
      recommned:$("input[name='isRecommend']").prop('checked'),
      top:$("input[name='isTop']").prop('checked'),
      original:$("input[name='isOriginal']").prop('checked'),
      status: 1,
      sort:$scope.article.sort,
      pv:$scope.article.pv,
      createBy:$scope.article.author,
      source:$scope.article.source,
      postTime:$("#postTime").val()
    };
    ArticleService.update({id: $state.params.id}, articleForm, function(data){
      $state.go('^');
    });
  };

  $scope.saveForm = function(){
    var articleForm = {
      title:$scope.article.title,
      categoryId: $scope.article.category,
      categoryName:$("select[name='category']").find("option:selected").text(),
      author:$scope.article.author,
      content:$scope.article.content,
      tags:$scope.article.tags,
      summary:$scope.article.summary,
      public:$("input[name='isPublic']").prop('checked'),
      recommned:$("input[name='isRecommend']").prop('checked'),
      top:$("input[name='isTop']").prop('checked'),
      original:$("input[name='isOriginal']").prop('checked'),
      status: 2,
      sort:$scope.article.sort,
      pv:$scope.article.pv,
      createBy:$scope.article.author,
      source:$scope.article.source,
      postTime:$("#postTime").val()
    };
    ArticleService.update({id: $state.params.id}, articleForm, function(data){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
});

/**
 * 分类管理模块
 * @type {[type]}
 */
var categoryListModule = angular.module("CategoryListModule", ['ui.grid.pagination', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns']); 
categoryListModule.controller('CategoryListCtrl', function($scope, $state, $stateParams, uiGridConstants, myModal, CategoryService) {

  var paginationOptions = {
    pageNumber:1,
    pageSize:5,
    sort:null
  };

  $scope.gridOptions = {
    paginationPageSizes: [5, 10, 50, 100],
    paginationPageSize: 5,
    useExternalPagination: true,
    useExternalSorting: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    enableFiltering: false,
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:true    
  };

  //搜索
  $scope.search = function(){
    getPage();
  };
  
  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi; 
    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      if (sortColumns.length === 0) {
        paginationOptions.sort = null;
      }else{
        paginationOptions.sort = sortColumns[0].sort.direction;
      }
      getPage();
    });

    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
      paginationOptions.pageNumber = newPage;
      paginationOptions.pageSize = pageSize;
      getPage();
    });
    init();
  };
  
  $scope.gridOptions.columnDefs = [{
      field: 'name',
      displayName: '分类名称',
    }, {
      field: 'parentId',
      displayName: '父级分类',
    }, {
      field: 'sort',
      displayName: '排序',
    }, {
      name: 'id',
      displayName: '操作',
      cellTemplate: '<a class="btn-small" ui-sref=".editCategory({id:{{COL_FIELD}}})">修改</a>',
      enableFiltering: false
    }
  ];

  $scope.category = {};

  //分页查询
  var getPage = function() {
    var categoryForm = {
      currentPage:paginationOptions.pageNumber, 
      pageSize:paginationOptions.pageSize, 
      name:$scope.category.name
    };
    CategoryService.getList({}, categoryForm, function(data){
      $scope.gridOptions.totalItems = data.total || 0;
      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
      $scope.gridOptions.data = data.categories || [];
    });
  };

  //注册页面跳转时，执行清理执行
  $scope.$on("$destroy", function(){
    $("#myModal").remove();
  });

  //初始化
  function init(){
    myModal.loadTemplateUrl('template/modal/dialog.html', {scope: $scope})
    .then(function(modalDialog){
      $scope.modalDialog = modalDialog;
      $scope.modal = {
        title: "系统提示",
        body:'<p>请确认是否删除?</p>',
        buttons:{ YES: '确定', NO: '关闭'}
      };
    });
    getPage();
  }
  
  //删除
  $scope.remove = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      if(rows && rows.length){
        $('#myModal').modal('show');
      }
    }
  };
})
.controller('AddCategoryCtrl', function($scope, $state, CategoryService){
  $scope.CategoryForm = {
    title:"新增分类"
  };
  
  $scope.category = {
    parentId:'0'
  };

  CategoryService.getList({}, {currentPage:1,pageSize:500}, function(data){
    $scope.category.categoryList = data.categories;
  });

  $scope.submitForm = function(){
    var categoryForm = {
      name: $scope.category.name,
      sort: $scope.category.sort,
      parentId: $scope.category.parentId
    };

    CategoryService.create({}, categoryForm, function(data){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
.controller('EdiCategoryCtrl', function($scope, $state){
  $scope.CategoryForm = {
    title:"更新分类"
  };

  $scope.category = {
    name:'字画'
  };

  $scope.submitForm = function(){
    $state.go('^');
  };

  $scope.discard = function(){
    $state.go('^');
  };
});

/**
 * 文件管理模块
 * @type {[type]}
 */
var filesListModule = angular.module("FilesListModule", []);
filesListModule.controller('FilesListCtrl',function($scope, FileManagerService){
  var breadcrumbs = $scope.breadcrumbs = [];
  var nav = $scope.nav = {
    current: '',
    prev: ''
  };

  breadcrumbs.push({label:'全部文件', link:nav.current});
  $scope.gridData = FileManagerService.getList({path: nav.current});
  $scope.opbar = {
    checkNum:0, //选中数量
    showToolbar:false   //显示扩展工具条：删除、重命名、移动、复制等
  };

  $scope.fireAction = function(item){
    if(item.fileType == 'folder'){
      nav.prev = nav.current;
      nav.current = nav.current+'/'+item.fileName;
      
      breadcrumbs.push({label:item.fileName, link:nav.current});
      $scope.gridData = FileManagerService.getList({path: nav.current});
    }
  };

  $scope.backPrev = function(){
    breadcrumbs = breadcrumbs.slice(0, breadcrumbs.length-1);
    nav.current = nav.prev;

    if(breadcrumbs.length>1){
      nav.prev = breadcrumbs[breadcrumbs.length-2].link;
    }else{
      nav.prev = '';
    }
    $scope.breadcrumbs = breadcrumbs;
    $scope.gridData = FileManagerService.getList({path: nav.current});
  };

  $scope.goto = function(val){
    var idx = -1;
    for(var i=0,len=breadcrumbs.length; i<len; i++){
      if(val == breadcrumbs[i].label){
        idx = i;
      }
    }
    nav.current = breadcrumbs[idx].link;
    nav.prev = idx===0 ? '' : breadcrumbs[idx-1].link;
    $scope.breadcrumbs = breadcrumbs = breadcrumbs.slice(0, idx+1);
    $scope.gridData = FileManagerService.getList({path: nav.current});
  };
});

/**
 * 客户管理模块
 * @type {[type]}
 */
var customerModule = angular.module("CustomerListModule", []);
customerModule.controller('CustomerListCtrl',function($scope, $state, $http, $q){
  var canceller = $q.defer();
  $http.get('/customer/list', {timeout:canceller.promise})
  .success(function(data) {
    $scope.customers = data.customers;
    $scope.customerTotal = data.customerTotal;
    $scope.companies = data.company;
    $scope.companyTotal = data.companyTotal;
  });
  
  $scope.$on('$destroy', function(){
    canceller.resolve();  //如果http请求未完成，则终止
  });
});

/**
 * 产品管理模块
 * @type {[type]}
 */
var productListModule = angular.module("ProductListModule", ['ui.grid.pagination', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns']);
productListModule.controller('ProductListCtrl', function($scope, $state, uiGridConstants, myModal, Artwork, ArtworkService){
  $scope.artwork = Artwork || {};

  var paginationOptions = {
    pageNumber:1,
    pageSize:5,
    sort:null
  };

  $scope.gridOptions = {
    paginationPageSizes: [5, 10, 50, 100],
    paginationPageSize: 5,
    useExternalPagination: true,
    useExternalSorting: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    enableFiltering: false,
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:true    
  };

  $scope.search = function(){
    getPage();
  };

  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi; 
    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      if (sortColumns.length === 0) {
        paginationOptions.sort = null;
      }else{
        paginationOptions.sort = sortColumns[0].sort.direction;
      }
      getPage();
    });

    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
      paginationOptions.pageNumber = newPage;
      paginationOptions.pageSize = pageSize;
      getPage();
    });

    init();
  };
   
  $scope.gridOptions.columnDefs = [{
      field: 'name',
      displayName: '作品名称',
      width:260
    },{
      field: 'artworkAuthor.name',
      displayName: '艺术家',
      width:100
    },{
      field: 'artworkCategory.name',
      displayName: '作品分类',
      width:90
    },{
      field: 'artworkType.name',
      displayName: '作品类型',
      width:100
    },{
      field: 'price',
      displayName: '价格',
      type:'number',
      width:80
    },{
      field: 'createTime',
      displayName: '发布日期',
      type: 'date',
      width:140
    }, {
      field: 'putOnShelvesTime',
      displayName: '上架时间',      
      type: 'date',
      width:140
    }, {
      field: 'commodityStates.name',
      displayName: '状态',
      width:80
    }, {
      field: 'user.name',
      displayName: '发布者',
      width:80
    }, {
      field: 'isRecommend',
      displayName: '推荐',
      width:80
    }, {
      field: 'pv',
      displayName: 'PV',
      width:80
    }, {
      field: 'sorts',
      displayName: '排序',
      width:80
    }, {
      field: 'like',
      displayName: '收藏数',
      width:80
    }, {
      name: 'id',
      displayName: '操作',
      cellTemplate: '<a class="btn-small" ui-sref=".editProduct({id:{{COL_FIELD}}})">修改</a>',
      enableFiltering: false
    }
  ];

  var getPage = function() {
    var catType = $scope.catType || -1;
    var artworkForm = {
      name: $scope.artwork.name,
      artworkAuthorName: $scope.artwork.artworkAuthor,
      artworkTypeId: $scope.artwork.type,
      artworkCategoryId: $scope.artwork.artworkCategory,
      commodityStatesId: $scope.artwork.states,
      price:{
        minPrices:$scope.artwork.minPrice, 
        maxPrices:$scope.artwork.maxPrice
      },
      pst:{
        beginPutOnShelvesTime:$("#beginShelvesTime").val(),
        endPutOnShelvesTime:$("#endShelvesTime").val()
      },
      ct:{
        beginCreateTime:$("#beginCreateTime").val(),
        endCreateTimeEnd:$("#endCreateTime").val()
      }
    };

    ArtworkService.getList({
      pageNumber:paginationOptions.pageNumber, 
      pageSize:paginationOptions.pageSize
    }, artworkForm, function(data){
      $scope.gridOptions.totalItems = data.total || 0;
      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
      var artworkData = data.info || [];
      
      angular.forEach(artworkData, function(item){
        item.putOnShelvesTime = moment(item.putOnShelvesTime).format("YYYY-MM-DD HH:mm");
        item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm");
      });
      $scope.gridOptions.data = artworkData;
    });
  };

  //初始化
  function init(){
    myModal.loadTemplateUrl('template/modal/dialog.html', {scope: $scope})
    .then(function(modalDialog){
      $scope.modalDialog = modalDialog;
      $scope.modal = {
        title: "系统提示",
        body:'<p>请确认是否删除?</p>',
        buttons:{ YES: '确定', NO: '关闭'}
      };
    });
    getPage();
  }

  //注册页面跳转时，执行清理执行
  $scope.$on("$destroy", function(){
    $("#myModal").remove();
  });

  //高级搜索
  $scope.advancedSearch = function(){
    $(".hideSearchItems").toggle();
  };

  //删除
  $scope.remove = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      if(rows && rows.length){
        $('#myModal').modal('show');
      }
    }
  };

  //删除确认
  $scope.submitConfirm = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      angular.forEach(rows, function(row, index){
        var id = row.entity.id;

        ArtworkService.remove({
          dynamicURI:id
        }, function(){
          getPage();
        });
      });
    }
    $('#myModal').modal('hide');
  };

})
.controller('AddProductCtrl', function($scope, $state, Artwork, ArtworkService){
  $scope.ProductForm = {
    title:"新增产品"
  };
  $scope.artwork = Artwork || {};

  $scope.submitForm = function(){
    var artworkForm = {
      name: $scope.artwork.name,
      price: $scope.artwork.price,
      keyword: $scope.artwork.keyword,
      like: $scope.artwork.like,
      pv: $scope.artwork.pv,
      sorts: $scope.artwork.sorts,
      isRecommend: $("input[name='isRecommend']").prop('checked') ? 1 : 0,
      commodityStates:{
        id: $scope.artwork.commodityStates,
        name: $("select[name='commodityStates']").find("option:selected").text()
      },
      artworkAuthor:{
        id: $scope.artwork.artworkAuthor,
        name: $("select[name='artworkAuthor']").find("option:selected").text()
      },
      artworkCategory:{
        id: $scope.artwork.artworkCategory,
        name: $("select[name='artworkCategory']").find("option:selected").text()
      },
      artworkType:{
        id:$scope.artwork.type,
        name:$("select[name='type']").find("option:selected").text()
      },
      widht: $scope.artwork.width,
      long_: $scope.artwork.height,
      unit: $scope.artwork.unit,
      user:{
        id:1,
        name:'admin'
      }
    };

    ArtworkService.create({}, artworkForm, function(){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
.controller('EditProductCtrl', function($scope, $state, $timeout, Artwork, ArtworkService){
  $scope.ProductForm = {
    title:"更新产品"
  };

  $scope.artwork = Artwork || {};
  var watcher = $scope.$watch("artwork.author", function(newVal, oldVal){
    if(newVal){
      watcher();

      $timeout(function(){
        $scope.artwork.author = $scope.artwork.author+'';
        $scope.artwork.category = $scope.artwork.category+'';
        $scope.artwork.type = $scope.artwork.type+'';
        $scope.artwork.status = $scope.artwork.status+'';

        if(Artwork.isRecommend===1){
          $scope.artwork.isRecommend = true;
        }
      }, 50);
    }
  });

  $scope.submitForm = function(){
    var artworkForm = {
      name: $scope.artwork.name,
      price: $scope.artwork.price,
      keyword: $scope.artwork.keyword,
      like: $scope.artwork.like,
      pv: $scope.artwork.pv,
      sorts: $scope.artwork.sorts,
      isRecommend: $("input[name='isRecommend']").prop('checked') ? 1 : 0,
      commodityStates:{
        id: $scope.artwork.status,
        name: $("select[name='status']").find("option:selected").text()
      },
      artworkAuthor:{
        id: $scope.artwork.author,
        name: $("select[name='author']").find("option:selected").text()
      },
      artworkCategory:{
        id: $scope.artwork.category,
        name: $("select[name='category']").find("option:selected").text()
      },
      artworkType:{
        id:$scope.artwork.type,
        name:$("select[name='type']").find("option:selected").text()
      },
      widht: $scope.artwork.widht,
      long_: $scope.artwork.long_,
      unit: $scope.artwork.unit,
      user:{
        id:1,
        name:'admin'
      },
      id: $state.params.id
    };

    ArtworkService.update({}, artworkForm, function(){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
});



/**
 * 衍生品管理模块
 * @type {[type]}
 */
var derivativiesListModule = angular.module("DerivativiesListModule", ['ui.grid.pagination', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns']);
derivativiesListModule.controller('DerivativiesListCtrl', function($scope, $state, uiGridConstants, myModal, Derivativies, DerivativiesService){
  $scope.derivatives = Derivativies || {};

  var paginationOptions = {
    pageNumber:1,
    pageSize:5,
    sort:null
  };

  $scope.gridOptions = {
    paginationPageSizes: [5, 10, 50, 100],
    paginationPageSize: 5,
    useExternalPagination: true,
    useExternalSorting: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    enableFiltering: false,
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:true    
  };

  $scope.search = function(){
    getPage();
  };

  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi; 
    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      if (sortColumns.length === 0) {
        paginationOptions.sort = null;
      }else{
        paginationOptions.sort = sortColumns[0].sort.direction;
      }
      getPage();
    });

    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
      paginationOptions.pageNumber = newPage;
      paginationOptions.pageSize = pageSize;
      getPage();
    });

    init();
  };
   
  $scope.gridOptions.columnDefs = [{
      field: 'name',
      displayName: '商品名称',
      width:260
    },{
      field: 'derivativesAuthor.name',
      displayName: '艺术家',
      width:100
    },{
      field: 'derivativesCategory.name',
      displayName: '商品分类',
      width:90
    },{
      field: 'price',
      displayName: '价格',
      type:'number',
      width:80
    },{
      field: 'createTime',
      displayName: '发布日期',
      type: 'date',
      width:140
    }, {
      field: 'putOnShelvesTime',
      displayName: '上架时间',      
      type: 'date',
      width:140
    }, {
      field: 'commodityStates.name',
      displayName: '状态',
      width:80
    }, {
      field: 'keyword',
      displayName: '标签',
      width:120
    }, {
      field: 'putOnShelvesTime',
      displayName: '上架时间',      
      type: 'date',
      width:140
    }, {
      field: 'isRecommend',
      displayName: '推荐',
      width:80
    }, {
      field: 'pv',
      displayName: 'PV',
      width:80
    }, {
      field: 'sorts',
      displayName: '排序',
      width:80
    }, {
      field: 'like',
      displayName: '收藏数',
      width:80
    }, {
      name: 'id',
      displayName: '操作',
      cellTemplate: '<a class="btn-small" ui-sref=".editDerivativies({id:{{COL_FIELD}}})">修改</a>',
      enableFiltering: false
    }
  ];

  var getPage = function() {
    var catType = $scope.catType || -1;
    var form = {
      name: $scope.derivatives.name,
      commodityStatesId: $scope.derivatives.states,
      materialId: $scope.derivatives.material,
      artworkCategoryId: $scope.derivatives.category,
      artworkAuthor: $scope.derivatives.author,
      price:{
        minPrices:$scope.derivatives.minPrice, 
        maxPrices:$scope.derivatives.maxPrice
      },
      pst:{
        beginPutOnShelvesTime:$("#beginShelvesTime").val(),
        endPutOnShelvesTime:$("#endShelvesTime").val()
      },
      ct:{
        beginCreateTime:$("#beginCreateTime").val(),
        endCreateTimeEnd:$("#endCreateTime").val()
      }
    };

    DerivativiesService.getList({
      pageNumber:paginationOptions.pageNumber, 
      pageSize:paginationOptions.pageSize
    }, form, function(data){
      $scope.gridOptions.totalItems = data.total || 0;
      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
      var artworkData = data.info || [];
      
      angular.forEach(artworkData, function(item){
        item.putOnShelvesTime = moment(item.putOnShelvesTime).format("YYYY-MM-DD HH:mm");
        item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm");
      });
      $scope.gridOptions.data = artworkData;
    });
  };

  //初始化
  function init(){
    myModal.loadTemplateUrl('template/modal/dialog.html', {scope: $scope})
    .then(function(modalDialog){
      $scope.modalDialog = modalDialog;
      $scope.modal = {
        title: "系统提示",
        body:'<p>请确认是否删除?</p>',
        buttons:{ YES: '确定', NO: '关闭'}
      };
    });
    getPage();
  }

  //注册页面跳转时，执行清理执行
  $scope.$on("$destroy", function(){
    $("#myModal").remove();
  });

  //高级搜索
  $scope.advancedSearch = function(){
    $(".hideSearchItems").toggle();
  };

  //删除
  $scope.remove = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      if(rows && rows.length){
        $('#myModal').modal('show');
      }
    }
  };

  //删除确认
  $scope.submitConfirm = function(){
    if($scope.gridApi && $scope.gridApi.selection){
      var rows = $scope.gridApi.selection.getSelectedGridRows();
      angular.forEach(rows, function(row, index){
        var id = row.entity.id;

        DerivativiesService.remove({
          id:id
        }, function(){
          getPage();
        });
      });
    }
    $('#myModal').modal('hide');
  };

})
.controller('AddDerivativiesCtrl', function($scope, $state, Derivativies, DerivativiesService){
  $scope.ProductForm = {
    title:"新增衍生品"
  };
  $scope.derivatives = Derivativies || {};

  $scope.submitForm = function(){
    var form = {
      name: $scope.derivatives.name,
      price: $scope.derivatives.price,
      keyword: $scope.derivatives.keyword,
      like: $scope.derivatives.like,
      pv: $scope.derivatives.pv,
      sorts: $scope.derivatives.sorts,
      isRecommend: $("input[name='isRecommend']").prop('checked') ? 1 : 0,
      commodityStates:{
        id: $scope.derivatives.commodityStates,
        name: $("select[name='commodityStates']").find("option:selected").text()
      },
      derivativesAuthor:{
        id: $scope.derivatives.derivativesAuthor,
        name: $("select[name='derivativesAuthor']").find("option:selected").text()
      },
      derivativesCategory:{
        id: $scope.derivatives.derivativesCategory,
        name: $("select[name='derivativesCategory']").find("option:selected").text()
      },
      widht: $scope.derivatives.width,
      long_: $scope.derivatives.height,
      unit: $scope.derivatives.unit,
      material:{
        id:$scope.derivatives.material,
        name: $("select[name='material']").find("option:selected").text()
      },
      user:{
        id:1,
        name:'admin'
      }
    };

    DerivativiesService.create({}, form, function(data){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
})
.controller('EditDerivativiesCtrl', function($scope, $state, $timeout, Derivativies, DerivativiesService){
  $scope.ProductForm = {
    title:"更新衍生品"
  };

  $scope.derivatives = Derivativies || {};
  var watcher = $scope.$watch("derivatives.name", function(newVal, oldVal){
    if(newVal){
      watcher();

      $timeout(function(){
        $scope.derivatives.derivativesCategory = $scope.derivatives.derivativesCategory+'';
        $scope.derivatives.derivativesAuthor = $scope.derivatives.derivativesAuthor+'';
        if(Derivativies.isRecommend===1){
          $scope.derivatives.isRecommend = true;
        }
      }, 50);
    }
  });

  $scope.submitForm = function(){
    var form = {
      name: $scope.derivatives.name,
      price: $scope.derivatives.price,
      keyword: $scope.derivatives.keyword,
      like: $scope.derivatives.like,
      pv: $scope.derivatives.pv,
      sorts: $scope.derivatives.sorts,
      isRecommend: $("input[name='isRecommend']").prop('checked') ? 1 : 0,
      commodityStates:{
        id: $scope.artwork.commodityStates,
        name: $("select[name='commodityStates']").find("option:selected").text()
      },
      derivativesAuthor:{
        id: $scope.derivatives.derivativesAuthor,
        name: $("select[name='derivativesAuthor']").find("option:selected").text()
      },
      derivativesCategory:{
        id: $scope.derivatives.derivativesCategory,
        name: $("select[name='derivativesCategory']").find("option:selected").text()
      },
      widht: $scope.derivatives.width,
      long_: $scope.derivatives.height,
      unit: $scope.derivatives.unit,
      material:{
        id:$scope.derivatives.material,
        name: $("select[name='material']").find("option:selected").text()
      },
      user:{
        id:1,
        name:'admin'
      },
      id: $state.params.id
    };

    DerivativiesService.update({}, form, function(data){
      $state.go('^');
    });
  };

  $scope.discard = function(){
    $state.go('^');
  };
});