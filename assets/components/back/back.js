//iScroll滚动
angular.module('xiaomaiApp').directive('xiaomaiIscroll', [
  'xiaomaiMessageNotify',
  '$timeout',
  '$state',
  function(xiaomaiMessageNotify, $timeout, $state) {
    var link = function($scope, ele, attrs) {

      //创建两个提示
      var upTip = document.createElement('p');
      var $t;
      upTip.className += (' ' + $scope.upTipCls);

      var downTip = document.createElement('p');
      downTip.className += (' ' + $scope.downTipCls);


      //实例化
      var myScroll = new IScroll(ele[0], {
        click: true,
        tap: true,
        probeType: 1
      });

      $scope.scrollstatus = 'ready'; //默认的状态是ready

      myScroll.on('scrollStart', function() {});

      //
      // $timeout(function() {
      //   $scope.scrollstatus == 'ready' && xiaomaiMessageNotify.pub(
      //     $scope.pubname,
      //     'down');
      // }, 1000)

      //scroll默认延时100MS执行
      var $scrolltimeout;

      var maxScrollY;

      myScroll.on('scroll', function() {


        if ($scope.scrollstatus !== 'ready') {
          return false;
        }


        if (this.y > 30) {
          $scrolltimeout && clearTimeout($scrolltimeout);
          setTimeout(function() {
            xiaomaiMessageNotify.pub($scope.pubname, 'up');
            $scope.scrollstatus = 'pending';
          }, 100);
        } else if (Math.abs(this.y) > maxScrollY + 30) {
          $scrolltimeout && clearTimeout($scrolltimeout);
          setTimeout(function() {
            xiaomaiMessageNotify.pub($scope.pubname, 'down');
            $scope.scrollstatus = 'pending';
          }, 100);
        }

      });

      $scope.subname && xiaomaiMessageNotify.sub($scope.subname, function(
        arrow, status,
        tip) {

        var childnode = ele.children()[0];

        if (arrow == 'up') {
          if (status == 'ready') {

            $scope.scrollstatus = 'ready';

            setTimeout(function() {
              myScroll && myScroll.refresh();
              maxScrollY = childnode.offsetHeight - ele[0].offsetHeight;
            }, 50);
            childnode.firstChild == upTip && childnode.removeChild(
              upTip);

          } else {
            $scope.scrollstatus = 'pending';
            upTip.textContent = tip;
            childnode.insertBefore(upTip, childnode.firstChild);
          }
        } else if (arrow == 'down') {

          if (status == 'ready') {
            $scope.scrollstatus = 'ready';

            setTimeout(function() {
              myScroll && myScroll.refresh();
              maxScrollY = childnode.offsetHeight - ele[0].offsetHeight;
            }, 50);

            childnode.lastChild == upTip && childnode.removeChild(
              upTip);


          } else {

            $scope.scrollstatus = 'pending';
            upTip.textContent = tip;
            childnode.appendChild(upTip);
          }
        }
      });

      $scope.$on('$destroy', function() {

        myScroll && myScroll.destroy();
        $timeout.cancel($t);
        myScroll = null;
        //删除订阅
        xiaomaiMessageNotify.remove($scope.subname);


      });
    }

    return {
      scope: {
        pubname: '@', //发送给所有希望能接受iscroll信息的controller/directive
        subname: '@', //订阅希望通知
        options: '@',
        upTipCls: '@',
        downTipCls: '@'
      },
      link: link,
    }
  }
]);
