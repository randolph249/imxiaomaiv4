/**
 *所有的基础公用服务都放到service.js下面
 **/

/**
 *GET当前开发环境
 **/
angular.module('xiaomaiApp').factory('env', ['$window', function($window) {
  var onlineReg = /h5\.imxiaomai\.com/,
    testReg =
    /(wap\.tmall\.imxiaomai\.com)|(qa\.wap\.test\.imxiaomai\.com)/,
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
}])

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
  return function(url, collegeId, refer) {
    var router = {};
    if (url.match(/[\?&]m=([^\?&]+)/)) {
      router.name = 'root.buy.nav.category';
      router.params = {
        categoryId: url.match(/[\?&]id=([^\?&]+)/)[1],
        collegeId: collegeId,
        refer: refer
      }
    } else if (url.match(/skActivity/)) {
      router.name = 'root.buy.skactive';
      router.params = {
        collegeId: collegeId,
        activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1],
        refer: refer,
      }
    } else if (url.match(/activity/)) {
      router.name = 'root.buy.skactive';
      router.params = {
        collegeId: collegeId,
        activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1],
        refer: refer
      }
    } else {
      router.path = url;
    }
    return router;
  };
});
