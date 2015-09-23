/**
 **小麦商城前端代码重构
 **/

var xiaomaiApp = angular.module('xiaomaiApp', window.__SYS_CONF[
  'dependent_modules']);

//定义前端路由
angular.module('xiaomaiApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ocLazyLoadProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('root', {
        url: '/',
        controller: 'rootCtrl',
        templateUrl: './assets/views/root.html'
      }).
    state('root.notfound', {
      url: '404',
      controller: 'notfoundCtrl',
      templateUrl: './assets/views/root.html'
    });
    $urlRouterProvider.otherwise('/404');

  }
]);

/**
 *GET当前开发环境
 **/
angular.module('xiaomaiApp').factory('env', ['$window', function($window) {
  var onlineReg = /h5\.imxiaomai\.com/,
    testReg = /wap\.tmall\.imxiao\.com/,
    host = $window.location.host;

  if (onlineReg.test(host)) {
    return 'online';
  } else if (testReg.test(host)) {
    return 'test';
  } else {
    return 'develop';
  }
}]);

/**
 *获取当前浏览器操作系统/系统版本号/当前浏览器
 **/
angular.module('xiaomaiApp').factory('systemInfo', ['$window', function(
  $window) {
  var UA = $window.navigator.userAgent,
    platform, //操作平台
    version, //手机系统
    browser, //当前浏览器
    model, //手机型号
    androidReg = /(android)\s+([\d\.]+)/i,
    iphoneReg = /(iphone|ipad).+(os\s[\d_]+)/i,
    wechartReg = /micromessenger/,
    result;

  if (UA.match(androidReg) && UA.match(androidReg).length) {
    result = UA.match(androidReg);
    platform = result[1];
    version = UA.match(androidReg)[2];
  } else if (UA.match(iphoneReg) && UA.match(androidReg).length) {
    result = UA.match(iphoneReg);
    platform = result[1];
    version = result[2];
  } else {
    platform = 'unknown';
    version = 'unknown';
  }

  if (wechartReg.test(UA)) {
    browser = 'wechart';
  } else {
    browser = 'other';
  }

  return {
    platform: platform,
    version: version,
    browser: browser
  }
}]);
//获取当前用户网络环境
angular.module('xiaomaiApp').factory('networkType', ['$q', function($q) {
  var deferred = $q.defer();
  wx.getNetworkType({
    fail: function(error) {
      deferred.reject()
    },
    success: function(res) {
      // 返回网络类型2g，3g，4g，wifi
      var networkType = res.networkType;
      deferred.resolve(networkType);
    }
  });
  return deferred.promise;
}]);
