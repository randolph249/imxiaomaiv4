//次日达订单ctrl
angular.module('xiaomaiApp').controller('rdcOrderCtrl', [
  '$scope',
  'orderManager',
  'xiaomaiMessageNotify',
  function($scope, orderManager, xiaomaiMessageNotify) {
    $scope.showOrder = false;

    orderManager.getOrderInfo('order.childOrderList').then(function(res) {
      angular.forEach(res, function(item) {
        if (item.distributeType == 0) {
          // $scope.showOrder = true;
          $scope.childOrderDetailList = item.childOrderDetailList
        }
      });
    });

    //获取学校物流信息
    orderManager.getOrderInfo('college').then(function(res) {
      $scope.rdcSelfPickUpAddress = res.rdcSelfPickUpAddress;
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
