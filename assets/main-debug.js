/**
 **小麦商城前端代码重构
 **/

var xiaomaiApp = angular.module('xiaomaiApp', window.__SYS_CONF[
  'dependent_modules']);

/**
 *定义前端路由
 **/
angular.module('xiaomaiApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ocLazyLoadProvider',
  function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

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
        templateUrl: '../assets/views/root/root.html',
        resolve: {
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/root/font.css',
                '../assets/service/service.js'
              ]
            })
          }]
        }
      })
      .state('root.buy', {
        url: 'buy/',
        controller: 'buyCtrl',
        templateUrl: '../assets/views/buy/buy.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/buy/buy.js',
                '../assets/views/buy/buy.css',
                '../assets/views/buy/detail.js',
                '../assets/views/buy/shopcart.js'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/service/cartService.js',
                '../assets/service/detailService.js'
              ]
            })
          }],
          loadFilter: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/filters/price.js'
              ]
            })
          }],
          loadComponents: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/components/countdown/countdown.js'
              ]
            })
          }]
        }
      })
      .state('root.buy.nav', {
        url: 'nav/?collegeid',
        templateUrl: '../assets/views/nav/nav.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/nav/nav.js',
                '../assets/views/nav/nav.css'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/service/locateservice.js'
              ]
            })
          }]
        }
      })
      //导航栏精彩活动 所有活动入口
      .state('root.buy.nav.all', {
        url: 'all/',
        templateUrl: '../assets/views/all/all.html',
        controller: 'nav.allCtrl',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/all/all.js',
                '../assets/views/all/all.css'
              ]
            })
          }]
        }
      })
      // 推荐列表页
      .state('root.buy.nav.recommend', {
        url: 'recommend/',
        controller: 'nav.recommendCtrl',
        templateUrl: '../assets/views/recommend/recommend.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/recommend/recommend.js',
                '../assets/views/recommend/recommend.css'
              ]
            })
          }]
        }
      })
      //普通活动
      .state('root.buy.active', {
        url: 'active/?collegeId&activityId&activeName',
        controller: 'buy.activeCtrl',
        templateUrl: '../assets/views/active/active.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/active/active.js',
                '../assets/views/active/active.css'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/components/scroll/scroll.js'
              ]
            })
          }]
        }
      })
      //抢购活动
      .state('root.buy.skactive', {
        url: 'skactive/?collegeId&activityId&activeName',
        controller: 'buy.skactiveCtrl',
        templateUrl: '../assets/views/skactive/skactive.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/skactive/skactive.js',
                '../assets/views/skactive/skactive.css'
              ]
            })
          }]

        }
      })
      //类目列表页
      .state('root.buy.nav.category', {
        url: 'category/?collegeId&categoryId',
        controller: 'nav.categoryCtrl',
        templateUrl: '../assets/views/category/category.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/category/category.js',
                '../assets/views/category/category.css'
              ]
            })
          }]
        }
      })
      //进行定位
      .state('root.locate', {
        url: 'locate/?cityid',
        controller: 'positionCtrl',
        templateUrl: '../assets/views/locate/locate.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/locate/locate.js',
                '../assets/views/locate/locate.css'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/service/locateservice.js'
              ]
            })
          }]
        }
      })
      .state('root.buy.coupon', {
        url: 'coupon/',
        controller: 'buy.couponCtrl',
        templateUrl: '../assets/views/coupon/coupon.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/coupon/coupon.js'
              ]
            })
          }]
        }
      })
      .state('root.notfound', {
        url: '404/',
        templateUrl: '../assets/views/notfound/notfound.html'
      });
  }
]);

angular.module('xiaomaiApp').run(['$state', function($state) {
  $state.go('root.locate');
  // debugger;
}]);
