angular.module('xiaomaiApp').controller('payFailCtrl', [
    '$scope',
    '$state',
    'xiaomaiService',
    'xiaomaiCacheManager',
    'xiaomaiLog',
    'env',
    function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog, env) {
        //返回网页
        $scope.closeWindow = function() {
             WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
        };

        
        //取消订单
        $scope.deleteOrder = function(){
        	 xiaomaiService.fetchOne('delete', {}, true).then(function(res) {
           		alert(res.code);
        }, function() {}).finally(function() {});
        }
       

    }
]);

