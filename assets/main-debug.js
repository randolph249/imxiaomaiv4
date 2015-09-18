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
                '../assets/views/buy/buy.css'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/service/shopcart.js'
              ]
            })
          }]
        }
      })
      .state('root.buy.category', {
        url: 'category/?collegeid',
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
      //所有活动homepage
      .state('root.buy.category.all', {
        url: 'all/',
        templateUrl: '../assets/views/category.all/all.html',
        controller: 'category.allCtrl',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/category.all/all.js'
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
      .state('root.notfound', {
        url: '404/',
        templateUrl: '../assets/views/notfound/notfound.html'
      });
  }
]);

angular.module('xiaomaiApp').run(['$state', function($state) {

  // debugger;
  $state.go('root.locate');
  // debugger;
}]);
