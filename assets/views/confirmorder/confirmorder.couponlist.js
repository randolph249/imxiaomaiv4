//确认订单下面下的选择优惠劵页面

angular.module('xiaomaiApp').controller('confirmorder.couponListCtrl', [
  '$scope',
  '$state',
  'orderManager',
  '$q',
  'xiaomaiMessageNotify',
  function($scope, $state, orderManager, $q, xiaomaiMessageNotify) {

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.checkedCouponId = Number(toParam.couponid);
    });
    $scope.goback = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.confirmorder');
    };

    //获取所有的优惠劵
    $q.all([
      orderManager.getOrderInfo('firstCoupon'),
      orderManager.getOrderInfo('couponList')
    ]).then(function(reslist) {
      $scope.firstCoupon = reslist[0];

      angular.forEach(reslist[1], function(item) {
        var remainseconds = item.endTime - item.curTime;
        item.remainDays = Math.floor(remainseconds / (1000 * 60 * 60 * 24));
      });
      $scope.couponlist = reslist[1];
    });

    //选择优惠劵
    $scope.chooseCoupon = function($event, type, index) {
      $event.preventDefault();
      $event.stopPropagation();
      xiaomaiMessageNotify.pub('updateOrderCouponInfo', {
        couponType: type,
        firstsub: $scope.firstCoupon,
        coupon: $scope.couponlist[index] || $scope.couponlist[0]
      });
      $state.go('root.confirmorder');
    };
  }
]);
