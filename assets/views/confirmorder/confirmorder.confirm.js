//当日达订单ctrl
angular.module('xiaomaiApp').controller('orderConfirmCtrl', [
  '$scope',
  '$state',
  'orderSubmitManager',
  'xiaomaiMessageNotify',
  'orderManager',
  'xiaomaiCacheManager',
  'xiaomaiLog',
  function($scope, $state, orderSubmitManager, xiaomaiMessageNotify, orderManager, xiaomaiCacheManager, xiaomaiLog) {
    //收集提交数据
    orderSubmitManager.initConfirm();

    $scope.$on('$destroy', function() {
      orderSubmitManager.destroyConfirm();
      xiaomaiMessageNotify.removeOne('updateOnlinePayType', subOnlinePayType);
    });

    //监听获取用户的付款方式
    var payType;
    var subOnlinePayType = xiaomaiMessageNotify.sub('updateOnlinePayType', function(type) {
      payType = type;
    });

    //执行提交
    $scope.confirm = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      //点击提交日志
      xiaomaiLog('m_b_33conforderpay');

      if ($scope.lock) {
        return false;
      }
      $scope.lock = true;
      orderSubmitManager.doConfirm().then(function(res) {
        confirmSuccessedHanlder(res);
      }, function(error) {
        confirmFailedHanlder(error);
      }).finally(function() {
        $scope.lock = false;
        //订单是否是在这里失效的
      })
    };

    //支付成功以后的处理逻辑
    var confirmSuccessedHanlder = function(res) {

      if (res.order.status == 5) {
        alert("您已经支付了，请勿重复提交支付请求。");
        return;
      }

      orderManager.deleteOrder();
      //如果是微信支付 跳转到微信预支付页面
      if (payType === 1) {
        xiaomaiCacheManager.writeCache('prepayData', res.prepayData);
        $state.go('root.wechartprepay', {
          userId: res.order.userId,
          orderId: res.order.orderId
        });

      } else if (payType == 2) {
        try {
          _AP.pay(res.prepayData.payUrl, res.order.orderId, res.order.userId);
        } catch (e) {

        }
      }
    };

    //支付失败之后的逻辑处理
    var confirmFailedHanlder = function(error) {
      if (error.code === 1) {
        //跳转到支付成功页面
        $state.go('root.paySuccess', {
          orderId: error.data.order.userId,
          userId: error.data.order.orderId
        });
        orderManager.deleteOrder();
      } else if (error.code == 'none') {
        alert(error.msg);
      } else {
        alert(error.msg);
        //跳转到支付失败页面
        $state.go('root.payFail', {
          orderId: error.data.order.userId,
          userId: error.data.order.orderId
        });
        orderManager.deleteOrder();
      }
    };

  }
]);

