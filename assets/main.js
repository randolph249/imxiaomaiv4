/**
 **小麦商城前端代码重构
 **/
angular.module('xiaomaiApp', window.__SYS_CONF[
  'dependent_modules']);

/**
 *定义前端路由
 **/
angular.module('xiaomaiApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    /**
    *路径映射
    {
      root:'入口页面',//所有的购买功能都放到这个入口下边
      notfound:'404页面',
      locate:'定位入口'
    }
    **/
    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: '../assets/views/root/root.html'
      })
      .state('root.buy', {
        url: 'buy/',
        controller: 'buyCtrl',
        templateUrl: '../assets/views/buy/buy.html'
      })
      .state('root.buy.nav', {
        url: 'nav/',
        templateUrl: '../assets/views/nav/nav.html'
      })
      //导航栏精彩活动 所有活动入口
      .state('root.buy.nav.all', {
        url: 'all/',
        templateUrl: '../assets/views/all/all.html',
        controller: 'nav.allCtrl'
      })
      // 推荐列表页
      .state('root.buy.nav.recommend', {
        url: 'recommend/',
        controller: 'nav.recommendCtrl',
        templateUrl: '../assets/views/recommend/recommend.html'
      })
      //普通活动 入口是导航页面 左侧有导航
      .state('root.buy.nav.active', {
        url: 'active/?collegeId&activityId',
        controller: 'nav.activeCtrl',
        templateUrl: '../assets/views/active/nav.active.html'
      })
      //普通活动 从首页进入一个新连接
      .state('root.buy.active', {
        url: 'active/?collegeId&activityId&refer',
        controller: 'buy.activeCtrl',
        templateUrl: '../assets/views/active/active.html'
      })
      //类目列表页
      .state('root.buy.nav.category', {
        url: 'category/?collegeId&categoryId',
        controller: 'nav.categoryCtrl',
        templateUrl: '../assets/views/category/category.html'
      })
      //进行定位
      .state('root.locate', {
        url: 'locate/',
        controller: 'positionCtrl',
        templateUrl: '../assets/views/locate/locate.html'
      })
      //选择学校
      .state('root.colleges', {
        url: 'colleges/?cityid',
        controller: 'collegesCtrl',
        templateUrl: '../assets/views/colleges/colleges.html'
      })
      .state('root.buy.sharedetail', {
        url: 'sharedetail/?goodId&sourceType',
        controller: 'sharedetailCtrl',
        templateUrl: '../assets/views/sharedetail/sharedetail.html'
      })
      .state('root.buy.coupon', {
        url: 'coupon/',
        controller: 'buy.couponCtrl',
        templateUrl: '../assets/views/coupon/coupon.html'
      })
      .state('root.feedback', {
        url: 'feedback',
        controller: 'feedbackCtrl',
        templateUrl: '../assets/views/feedback/feedback.html'
      })
      //搜索操作页面
      .state('root.search', {
        url: 'search/',
        controller: 'searchCtrl',
        templateUrl: '../assets/views/search/search.html'
      })
      //搜索结果页面
      .state('root.buy.searchresult', {
        url: 'searchresult/?key&page',
        controller: 'searchresultCtrl',
        templateUrl: '../assets/views/search/searchresult.html'
      })
      .state('root.notfound', {
        url: '404/',
        templateUrl: '../assets/views/notfound/notfound.html'
      });
  }
]);

//默认跳转到首页
angular.module('xiaomaiApp').run(['$state', '$rootScope', '$timeout', function(
  $state,
  $rootScope, $timeout) {
  var t = $timeout(function() {
    $state.go('root.buy.nav.all');
  }, 50);
  var startWatcher = $rootScope.$on('$stateChangeStart', function(e,
    toState, toParam) {
    $timeout.cancel(t);
    startWatcher();
  });
}]);

//禁止页面滑动
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
