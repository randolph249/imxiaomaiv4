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
        url: 'sharedetail/?goodId&sourceType&collegeId',
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
      //确认订单
      .state('root.confirmorder', {
        url: 'confirmorder/?r',
        controller: 'orderCtrl',
        templateUrl: '../assets/views/confirmorder/confirmorder.html'
      })
      //在确认单页面下选择优惠劵信息
      .state('root.confirmorder.couponlist', {
        url: 'couponlist/?couponid',
        controller: 'confirmorder.couponListCtrl',
        templateUrl: '../assets/views/confirmorder/confirmorder.couponlist.html'
      })
      //跳转到微信预支付页面
      .state('root.wechartprepay', {
        url: 'wechartprepay/?userId&orderId',
        controller: 'wechartprepayCtrl',
        templateUrl: '../assets/views/wechartprepay/wechartprepay.html'
      })
      //支付宝预支付页面
      .state('root.alipayprepay', {
        url: 'alipayprepay/',
        templateUrl: '../assets/views/alipayprepay/alipayprepay.html'

      })
      //支付成功页面
      .state('root.paySuccess', {
        url: 'paySuccess/?userId&orderId',
        controller: 'paySuccessCtrl',
        templateUrl: '../assets/views/paySuccess/paySuccess.html'
      })
      //支付失败页面
      .state('root.payFail', {
        url: 'payFail/?userId&orderId',
        controller: 'payFailCtrl',
        templateUrl: '../assets/views/payFail/payFail.html'
      })
      //用户信息绑定
      .state('root.binduser', {
        url: 'binduser?redirect',
        templateUrl: '../assets/views/binduser/binduser.html'
      })
      //订单地址管理列表
      .state('root.addr', {
        url: 'orderaddr/?addrId&userId',
        templateUrl: '../assets/views/addr/addr.html',
        controller: 'addrListCtrl',
      })
      //订单地址新增
      .state('root.addrAdd', {
        url: 'addrAdd/?userId&addrId',
        templateUrl: '../assets/views/addr/add.html',
        controller: 'addrAddCtrl'
      })
      //订单地址编辑
      .state('root.addrEdit', {
        url: 'addrEdit/?userId&userAddrId&addrId',
        controller: 'addrEditCtrl',
        templateUrl: '../assets/views/addr/edit.html'
      })
      //订单地址学校信息选择
      .state('root.addrLocate', {
        url: 'addrLocate/?r&userId&userAddrId',
        controller: 'addrLocateCtrl',
        templateUrl: '../assets/views/addr/addrLocate.html'
      })
      //订单地址学校信息选择
      .state('root.addrColleges', {
        url: 'addrColleges/?r&userId&userAddrId&cityId',
        controller: 'addrCollegesCtrl',
        templateUrl: '../assets/views/addr/addrColleges.html'
      })
      //用户中心
      .state('root.user', {
        url: 'user/',
        templateUrl: '../assets/views/user/user.html'
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
