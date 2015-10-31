angular.module('xiaomaiApp').filter('ldcdeliverytime', function() {
  var switchDate = function(datestr) {
    var dateReg = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
    var timeReg = /\d{2}:\d{2}/;

    var newTimestr = datestr.match(dateReg)[0].replace(/-\//, '');
    var now = new Date;
    var nowMonth = now.getMonth() + 1;
    var nowDay = now.getDate();

    nowMonth = nowMonth < 10 ? ('0' + nowMonth) : nowMonth;
    nowDay = nowDay < 10 ? ('0' + nowDay) : nowDay;
    nowDate = nowMonth + nowDay;

    if (nowDate == newTimestr) {
      return datestr.match(timeReg)[0];
    } else {
      return '明天' + datestr.match(timeReg)[0];
    }
  }
  return function(val) {
    return switchDate(val);
  }
});
//当日达订单ctrl
angular.module('xiaomaiApp').controller('ldcOrderCtrl', [
  '$scope',
  'orderManager',
  'xiaomaiMessageNotify',
  '$q',
  'xiaomaiService',
  function($scope, orderManager, xiaomaiMessageNotify, $q, xiaomaiService) {
    $scope.showOrder = false;

    //获取LDC订单
    orderManager.getOrderInfo('order.childOrderList').then(function(res) {
      angular.forEach(res, function(item) {
        if (item.distributeType == 1) {
          $scope.showOrder = true;

          $scope.ldcAddressTime = item.isFixDeliveryTime ? (item.ldcFixBeginTime + '~' + item.ldcFixEndTime) :
            item.deliveryTimeStr;

          //向后台发送送货时间
          $scope.chooseTime($scope.ldcAddressTime);

          $scope.orderInfo = item;
          $scope.childOrderDetailList = item.childOrderDetailList
        }
      });
    });

    var showTodayOrTomorrow = function(timestr) {
      var dateReg = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
      var timeReg = /\d{2}:\d{2}/;

      var newTimestr = timestr.match(dateReg)[0].replace(/-\//, '');
      var now = new Date;
      var nowMonth = now.getMonth() + 1;
      var nowDay = now.getDate();

      nowMonth = nowMonth < 10 ? ('0' + nowMonth) : nowMonth;
      nowDay = nowDay < 10 ? ('0' + nowDay) : nowDay;
      nowDate = nowMonth + nowDay;

      if (nowDate == newTimestr) {
        return timestr.match(timeReg)[0];
      } else {
        return '明天' + timestr.match(timeReg)[0];
      }
    };
    //获取送货时间列表

    xiaomaiService.fetchOne('ldcDeliveryTime').then(function(res) {
      $scope.deliveryTimes = res.ldcTimeList;
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

    //选择送货时间
    $scope.chooseTime = function(val) {
      var reg = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
      if (val.match(reg)) {
        var times = val.split('~');
        xiaomaiMessageNotify.pub('updateLdcDeliveryTime', {
          ldcDeliveryBeginTime: times[0],
          ldcDeliveryEndTime: times[1]
        });
      } else {
        xiaomaiMessageNotify.pub('updateLdcDeliveryTime', {
          ldcDeliveryBeginTime: '',
          ldcDeliveryEndTime: ''
        });
      }

    }
  }
]);
