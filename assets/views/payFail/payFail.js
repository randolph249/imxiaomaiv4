angular.module('xiaomaiApp').controller('payFailCtrl', [

  '$scope',
  '$state',
  'cartManager',
  function($scope, $state, cartManager) {
    var userId = $state.params.userId;
    var orderId = $state.params.orderId;

    //关闭当前页面
    $scope.closeWindow = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      WeixinJSBridge.invoke('closeWindow', {}, function(res) {});

    };
    //清空购物车
    cartManager.clear().then(function() {

    });


    //返回首页
    $scope.gotoIndex = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.buy.nav.all');
    };

    //删除订单？
    $scope.deleteOrder = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
    };

  }
]);
