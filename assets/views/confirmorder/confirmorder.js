angular.module('xiaomaiApp').controller('orderCtrl', [
  '$scope',
  '$state',
  'xiaomaiLog',
  'orderManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiLog, orderManager, xiaomaiMessageNotify) {
    $scope.goBack = function() {
      $state.go('root.buy.nav.all');
    };

    //监听refer参数
    var $watcher = $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      sendLog(toParam.r);
      verifyOrder();
      $watcher();
    });

    //验证订单状态
    var verifyOrder = function() {
      //判断订单是否失效如果失效直接跳回到首页
      var orderStatus = orderManager.queryOrderStatus();
      if (orderStatus == false) {
        alert('当前订单已经不存在,\n将回到首页');
        $state.go('root.buy.nav.all');
      }
    };

    orderManager.getOrderInfo('order').then(function() {
      setTimeout(function() {
        xiaomaiMessageNotify.pub('confirmoderHeightUpdate', 'up', 'ready', '', '');
      }, 100);
    });

    //统计日志
    var sendLog = function(refer) {
      //确认订单页面PV统计
      xiaomaiLog('m_b_31confirmorder');
      //来源统计
      xiaomaiLog('m_r_31confirorderfrom' + refer);
    };
  }
]);

//订单倒计时
angular.module('xiaomaiApp').controller('orderCountdownCtrl', [
  '$scope',
  '$state',
  'orderManager',
  '$interval',
  function($scope, $state, orderManager, $interval) {
    //订单剩余时间信息
    var remaintimeInfo = orderManager.getRemaintime();
    var currentTime = (+new Date);
    var consumetime = currentTime - remaintimeInfo.createTime;
    var realremaintime = remaintimeInfo.limitTime * 60 * 1000 - consumetime;

    $scope.realremaintime = Math.floor(realremaintime / 1000);

    //倒计时
    var $t = $interval(function() {
      $scope.realremaintime = $scope.realremaintime - 1;
      //订单支付超时
      if ($scope.realremaintime <= 0) {
        $interval.cancel($t);
        orderPayTimeend();
      }
    }, 1000);

    //避免用户回退操作给出提示
    //订单支付完成失效 而不是超时失效
    $scope.$on('$destroy', function() {
      $interval.cancel($t);
    });

    //订单超时处理
    var orderPayTimeend = function() {
      orderManager.deleteOrder();
      alert('当前订单已经失效,\n去商城重新下单吧');
      $state.go('root.buy.nav.all');
    }

  }
]);

//付款方式Ctrl
angular.module('xiaomaiApp').controller('orderOnlinepayCtrl', [
  '$scope',
  'xiaomaiMessageNotify',
  '$timeout',
  function($scope, xiaomaiMessageNotify, $timeout) {
    //type:1微信 2支付宝
    var pubOnlinePayType = function(type) {
      xiaomaiMessageNotify.pub('updateOnlinePayType', type);
    };
    $scope.payType = 1;
    $timeout(function() {
      pubOnlinePayType($scope.payType);
    }, 10);
    $scope.choosePaytype = function($event, type) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.payType = type;
      pubOnlinePayType(type);
    }
  }
]);
