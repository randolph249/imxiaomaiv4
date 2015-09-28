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


      //更新提示文案
      var updateTip = function(uptiptext, downtiptext) {
        var childnode = ele.children()[0];
        upTip.textContent = uptiptext;
        downTip.textContent = downtiptext;

        upTip.className = upTip.className.replace('pending', '').trim();
        downTip.className = downTip.className.replace('pending', '').trim();


        childnode.firstChild != upTip && childnode.insertBefore(upTip,
          childnode.firstChild);
        childnode.lastChild != downTip && childnode.appendChild(downTip);
      };


      $scope.scrollstatus = 'ready'; //默认的状态是ready

      myScroll.on('scrollStart', function() {});


      //如果没有通知说 自定义执行300MS执行渲染
      var refreshTimeout = setTimeout(function() {
        var childnode = ele.children()[0];
        maxScrollY = childnode.offsetHeight - ele[0].offsetHeight;
        myScroll && myScroll.refresh();
      }, 1000);

      //scroll默认延时100MS执行
      var $scrolltimeout;

      //区域高度
      var maxScrollY;

      myScroll.on('scroll', function() {


        if ($scope.scrollstatus !== 'ready') {
          return false;
        }

        if (this.y > 40) {
          $scrolltimeout && clearTimeout($scrolltimeout);
          $scrolltimeout = setTimeout(function() {
            xiaomaiMessageNotify.pub($scope.pubname, 'up');
            $scope.scrollstatus = 'pending';
          }, 100);
        } else if (Math.abs(this.y) > maxScrollY + 40) {
          $scrolltimeout && clearTimeout($scrolltimeout);
          $scrolltimeout = setTimeout(function() {
            xiaomaiMessageNotify.pub($scope.pubname, 'down');
            $scope.scrollstatus = 'pending';
          }, 100);
        }

      });


      $scope.subname && xiaomaiMessageNotify.sub($scope.subname, function(
        arrow, status,
        uptiptext, downtiptext) {
        var childnode = ele.children()[0];

        if (arrow == 'up') {
          if (status == 'ready') {

            $scope.scrollstatus = 'ready';

            refreshTimeout && clearTimeout(refreshTimeout);
            refreshTimeout = null;
            setTimeout(function() {
              myScroll && myScroll.refresh();
              maxScrollY = childnode.offsetHeight - ele[0].offsetHeight;
              myScroll.scrollTo(0, 0);
              //更新提示信息
              updateTip(uptiptext, downtiptext);
            }, 50);

          } else {

            $scope.scrollstatus = 'pending';
            upTip.className = upTip.className + ' pending';
            upTip.textContent = uptiptext;
          }
        } else if (arrow == 'down') {
          if (status == 'ready') {
            $scope.scrollstatus = 'ready';
            refreshTimeout && clearTimeout(refreshTimeout);
            refreshTimeout = null;

            setTimeout(function() {

              myScroll && myScroll.refresh();
              maxScrollY = childnode.offsetHeight - ele[0].offsetHeight;
              updateTip(uptiptext, downtiptext);
              xiaomaiMessageNotify.pub('navmainscrollupdate',
                'down');

            }, 500);

          } else {

            $scope.scrollstatus = 'pending';
            downTip.className = downTip.className + ' pending';
            downTip.textContent = uptiptext;
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
