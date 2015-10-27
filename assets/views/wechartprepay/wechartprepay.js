angular.module('xiaomaiApp').controller('wechartprepayCtrl', [
    '$scope',
    '$state',
    'xiaomaiService',
    'xiaomaiCacheManager',
    'xiaomaiLog',
    'env',
    function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog, env) {
        


        //获取用户信息:姓名 电话
        xiaomaiService.fetchOne('queryOrder', {userId:1,orderId:1}, true).then(function(res) {
            $scope.order = res.order;
            $scope.childOrders = res.order.childOrderList;
            $scope.th3orders = res.order.th3ChildOrderList;
            
        }, function() {}).finally(function() {});


    }
]);
