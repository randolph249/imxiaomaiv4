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
                'service/notifyService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/root/font.css',
                window.__SYS_CONF.resourceUrl +
                'service/commonService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/ajaxService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/cacheService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/cartService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/detailService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/schoolService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/wxService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/cookieService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/siblingnavService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'service/logService.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/goodListItem/goodListItem.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/goodListItem/goodListItem.css?v=' + (+
                  new Date),
                window.__SYS_CONF.resourceUrl +
                'views/gooddetail/gooddetail.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/gooddetail/gooddetail.css?v=' + (+
                  new Date),
                window.__SYS_CONF.resourceUrl +
                'views/root/swiper.min.css?v=' + (+
                  new Date)

              ]
            })
          }],

          loadFilter: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'filters/price.js?v=' + (+new Date)
              ]
            })
          }],
          loadComponents: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'components/countdown/countdown.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'components/back/back.js?v=' + (+new Date)
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
                window.__SYS_CONF.resourceUrl +
                'views/buy/buy.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/buy/buy.css',
                window.__SYS_CONF.resourceUrl +
                'views/buy/detail.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/buy/shopcart.js?v=' + (+new Date)
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
                'views/nav/nav.js?v=' + (+new Date),
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
                'views/all/all.js?v=' + (+new Date),
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
                'views/recommend/recommend.js?v=' + (+new Date),
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
                'views/active/active.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/active/active.css'
              ]
            })
          }]
        }
      })
      //普通活动 从首页进入一个新连接
      .state('root.buy.active', {
        url: 'active/?collegeId&activityId&refer',
        controller: 'buy.activeCtrl',
        templateUrl: '../assets/views/active/active.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/active/active.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/active/active.css'
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
                'views/category/category.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/category/category.css'
              ]
            })
          }]
        }
      })
      //分享的详情页
      .state('root.buy.sharedetail', {
        url: 'sharedetail/?goodId&sourceType&collegeId',
        controller: 'sharedetailCtrl',
        templateUrl: '../assets/views/sharedetail/sharedetail.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/sharedetail/sharedetail.js',
                window.__SYS_CONF.resourceUrl +
                'views/sharedetail/sharedetail.css'
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
                'views/locate/locate.js?v=' + (+new Date),
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
                'views/colleges/colleges.js?v=' + (+new Date),
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
                'views/coupon/coupon.js?v=' + (+new Date)
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
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                'views/feedback/feedback.js?v=' + (+new Date),
                window.__SYS_CONF.resourceUrl +
                'views/feedback/feedback.css'

              ]
            });
          }]
        }
      })
      //搜索操作页面
      .state('root.search', {
        url: 'search/?key',
        controller: 'searchCtrl',
        templateUrl: '../assets/views/search/search.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                '/views/search/search.js',
                window.__SYS_CONF.resourceUrl +
                '/views/search/search.css'
              ]
            })
          }]
        }
      })
      //搜索结果页面
      .state('root.buy.searchresult', {
        url: 'searchresult/?key&page',
        controller: 'searchresultCtrl',
        templateUrl: '../assets/views/search/searchresult.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                window.__SYS_CONF.resourceUrl +
                '/views/search/searchresult.js',
                window.__SYS_CONF.resourceUrl +
                '/views/search/search.css'
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

angular.module('xiaomaiApp').run(['$state', '$rootScope', '$timeout', function(
  $state,
  $rootScope, $timeout) {
  var t = $timeout(function() {
    $state.go('root.buy.nav.all');
  }, 50);
  var startWatcher = $rootScope.$on('$stateChangeStart', function(e,
    toState,
    toParam) {
    $timeout.cancel(t);
    //销毁监听
    startWatcher();
  });
}]);

//禁止页面滑动
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
