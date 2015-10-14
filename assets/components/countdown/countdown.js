/**
 *倒计时功能
 **/

angular.module('xiaomaiApp').directive('countdown', [
  '$interval',
  function($interval) {
    //因为lock
    var link = function($scope, ele, attrs) {

      var counttime = $scope.counttime;
      var t = $interval(function() {
        if (counttime == 0) {
          $interval.cancel(t);
          $scope.countDeadCall();
          return false;
        }
        counttime = counttime - 1;
        // $scope.counttime = hhmmss(counttime);
        ele.html(hhmmss(counttime));
      }, 1000);

    };

    function hhmmss(val) {
      //自动补全十位数
      var crossten = function(r) {
        return r < 10 ? ('0' + r) : r;
      };
      var hourunit = 60 * 60,
        minuteunit = 60,
        secondunit = 1,
        hour,
        minute,
        second;


      val = Number(val);

      hour = Math.floor(val / hourunit);
      val = val % hourunit;

      minute = Math.floor(val / minuteunit);
      val = val % minuteunit;
      second = Math.floor(val / secondunit);


      return [crossten(hour), crossten(minute), crossten(second)].join(
        ':');

    }


    return {
      template: '<span></span>',
      scope: {
        counttime: '@',
        countDeadCall: '&'
      },
      link: link,
      replace: true
    }
  }
])
