//第三方订单ctrl
angular.module('xiaomaiApp').controller('thirdOrderCtrl', [
  '$scope',
  'orderManager',
  '$q',
  function($scope, orderManager, $q) {
    $scope.showOrder = false;

    orderManager.getOrderInfo('college').then(function(res) {
      $scope.collegeAddr = res.collegeAddr;
    });

    orderManager.getOrderInfo('order.thirdChildOrderList').then(function(res) {
      if (!res || !res.length) {
        return false;
      }

      $scope.showOrder = true;
      $scope.thirdChildOrderList = res;
    });

    //查询订单运费信息
    $q.all([
      orderManager.getOrderInfo('order.thirdFreight'),
      orderManager.getOrderInfo('order.thirdFreightSub')
    ]).then(function(reslist) {
      $scope.thirdFreight = reslist[0]
      $scope.thirdFreightSub = reslist[1];
    });


    //切换订单数据显示状态
    $scope.initGoodShowStatus = false;
    $scope.triggerShowStatus = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.initGoodShowStatus = !$scope.initGoodShowStatus;
      xiaomaiMessageNotify.pub('confirmoderHeightUpdate', 'down', 'ready', '', '');
    };


  }
]);
