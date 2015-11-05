/**
 *所有的基础公用服务都放到service.js下面
 **/

/**
 *GET当前开发环境
 **/
angular.module('xiaomaiApp').factory('env', ['$window', function($window) {
  var onlineReg = /h5\.imxiaomai\.com/,
    testReg = /(wap\.tmall\.imxiaomai\.com)|(qa\.wap\.test\.imxiaomai\.com)/,
    localReg = /127\.0\.0\.1|localhost|172\.16\.110\.188/
  host = $window.location.host;

  if (onlineReg.test(host)) {
    return 'online';
  } else if (localReg.test(host)) {
    return 'develop';
  } else {
    return 'test';
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
    wechartReg = /micromessenger\/[\d\.]+/i,
    result;
  if (UA.match(androidReg) && UA.match(androidReg).length) {
    result = UA.match(androidReg);
    platform = result[1];
    version = UA.match(androidReg)[2];
  } else if (UA.match(iphoneReg) && UA.match(iphoneReg).length) {
    result = UA.match(iphoneReg);
    platform = result[1];
    version = result[2];
  } else {
    platform = 'unknown';
    version = 'unknown';
  }


  if (UA.match(wechartReg) && UA.match(wechartReg).length) {
    browser = UA.match(wechartReg)[0];
  } else {
    browser = 'other';
  }

  return {
    platform: platform,
    version: version,
    browser: browser
  }
}]);

//校验数据类型
angular.module('xiaomaiApp').factory('getDataType', [function() {
  return function(val) {
    var type = Object.prototype.toString.call(val),
      reg = /\s(\w+)/;
    return type.match(reg)[1].toLowerCase()
  }
}]);

//解析URL参数
angular.module('xiaomaiApp').factory('parseUrlParams', [function() {
  return function(url, name) {
    var reg = new RegExp('[\\?&]' + name + '=([^\\?&]+)');
    var result = url.match(reg);
    return result && result.length ? result[1] : false;
  }
}])


//点击Banner的时候执行解析
angular.module('xiaomaiApp').factory('getRouterTypeFromUrl', function() {
  //根据URl解析Router参数
  return function(url, collegeId) {
    var router = {};
    if (url.match(/[\?&]m=([^\?&]+)/)) {
      router.name = 'root.buy.nav.category';
      router.params = {
        categoryId: url.match(/[\?&]id=([^\?&]+)/)[1],
        collegeId: collegeId,
      }
    } else if (url.match(/skActivity/)) {
      router.name = 'root.buy.active';
      router.params = {
        collegeId: collegeId,
        activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1],
      }
    } else if (url.match(/activity/)) {
      router.name = 'root.buy.active';
      router.params = {
        collegeId: collegeId,
        activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1],
      }
    } else {
      router.path = url;
    }
    return router;
  };
});

/**
$apply升级版本
**/
angular.module('xiaomaiApp').factory('safeApply', ['$rootScope', function(
  $rootScope) {
  return function(fn) {
    var phase = $rootScope.$$phase;

    if (phase == '$apply' || phase == '$digest') {
      angular.isFunction(fn) && fn();
    } else {
      $rootScope.$apply(fn);
    }
  }
}]);

//快速获取图片高度
angular.module('xiaomaiApp').factory('quickGetImgHeight', [
  '$q',
  function($q) {
    return function(url) {
      var deferred = $q.defer();

      var log = function() {};

      var img = document.createElement('img');
      img.src = url;
      var loaded = false,
        wait,
        width, height;

      img.addEventListener('load', function() {
        if (loaded) {
          return false;
        }
        loaded = true;
        deferred.resolve({
          width: img.width,
          height: img.height
        });
      });

      img.addEventListener('error', function() {
        if (loaded) {
          return false;
        }
        loaded = true;
        deferred.resolve({
          width: img.width,
          height: img.height
        });
      });

      wait = setInterval(function() {
        //图片高度加载完成
        if (img.height != 0 && img.height == height) {
          clearInterval(wait);
          loaded = true;
          deferred.resolve({
            width: img.width,
            height: img.height
          });
          return false;
        }
        height = img.height;
        log(img.width, log.height);
      }, 50);

      return deferred.promise;

    }
  }
]);
