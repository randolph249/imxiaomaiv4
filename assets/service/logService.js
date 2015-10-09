//日志log统计服务
angular.module('xiaomaiApp').factory('xiaomaiLog', [
  'xiaomaiService',
  'cookie_openid',
  'xiaomaiLogDate',
  'systemInfo',
  'schoolManager',
  function(xiaomaiService, cookie_openid, xiaomaiLogDate, systemInfo,
    schoolManager) {
    var createEventStr = function(eventname, collegeId) {
      var logstr = [
          xiaomaiLogDate(),
          eventname,
          systemInfo.browser
        ].join('^') + '~' + collegeId + '~' + cookie_openid +
        '~~~^data~tag~~~^';
      xiaomaiService.save('log', {
        data: logstr
      });
    };
    return function(eventname, collegeId) {

      //如果请求参数带了CollegeID 说明是点击
      var args = Array.prototype.slice.call(arguments, 0),
        eventNameArr = [];

      //如果没有带学校ID
      //如果带了学校ID 自己不需要获取学校ID(适用于定位学校&学校列表点击)
      if (args.length == 1) {
        schoolManager.get().then(function(res) {
          createEventStr(eventname, res.collegeId);
        });
      } else if (args.length == 2) {
        createEventStr(eventname, collegeId)
      }
    }
  }
]);

//时间段统计 存活时间
angular.module('xiaomaiApp').factory('xiaomaiTimeLineLog', ['xiaomaiLog',
  function(xiaomaiLog) {
    debugger;
  }
]);

//生成时间字符串
angular.module('xiaomaiApp').factory('xiaomaiLogDate', [function() {
  return function() {
    var date = new Date(),
      dateStr = date.toString(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      reg = /(\d{2}):(\d{2}):(\d{2})/,
      timeResult = dateStr.match(reg);

    month = month < 10 ? ('0' + month) : month;
    day = day < 10 ? ('0' + day) : day;

    return [year, month, day].concat(timeResult.slice(1)).join('');
  };
}]);
