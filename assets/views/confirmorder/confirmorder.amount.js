//订单金额计算Ctrl
angular.module('xiaomaiApp').controller('orderAmountCtrl', [
  '$scope',
  'orderManager',
  '$q',
  'xiaomaiMessageNotify',
  function($scope, orderManager, $q, xiaomaiMessageNotify) {
    //订单总额
    $scope.totalAmount = 0;
    //运费
    $scope.totalFreight = 0;
    //优惠劵
    $scope.totalCoupon = 0;

    var totalPay, freightTotal, thirdFreight, subDeliveryTypeId;
    //查询LDC运费信息
    //查询订单总额
    $q.all([
      orderManager.getOrderInfo('order.totalPay'),
      orderManager.getOrderInfo('ldcFreight')
    ]).then(function(reslist) {
      $scope.totalAmount = reslist[0];
      var freight = reslist[1].freight;
      var freightSub = reslist[1].sub;
      freightTotal = reslist[1].total >= $scope.totalAmount ? (freight - freightSub) : freight;
      $scope.totalFreight += freightTotal;
    }).finally(function() {
      //订阅LDC配送方式变更
      subDeliveryTypeId = xiaomaiMessageNotify.sub('updateLdcDeliveryType', function(type) {
        if (type === 1) {
          $scope.totalFreight += freightTotal;
        } else if (type === 0) {
          $scope.totalFreight -= freightTotal;
        }
      });
    });



    //查询第三方订单运费信息
    $q.all([
      orderManager.getOrderInfo('order.thirdFreight'),
      orderManager.getOrderInfo('order.thirdFreightSub')
    ]).then(function(reslist) {
      thirdFreight = reslist[0] - reslist[1];
      $scope.totalFreight += thirdFreight;
    });

    //获取当前优惠劵的使用情况
    var subCouponupdateId = xiaomaiMessageNotify.sub('updateOrderCouponInfo', function(couponInfo) {
      switch (couponInfo.couponType) {
        case 'none':
          $scope.totalCoupon = 0;
          break;
        case 'firstsub':
          $scope.totalCoupon = couponInfo.firstsub;
          break;
        case 'othercoupon':
          $scope.totalCoupon = couponInfo.coupon.money;
          break;
        default:
          break;

      }
    });

    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('updateLdcDeliveryType', subDeliveryTypeId);
      xiaomaiMessageNotify.removeOne('updateOrderCouponInfo', subCouponupdateId);
    });

  }
]);
