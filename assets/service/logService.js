/**
*20151012135658^m_b_31homepagetabcategoryadd^other~3270~~~~^data~tag~~~^
*20151012135851^m_b_shoppingcartbuy^~3090~undefined~~161675~^data~tag~~~^

**/
//日志log统计服务
angular.module('xiaomaiApp').factory('xiaomaiLog', [
  'xiaomaiService',
  'cookie_openid',
  'xiaomaiLogDate',
  'systemInfo',
  'schoolManager',
  '$http',
  function(xiaomaiService, cookie_openid, xiaomaiLogDate, systemInfo,
    schoolManager, $http) {

    //如果eventname带了数字 说明是事件名+categoryID/activityId/
    var createEventStr = function(e, collegeId) {
      var eventnamereg =
        /(\w+)\+?(\d+)?\+?(dataid\d+)?\+?(tag\d+)?\+?(category\d+)?\+?(good\d+)?/;
      var results = e.match(eventnamereg);
      var eventname = results[1];
      var ids = results[2];
      var dataid = results[3];
      var tag = results[4];
      var categoryIndex = results[5];
      var goodIndex = results[6];

      var logstr = [
          xiaomaiLogDate(),
          eventname,
          systemInfo.browser
        ].join('^') + '~' + collegeId + '~' + cookie_openid +
        '~' + (ids || '') + '~~^' + [
          dataid ? dataid.replace('dataid', '') : 'data',
          tag ? tag.replace('tag', '') : 'tag',
          categoryIndex ? categoryIndex.replace('category', '') : '',
          goodIndex ? goodIndex.replace('good', '') : ''

        ].join('~') + '~^';
      $http.jsonp(
        'http://logger.imxiaomai.com/client/event?callback=JSON_CALLBACK&data=' +
        logstr);
    };
    var submitLog = function(logstr) {
      var logValueId = document.querySelector('#logValueId');
      logValueId.value = logstr;
      var logForm = document.querySelector('#logForm');
      logForm.submit();
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