angular.module('xiaomaiApp').factory('orderSubmitManager', [
  'xiaomaiMessageNotify',
  'orderManager',
  'addrMananger',
  'xiaomaiService',
  '$q',
  'cookie_openid',
  function(xiaomaiMessageNotify, orderManager, addrMananger, xiaomaiService, $q, cookie_openid) {

    var requireParamList = {};
    var subLdcDeliveryType, subLdcDeliveryAddress, subOnlinePayType, subLdcDeliveryTime, subLdcRemark;
    var resetParam = function() {
      requireParamList = {
        openId: cookie_openid,
        userId: '',
        orderId: '',
        collegeId: '',
        receiverCollegeId: '',
        receiverName: '',
        receiverPhone: '',
        rdcDeliveryType: 0,
        rdcSelfPickUpAddress: '',
        rdcDeliveryAddress: '',
        rdcDeliveryBeginTime: '',
        rdcDeliveryEndTime: '',
        ldcDeliveryType: -1,
        ldcSelfPickUpAddress: '',
        ldcDeliveryAddress: '',
        ldcDeliveryBeginTime: '',
        ldcDeliveryEndTime: '',
        ldcRemark: '',
        onlinePayType: '',
        couponId: '',
        couponPay: '',
        firstSub: '',
        fullSub: ''
      };
    };
    var initConfirm = function() {
      resetParam();
      //获取用户userId/orderId/collegeId/rdcSelfPickUpAddress/ldcSelfPickUpAddress/fullSub
      //这些数据用户都不能选择 所以可以一次性获取
      $q.all([
        orderManager.getOrderInfo('order.userId'),
        orderManager.getOrderInfo('order.orderId'),
        orderManager.getOrderInfo('college.collegeId'),
        orderManager.getOrderInfo('college.rdcSelfPickUpAddress'),
        orderManager.getOrderInfo('college.ldcSelfPickUpAddress'),
        orderManager.getOrderInfo('order.fullSub')
      ]).then(function(reslist) {
        requireParamList = angular.extend(requireParamList, {
          userId: '' + reslist[0],
          orderId: '' + reslist[1],
          collegeId: '' + reslist[2],
          rdcSelfPickUpAddress: reslist[3],
          ldcSelfPickUpAddress: reslist[4],
          fullSub: reslist[5]
        });
      });


      //获取收货地址信息
      addrMananger.getAddr().then(function(addrInfo) {
        requireParamList = angular.extend(requireParamList, {
          receiverCollegeId: '' + addrInfo.receiverCollegeId,
          receiverName: addrInfo.receiverName,
          receiverPhone: addrInfo.receiverPhone
        });
      });

      //监听LDC订单的配送方式
      subLdcDeliveryType = xiaomaiMessageNotify.sub('updateLdcDeliveryType', function(type) {
        requireParamList = angular.extend(requireParamList, {
          ldcDeliveryType: type
        });
      });

      //监听用户选择的LDC派送地址
      subLdcDeliveryAddress = xiaomaiMessageNotify.sub('updateLdcDeliveryAddress', function(address) {
        requireParamList = angular.extend(requireParamList, {
          ldcDeliveryAddress: address
        });
      });

      //监听LDC送货时间
      subLdcDeliveryTime = xiaomaiMessageNotify.sub('updateLdcDeliveryTime', function(timeObj) {
        requireParamList = angular.extend(requireParamList, timeObj);
      });

      //获取用户优惠劵信息
      subCouponupdateId = xiaomaiMessageNotify.sub('updateOrderCouponInfo', function(couponInfo) {
        switch (couponInfo.couponType) {
          case 'none':
            requireParamList = angular.extend(requireParamList, {
              couponId: "",
              couponPay: 0,
              firstSub: 0,
            });
            break;
          case 'firstsub':
            requireParamList = angular.extend(requireParamList, {
              couponId: "",
              couponPay: 0,
              firstSub: couponInfo.firstsub,
            });
            break;
          case 'othercoupon':
            requireParamList = angular.extend(requireParamList, {
              couponId: "" + couponInfo.coupon.couponId,
              couponPay: couponInfo.coupon.money,
              firstSub: 0
            });
            break;
          default:
            break;
        }
      });

      //监听获取用户的付款方式
      subOnlinePayType = xiaomaiMessageNotify.sub('updateOnlinePayType', function(type) {
        requireParamList = angular.extend(requireParamList, {
          onlinePayType: type
        });
      });

      subLdcRemark = xiaomaiMessageNotify.sub('updateLdcRemark', function(remark) {
        remark = remark.replace(/[\s\n\r]+/gm, ',').replace(/^\s+|\s+$/gm, '');
        if (remark.indexOf('script') != -1) {
          return false;
        }
        requireParamList = angular.extend(requireParamList, {
          ldcRemark: remark
        });
      });

    };

    //删除所有监听
    var destroyConfirm = function() {
      xiaomaiMessageNotify.removeOne('updateLdcDeliveryType', subLdcDeliveryAddress);
      xiaomaiMessageNotify.removeOne('updateOrderCouponInfo', subCouponupdateId);
      xiaomaiMessageNotify.removeOne('updateLdcDeliveryAddress', subLdcDeliveryAddress);
      xiaomaiMessageNotify.removeOne('updateOnlinePayType', subOnlinePayType);
      xiaomaiMessageNotify.removeOne('updateLdcDeliveryTime', subLdcDeliveryTime);
      xiaomaiMessageNotify.removeOne('updateLdcRemark', subLdcRemark);
    };

    //执行confirm
    var doConfirm = function() {
      var deferred = $q.defer();

      if (!requireParamList.receiverName || !requireParamList.receiverName.length) {
        deferred.reject({
          code: 'none',
          msg: '请完善收货人信息'
        });
        return deferred.promise;
      }

      xiaomaiService.save('confirmOrder', requireParamList, true).then(function(res) {
        deferred.resolve(res);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    return {
      initConfirm: initConfirm,
      doConfirm: doConfirm,
      destroyConfirm: destroyConfirm
    }

  }
]);
