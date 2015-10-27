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
    $scope.$on('$destroy', function() {
      addrMananger.setAddr({});
    });

    //跳转到预支付页面
  }
]);

//次日达订单ctrl
angular.module('xiaomaiApp').controller('rdcOrderCtrl', [
  '$scope',
  'orderManager',
  function($scope, orderManager) {
    $scope.showOrder = false;

    orderManager.getRdcOrder().then(function(res) {
      $scope.childOrderDetailList = res.childOrderDetailList;
      // $scope.showOrder = true;
    });
  }
]);

//当日达订单ctrl
angular.module('xiaomaiApp').controller('ldcOrderCtrl', [
  '$scope',
  'orderManager',
  function($scope, orderManager) {
    $scope.showOrder = false;

    orderManager.getLdcOrder().then(function(res) {
      // $scope.showOrder = true;
      $scope.deliveryType = res.deliveryType;
      $scope.childOrderDetailList = res.childOrderDetailList;
    });
  }
]);

//第三方订单ctrl
angular.module('xiaomaiApp').controller('thirdOrderCtrl', [
  '$scope',
  'orderManager',
  function($scope, orderManager) {
    $scope.showOrder = false;
    orderManager.getLogistics().then(function(res) {
      $scope.collegeAddr = res.collegeAddr;
      return orderManager.getThirdOrder()
    }).then(function(res) {
      // $scope.showOrder = true;
      $scope.thirdFreight = res.thirdFreight;
      $scope.thirdFreightSub = res.thirdFreightSub;
      $scope.thirdChildOrderList = res.thirdChildOrderList;
    });
  }
]);
