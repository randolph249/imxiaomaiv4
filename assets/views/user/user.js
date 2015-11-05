/**
 *autor:zhangjing
 *date:20151102
 **/
angular.module('xiaomaiApp').controller('userCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog) {
    //返回首页
    $scope.goHome = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.buy.nav.all');
    };

    //获取用户信息:姓名 电话
    xiaomaiService.fetchOne('usercenter').then(function(res) {
      $scope.userInfo = res.userInfo;
    }, function() {

    });

    //获取可用优惠券数
    xiaomaiService.fetchOne('mycoupon').then(function(coupons) {
      var availableCoupons = [];
      angular.forEach(coupons.couponInfo, function(item) {
        item.status === 1 && (availableCoupons.push(
          availableCoupons));
      });
      $scope.coupons = availableCoupons;
    }, function() {}).finally(function() {});

    //点击跳转我的优惠券
    $scope.gotoCoupon = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      window.location.href = '/couponwap/myCouponList/webwiew';
      return false;
    };

    //点击跳转我的订单
    $scope.gotoMyOrder = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      window.location.href = '/order/myOrder';
      return false;
    };

    //点击跳转意见反馈
    $scope.gotofeedback = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.feedback');
    };

  }
]);
