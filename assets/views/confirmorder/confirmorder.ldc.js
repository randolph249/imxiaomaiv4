angular.module('xiaomaiApp').directive('triggerMobIscroll', [
  function() {
    var link = function($scope, iElm, iAttrs) {
      iElm.on('click', function(e) {
        var selector = iElm.find('select');

        if (selector.length) {
          selector.mobiscroll('getInst').show();
        }
        e.preventDefault();
        e.stopPropagation();
      });
    }
    return {
      template: '<p  class="" ng-transclude></p>',
      link: link,
      transclude: true
    }
  }
]);

angular.module('xiaomaiApp').filter('filterldctomorrow', function() {
  return function(val) {
    var reg = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
    var date = new Date().getTime();
    var targetDate = new Date(val.match(reg)[0]).getTime();
    return val.replace(/\d{4}[-\/]\d{2}[-\/]\d{2}\s{0,}/, targetDate > date ? '明天' : '');
  }
});
//当日达订单ctrl
angular.module('xiaomaiApp').controller('ldcOrderCtrl', [
  '$scope',
  'orderManager',
  'xiaomaiMessageNotify',
  '$q',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiLog',
  function($scope, orderManager, xiaomaiMessageNotify, $q, xiaomaiService, schoolManager, xiaomaiLog) {
    $scope.showOrder = false;

    var collegeId;

    var todayOrTomorrow = function(val) {
      var reg = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
      var date = new Date().getTime();
      var targetDate = new Date(val.match(reg)[0]).getTime();
      return val.replace(/\d{4}[-\/]\d{2}[-\/]\d{2}\s{0,}/, targetDate > date ? '明天' : '');
    };

    $q.all([
      orderManager.getOrderInfo('order.childOrderList'),
      orderManager.getOrderInfo('ldcTimeSwitch'),
      orderManager.getOrderInfo('college')
    ]).then(function(reslist) {
      var childOrderList = reslist[0];
      $scope.ldcTimeSwitch = reslist[1] == 0;
      collegeId = reslist[2]['collegeId'];
      //获取用户orderlist
      getLdcOrderList(childOrderList);
      //获取配送时间
      getDeliveryTimes();
    });


    //获取LDCorder list
    var getLdcOrderList = function(orderList) {
      angular.forEach(orderList, function(item) {
        if (item.distributeType == 1) {
          $scope.showOrder = true;
          $scope.orderInfo = item;
          $scope.childOrderDetailList = item.childOrderDetailList;
          //是否正常营业
          $scope.ldcTimeIsOpen = item.deliveryTimeType == 0;
          //判断LDC类型是否是商超
          $scope.ldcTypeIsSc = item.orderDeliveryTimeType == 2;
          $scope.initLldcAddressTime = $scope.ldcTimeIsOpen ? item.deliveryTimeStr : (todayOrTomorrow(item.ldcFixBeginTime) +
            '~' + todayOrTomorrow(item.ldcFixEndTime));

          $scope.ldcAddressTime = $scope.initLldcAddressTime;
          xiaomaiMessageNotify.pub('updateLdcDeliveryTime', {
            ldcDeliveryBeginTime: item.ldcFixBeginTime,
            ldcDeliveryEndTime: item.ldcFixEndTime
          });
        }
      });
    };
    $scope.deliveryTimes = [];
    //获取定时达配送
    //当定时达开关关闭或者当日送类型是商超的时候 不需要请求定时配送列表
    var getDeliveryTimes = function() {
      if (!$scope.ldcTimeSwitch || $scope.ldcTypeIsSc) {
        return false;
      }
      xiaomaiService.fetchOne('ldcDeliveryTime', {
        collegeId: collegeId
      }).then(function(res) {
        res.ldcTimeList.length && ($scope.deliveryTimes = res.ldcTimeList);
      });
    };


    //获取运费
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
      xiaomaiLog('m_b_33confordergoodslistdetail');
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

    var getYearAndMonthAndDay = function(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      month = month < 10 ? ('0' + month) : month;
      day = day < 10 ? ('0' + day) : day;
      return [year, month, day].join('-');
    };

    var switchLdcTime = function(time) {
      var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var todayDate = new Date();

      if (time.indexOf('明天') != -1) {
        return getYearAndMonthAndDay(tomorrowDate) + ' ' + time.replace('明天', '');
      } else {
        return getYearAndMonthAndDay(todayDate) + ' ' + time;
      }
    }

    //选择送货时间
    $scope.chooseTime = function(val) {
      $scope.ldcAddressTime = val;
      var reg = /\d{2}:\d{2}/;
      if (val.match(reg)) {
        var times = val.split('~');
        xiaomaiMessageNotify.pub('updateLdcDeliveryTime', {
          ldcDeliveryBeginTime: switchLdcTime(times[0]),
          ldcDeliveryEndTime: switchLdcTime(times[1])
        });
      } else {
        xiaomaiMessageNotify.pub('updateLdcDeliveryTime', {
          ldcDeliveryBeginTime: '',
          ldcDeliveryEndTime: ''
        });
      }

    };

    $scope.updateLdcRemark = function($event, val) {
      if (val.length >= 50) {
        $event.preventDefault();
        return false;
      }
      xiaomaiMessageNotify.pub('updateLdcRemark', val);
    };
  }
]);
