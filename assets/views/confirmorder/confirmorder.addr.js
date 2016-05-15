//收货人信息
angular.module('xiaomaiApp').controller('addrCtrl', [
  '$scope',
  '$state',
  'orderManager',
  'addrMananger',
  function($scope, $state, orderManager, addrMananger) {

    //获取收货地址
    addrMananger.getAddr().then(function(addrInfo) {
      $scope.addrInfo = addrInfo;
    });

    var userId = orderManager.getUserId();
    //跳转到地址列表页
    $scope.gotoAddr = function($event) {
      $state.go('root.addr', {
        addrId: $scope.addrInfo.userAddrId,
        userId: userId
      });
    };

    //页面销毁之前 置空addrInfo
    //防止用户下次下单的时候
    //因为不同学校无法下单
    $scope.$on('$destroy', function() {
      addrMananger.setAddr({});
    });

  }
]);
