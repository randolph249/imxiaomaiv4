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
      root.notfound:'404页面'
    }
    **/
    $stateProvider
      .state('root', {
        url: '/root',
        controller: 'rootCtrl',
        templateUrl: '../assets/views/root/root.html',
        resolve: {
          loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/views/root/root.js',
                '../assets/views/root/root.css',
                '../assets/views/root/font.css'
              ]
            })
          }],
          loadService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'xiaomaiApp',
              files: [
                '../assets/service/service.js'
              ]
            })
          }]
        }
      })
      .state('notfound', {
        url: '404',
        controller: 'notfoundCtrl',
        templateUrl: '../assets/views/notfound/notfound.html'
      });
  }
]);

angular.module('xiaomaiApp').run(['$state', function($state) {
  // debugger;
  $state.go('root')
}]);
