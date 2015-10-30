angular.module('xiaomaiApp').controller('userCtrl', [
    '$scope',
    '$state',
    'xiaomaiService',
    'xiaomaiCacheManager',
    'xiaomaiLog',
    'env',
    function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog, env) {
        //返回首页
        $scope.goHome = function() {
            $state.go('root.buy.nav.all');
        };

        //获取用户信息:姓名 电话
        xiaomaiService.fetchOne('usercenter', {}, true).then(function(res) {
            xiaomaiCacheManager.writeCache('usercenter', res);
            $scope.userInfo = res.userInfo;
        }, function() {}).finally(function() {});

        //获取可用优惠券数
        xiaomaiService.fetchOne('mycoupon', {}, true).then(function(coupons) {
            xiaomaiCacheManager.writeCache('mycoupon', coupons);
            var availableCoupons = [];
            angular.forEach(coupons.couponInfo, function(item) {
                item.status === 0 && (availableCoupons.push(
                    availableCoupons));
            });
            $scope.coupons = availableCoupons;
        }, function() {}).finally(function() {});

        //点击跳转我的优惠券
        $scope.gotoCoupon = function() {
            var host = env == 'online' ? 'http://h5.imxiaomai.com' :
                'http://wap.tmall.imxiaomai.com';
            window.location.href = host + '/couponwap/myCouponList/webwiew';
            return false;
        };
        //点击跳转我的订单
        $scope.gotoMyOrder = function() {
            var host = env == 'online' ? 'http://h5.imxiaomai.com' :
                'http://wap.tmall.imxiaomai.com';
            window.location.href = host + '/order/myOrder';
            return false;
        };
        //点击跳转意见反馈
        $scope.gotofeedback = function() {
           $state.go('root.feedback');
        };

    }
]);
