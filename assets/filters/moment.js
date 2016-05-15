angular.module('xiaomaiApp').filter('xiaomaimoment', function() {
  return function(val) {
    var minute = Math.floor(val / 60);
    var second = val % 60;

    minute = minute >= 0 ? minute : 0;
    second = second >= 0 ? second : 0;

    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;

    return minute + '分' + second + '秒';
  }
});
