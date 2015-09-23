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
          $scope.countDeadCall({
            timeid: $scope.timeid
          })
          return false;
        }
        counttime = counttime - 1000;
        // $scope.counttime = hhmmss(counttime);
        ele.html(hhmmss(counttime));
      }, 1000);

    };

    function hhmmss(val) {
      //自动补全十位数
      var crossten = function(r) {
        return r < 10 ? ('0' + r) : r;
      };
      var hourunit = 60 * 60 * 1000,
        minuteunit = 60 * 1000,
        secondunit = 1000,
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
        //传给directiveId  然后再传回给controller 可以让controller知道那个活动时间截止了
        timeid: '@',
        countDeadCall: '&'
      },
      link: link,
      replace: true
    }
  }
])
