//确认订单下面下的选择优惠劵页面

angular.module('xiaomaiApp').controller('confirmorder.couponListCtrl', [
  '$scope',
  '$state',
  'orderManager',
  '$q',
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  function($scope, $state, orderManager, $q, xiaomaiMessageNotify, xiaomaiLog) {


    //优惠劵列表PV统计
    xiaomaiLog('m_p_33mycoupons');

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.checkedCouponId = Number(toParam.couponid);
    });

    $scope.goback = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      //关闭按钮tongji
      xiaomaiLog('m_b_33selectcouponsnocoupons');
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
    }).finally(function() {
      xiaomaiMessageNotify.pub('confirmCouponListHeightUpdate', 'up', 'ready', '', '');
    });

    //选择优惠劵
    $scope.chooseCoupon = function($event, type, index) {
      $event.preventDefault();
      $event.stopPropagation();

      //不选择使用优惠劵统计
      //使用优惠劵统计
      if (type == 'none') {
        xiaomaiLog('m_b_33selectcouponsclose');
      } else {
        xiaomaiLog('m_b_33selectcouponsselectone');
      }

      xiaomaiMessageNotify.pub('updateOrderCouponInfo', {
        couponType: type,
        firstsub: $scope.firstCoupon,
        coupon: $scope.couponlist[index] || $scope.couponlist[0]
      });
      $state.go('root.confirmorder');
    };
  }
]);
