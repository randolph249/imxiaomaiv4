/**
 **小麦商城前端代码重构
 **/

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
                window.__SYS_CONF.resourceUrl +
                'views/root/font.css',
                window.__SYS_CONF.resourceUrl +
                'scss/common.css',
                window.__SYS_CONF.resourceUrl +
                'service/commonService.js',
                window.__SYS_CONF.resourceUrl +
                'service/ajaxService.js',
                window.__SYS_CONF.resourceUrl +
                'service/cacheService.js',
                window.__SYS_CONF.resourceUrl +
                'service/cartService.js',
                window.__SYS_CONF.resourceUrl +
                'service/detailService.js',
                window.__SYS_CONF.resourceUrl +
                'service/schoolService.js',
                window.__SYS_CONF.resourceUrl +
                'service/wxService.js',
                window.__SYS_CONF.resourceUrl +
                'service/cookieService.js',
                window.__SYS_CONF.resourceUrl +
                'service/notifyService.js'

              ]
            })
          }],

          loadFilter: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'filters/price.js'
              ]
            })
          }],
          loadComponents: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'components/countdown/countdown.js',
                window.__SYS_CONF.resourceUrl +
                'components/back/back.js'
              ]
            })
          }]
        }
      })
      .state('root.buy', {
        url: 'buy/?goodId&sourceType',
        controller: 'buyCtrl',
        templateUrl: '../assets/views/buy/buy.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/buy/buy.js',
                window.__SYS_CONF.resourceUrl +
                'views/buy/buy.css',
                window.__SYS_CONF.resourceUrl +
                'views/buy/detail.js',
                window.__SYS_CONF.resourceUrl +
                'views/buy/shopcart.js'
              ]
            })
          }]
        }
      })
      .state('root.buy.nav', {
        url: 'nav/',
        templateUrl: '../assets/views/nav/nav.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/nav/nav.js',
                window.__SYS_CONF.resourceUrl +
                'views/nav/nav.css'
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
                window.__SYS_CONF.resourceUrl +
                'views/all/all.js',
                window.__SYS_CONF.resourceUrl +
                'views/all/all.css'
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
                window.__SYS_CONF.resourceUrl +
                'views/recommend/recommend.js',
                window.__SYS_CONF.resourceUrl +
                'views/recommend/recommend.css'
              ]
            })
          }]
        }
      })
      //普通活动 入口是导航页面 左侧有导航
      .state('root.buy.nav.active', {
        url: 'active/?collegeId&activityId',
        controller: 'nav.activeCtrl',
        templateUrl: '../assets/views/active/nav.active.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/active/active.js',
                window.__SYS_CONF.resourceUrl +
                'views/active/active.css'
              ]
            })
          }]
        }
      })
      //普通活动 从首页进入一个新连接
      .state('root.buy.active', {
        url: 'active/?collegeId&activityId',
        controller: 'buy.activeCtrl',
        templateUrl: '../assets/views/active/active.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/active/active.js',
                window.__SYS_CONF.resourceUrl +
                'views/active/active.css'
              ]
            })
          }]
        }
      })
      //抢购活动
      .state('root.buy.skactive', {
        url: 'skactive/?collegeId&activityId',
        controller: 'buy.skactiveCtrl',
        templateUrl: '../assets/views/skactive/skactive.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/skactive/skactive.js',
                window.__SYS_CONF.resourceUrl +
                'views/skactive/skactive.css'
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
                window.__SYS_CONF.resourceUrl +
                'views/category/category.js',
                window.__SYS_CONF.resourceUrl +
                'views/category/category.css'
              ]
            })
          }]
        }
      })
      //进行定位
      .state('root.locate', {
        url: 'locate/',
        controller: 'positionCtrl',
        templateUrl: '../assets/views/locate/locate.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/locate/locate.js',
                window.__SYS_CONF.resourceUrl +
                'views/locate/locate.css'
              ]
            })
          }]
        }
      })
      //选择学校
      .state('root.colleges', {
        url: 'colleges/?cityid',
        controller: 'collegesCtrl',
        templateUrl: '../assets/views/colleges/colleges.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/colleges/colleges.js',
                window.__SYS_CONF.resourceUrl +
                'views/colleges/colleges.css'

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
                window.__SYS_CONF.resourceUrl +
                'views/coupon/coupon.js'
              ]
            });
          }]
        }
      })
      .state('root.feedback', {
        url: 'feedback',
        controller: 'feedbackCtrl',
        templateUrl: '../assets/views/feedback/feedback.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/feedback/feedback.js',
                window.__SYS_CONF.resourceUrl +
                'views/feedback/feedback.css'

              ]
            });
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
}]);

document.querySelector('body').addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
