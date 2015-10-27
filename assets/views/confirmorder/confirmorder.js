angular.module('xiaomaiApp').controller('addrCtrl', [
  '$scope',
  '$state',
  function($scope, $state) {
    //跳转到地址列表页
    $scope.gotoAddr = function($event) {
      $state.go('root.addr', {
        userId: 123
      });
    };

    //跳转到预支付页面
  }
]);
