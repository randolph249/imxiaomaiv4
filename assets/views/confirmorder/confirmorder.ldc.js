//当日达订单ctrl
angular.module('xiaomaiApp').controller('ldcOrderCtrl', [
  '$scope',
  'orderManager',
  'xiaomaiMessageNotify',
  '$q',
  function($scope, orderManager, xiaomaiMessageNotify, $q) {
    $scope.showOrder = false;

    //获取LDC订单
    orderManager.getOrderInfo('order.childOrderList').then(function(res) {
      angular.forEach(res, function(item) {
        if (item.distributeType == 1) {
          $scope.showOrder = true;
          $scope.childOrderDetailList = item.childOrderDetailList
        }
      });
    });

    $q.all([
      orderManager.getOrderInfo('order.totalPay'),
      orderManager.getOrderInfo('ldcFreight')
    ]).then(function(reslist) {
      var totalAmount = reslist[0];
      var freight = reslist[1].freight;
      var freightSub = reslist[1].sub;
      freightTotal = reslist[1].total >= totalAmount ? (freight - freightSub) : freight;
      $scope.freight = freightTotal;
      $scope.freightSub = freightSub;

    });

    //订阅LDC配送地址列表
    orderManager.getOrderInfo('ldcAddressList').then(function(res) {
      $scope.ldcAddressList = res;
      //默认第一个配送地址
      $scope.ldcAddressName = res[0]['addresses'][0];
      $scope.chooseAddress($scope.ldcAddressName);
    });

    //获取学校物流信息
    //ldcDeliveryType 0自提 1配送
    orderManager.getOrderInfo('college').then(function(res) {
      $scope.ldcSelfPickUpAddress = res.ldcSelfPickUpAddress;
      $scope.initDeliveryType = res.ldcDeliveryType;
      //当配送方式是2的时候 默认门店自提是选中状态
      $scope.chooseType(res.ldcDeliveryType != 2 ? res.ldcDeliveryType : 1);
    });



    //切换订单数据显示状态
    $scope.initGoodShowStatus = false;
    $scope.triggerShowStatus = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.initGoodShowStatus = !$scope.initGoodShowStatus;
      xiaomaiMessageNotify.pub('confirmoderHeightUpdate', 'down', 'ready', '', '');

    };

    //设置配送方式
    $scope.chooseType = function(type) {
      $scope.ldcDeliveryType = type;
      xiaomaiMessageNotify.pub('updateLdcDeliveryType', type);
    };

    //设置送货地址
    $scope.chooseAddress = function(val) {
      xiaomaiMessageNotify.pub('updateLdcDeliveryAddress', val);
    };
  }
]);
