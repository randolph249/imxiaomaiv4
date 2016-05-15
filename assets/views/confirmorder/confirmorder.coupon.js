//优惠劵之前的Subx
//优惠劵信息Ctrl
angular.module('xiaomaiApp').controller('orderCouponCtrl', [
  '$scope',
  '$state',
  'xiaomaiMessageNotify',
  'orderManager',
  '$q',
  function($scope, $state, xiaomaiMessageNotify, orderManager, $q) {
    $scope.showCoupon = false;

    $q.all([
      orderManager.getOrderInfo('firstCoupon'),
      orderManager.getOrderInfo('couponList')
    ]).then(function(reslist) {
      $scope.firstCoupon = reslist[0];
      $scope.couponlist = reslist[1];
      $scope.showCoupon = !$scope.firstCoupon && !$scope.couponlist.length ? false : true;

      /**
       *couponType有三个值(firstsub-满减/othercoupon-其他优惠劵/none-不使用优惠劵)
       **/
      xiaomaiMessageNotify.pub('updateOrderCouponInfo', {
        couponType: $scope.firstCoupon ? 'firstsub' : ($scope.couponlist.length ? 'othercoupon' : 'none'),
        coupon: $scope.couponlist[0],
        firstsub: $scope.firstCoupon
      })
    });

    //获取当前优惠劵的使用情况
    var subCouponupdateId = xiaomaiMessageNotify.sub('updateOrderCouponInfo', function(couponInfo) {
      $scope.checkedCouponInfo = couponInfo;
    });

    //删除对于优惠劵使用的监听
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('updateOrderCouponInfo', subCouponupdateId);
    });

    //跳转到Coupon列表
    $scope.gotoCoupon = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      var couponid;
      switch ($scope.checkedCouponInfo.couponType) {
        case 'none':
          couponid = -1;
          break;
        case 'firstsub':
          couponid = 0;
          break;
        case 'othercoupon':
          couponid = $scope.checkedCouponInfo.coupon.couponId;
          break;
      }
      $state.go('root.confirmorder.couponlist', {
        couponid: couponid
      });
    };
  }
]);
