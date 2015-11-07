angular.module('xiaomaiApp').controller('payFailCtrl', [
  '$scope',
  '$state',
  'cartManager',
  'xiaomaiLog',
  function($scope, $state, cartManager, xiaomaiLog) {
    var userId = $state.params.userId;
    var orderId = $state.params.orderId;

    //支付失败PV统计
    xiaomaiLog('m_p_33failedpay');

    //关闭当前页面
    $scope.closeWindow = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      //关闭按钮点击统计
      xiaomaiLog('m_b_32failedpayclose');
      WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
    };
    //清空购物车
    //返回首页
    $scope.gotoIndex = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      //重新支付点击统计
      xiaomaiLog('m_b_32failedpayrepay');
      $state.go('root.buy.nav.all');
    };

    //删除订单？
    $scope.deleteOrder = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      //取消订单点击统计
      xiaomaiLog('m_b_32failedpaycancel');
      cartManager.clear().then(function() {
        $state.go('rooy.buy.nav.all');
      });
    };

  }
]);
