angular.module('xiaomaiApp').controller('paySuccessCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'cartManager',
  function($scope, $state, xiaomaiService, cartManager) {
    var userId = $state.params.userId;
    var orderId = $state.params.orderId;

    //默认显示红包界面
    $scope.showRedpacketDialog = true;

    //关闭当前页面
    $scope.closeWindow = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      WeixinJSBridge.invoke('closeWindow', {}, function(res) {});

    };
    //清空购物车
    cartManager.clear().then(function() {

    });

    //查询订单详情
    $scope.queryOrderDetail = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      window.location.href = "/order/orderDetail?orderId=" + orderId + "&userId=" + userId;
    };

    //返回首页
    $scope.gotoIndex = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.buy.nav.all');
    };

    //跳转到发送红包页面
    $scope.goRedpacket = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      window.location.href = "/couponwap/fusion/share?orderId=" + orderId;
    };

    //取消发红包
    $scope.cancelSendRedpacket = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.showRedpacketDialog = false;
    };

  }
]);

