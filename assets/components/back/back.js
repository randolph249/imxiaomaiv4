//iScroll滚动
angular.module('xiaomaiApp').directive('xiaomaiIscroll', [
  'xiaomaiMessageNotify',
  '$timeout',
  '$state',
  function(xiaomaiMessageNotify, $timeout, $state) {
    // alert(123);
    var link = function($scope, ele, attrs) {

      return false;

      //创建两个提示
      var upTip = document.createElement('p');
      var $t;
      upTip.className += (' ' + $scope.upTipCls);

      var downTip = document.createElement('p');
      downTip.className += (' ' + $scope.downTipCls);

      var myScroll = new IScroll(ele[0], {
        click: true,
        tap: true,
        probeType: 1
      });

      $scope.scrollstatus = 'ready'; //默认的状态是ready

      myScroll.on('scrollStart', function() {});


      // $timeout(function() {
      //   myScroll.scrollTo(0, -4800);
      //   $scope.scrollstatus == 'ready' && xiaomaiMessageNotify.pub(
      //     $scope.pubname,
      //     'down');
      // }, 1000)

      myScroll.on('scroll', function() {

        //如果用户下拉刷新
        if (this.y > 30) {
          // p.textContent = '刷新信息';
          $scope.scrollstatus == 'ready' && xiaomaiMessageNotify.pub(
            $scope.pubname,
            'up');

          //上拉加载
        } else if (this.y < this.maxScrollY - 30) {


          $scope.scrollstatus == 'ready' && xiaomaiMessageNotify(
            $scope.pubname,
            'down');
          // p.textContent = '翻页';
        }
      });

      myScroll.on('scrollEnd', function() {});

      //订阅通知
      $scope.subname && xiaomaiMessageNotify.sub($scope.subname, function(
        arrow, status,
        tip) {

        var childnode = ele[0].children[0];

        if (arrow == 'up') {
          if (status == 'ready') {

            $scope.scrollstatus = 'ready';

            myScroll.refresh();
            $t = $timeout(function() {
              myScroll.refresh();
            }, 100);
            /**
            childnode.removeChild(upTip);
            **/
          } else {
            $scope.scrollstatus = 'pending';
            upTip.textContent = tip;
            childnode.insertBefore(upTip, childnode.firstChild);
          }
        } else if (arrow == 'down') {

          if (status == 'ready') {

            $scope.scrollstatus = 'ready';
            //保证refresh会在渲染之后计算
            $t = $timeout(function() {
              myScroll && myScroll.refresh();
            }, 200);
            childnode.removeChild(downTip);
          } else {
            $scope.scrollstatus = 'pending';
            downTip.textContent = tip;
            childnode.appendChild(downTip);
          }
        }
      });

      $scope.$on('$stateChangeStart', function() {
        myScroll && myScroll.destroy();
        $timeout.cancel($t);
        myScroll = null;
        //删除订阅
        xiaomaiMessageNotify.remove($scope.subname);
      });


      $scope.$on('$destory', function() {

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


//不同controller/directive之间相互通信
//一个简单的订阅发布模块
//消息中心缓存不能根据缓存数量删除 以避免订阅以后因为内存不足而被删除
//所以需要单独的放置一块缓存
//所以这块的使用要谨慎
//当不需要的时候 要执行手动删除
angular.module('xiaomaiApp').factory('xiaomaiMessageNotify', [
  'xiaomaiCacheManager',
  '$window',
  function(xiaomaiCacheManager, $window) {
    //消息中心池子
    var notifyPool = {};

    //执行订阅
    var sub = function(eventname, callback) {
      //查看池子中是否已经订阅
      var callbacks = notifyPool.hasOwnProperty(eventname) ?
        notifyPool[
          eventname] : {};

      //给订阅者生成一个唯一ID 方便订阅者以后删除订阅
      var subId = ('' + Math.random()).replace(/\./, '');
      callbacks[subId] = callback;
      //更新消息池子
      notifyPool[eventname] = callbacks;
      return subId;
    };

    //发布通知
    var pub = function(eventname) {


      //先看池子中是否有订阅事件
      var callbacks = notifyPool[eventname];
      //如果没有订阅或者订阅为空
      if (!angular.isObject(callbacks) || !Object.keys(callbacks).length) {
        return false;
      }
      var args = Array.prototype.slice.call(arguments, 1);

      angular.forEach(callbacks, function(callback) {
        angular.isFunction(callback) && callback.apply($window,
          args);
      });
    };
    //从订阅列表中删除某一个订阅
    var removeOne = function(eventname, subId) {
      var callbacks = notifyPool[eventName];
      if (angular.isObject(callbacks) && callbacks.hasOwnProperty(
          subId)) {
        delete callbacks[subId];
      }
    };
    //删除所有订阅释放缓存
    var remove = function(eventname) {
      delete notifyPool[eventname];
    };
    return {
      pub: pub,
      sub: sub,
      removeOne: removeOne,
      remove: remove
    };
  }
]);
