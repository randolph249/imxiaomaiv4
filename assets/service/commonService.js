/**
 *所有的基础公用服务都放到service.js下面
 **/

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

//校验数据类型
angular.module('xiaomaiApp').factory('getDataType', [function() {
  return function(val) {
    var type = Object.prototype.toString.call(val),
      reg = /\s(\w+)/;
    return type.match(reg)[1].toLowerCase()
  }
}])
