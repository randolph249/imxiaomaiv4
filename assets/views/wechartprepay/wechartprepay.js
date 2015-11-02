angular.module('xiaomaiApp').controller('wechartprepayCtrl', [
<<<<<<< HEAD
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
            $scope.bindClickForShowInfo = function(d){
                var host = env == 'online' ? 'http://h5.imxiaomai.com' :
                'http://wap.tmall.imxiaomai.com';
                window.location.href = host + '/deliveryDetail?orderId='+d;
                return false;
            }
        }, function() {}).finally(function() {});


    }
=======
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  '$timeout',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager, $timeout, xiaomaiMessageNotify) {
    //支付按钮禁止点击
    $scope.lock = true;
    //5S之后默认支付失败
    var $t = $timeout(function() {
      $scope.lock = false;
    }, 5000);

    var userId = $state.params.userId;
    var orderId = $state.params.orderId;
    xiaomaiService.fetchOne('queryOrder', {
      userId: userId,
      orderId: orderId
    }).then(function(res) {
      $scope.order = res.order;

    }).finally(function() {
      xiaomaiMessageNotify.pub('', 'up', 'ready', '', '');
      xiaomaiMessageNotify.pub('wechartPayHeightUpdate', 'up', 'ready', '', '');
    });

    //获取信息
    var payInfo = {
      appId: "wx35a8b3f8507f4ea6",
      nonceStr: "0df78f24264710c58e81a19d14d3e291",
      package: "prepay_id=wx20150728162842faa93b7e240385154146",
      paySign: "40A8D9BE6C7F52A8909FA6D9562627B4",
      signType: "MD5",
      timeStamp: "1438072122",
    };
    // var payInfo = xiaomaiCacheManager.readCache('prepayData');

    //发起支付信息
    var triggerPay = function() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', payInfo,
        function(res) {
          //删除默认支付失败
          $timeout.cancel($t);
          //微信支付成功
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            paySuccessedHandler();
          } else {
            payFailedHandler();
          }
        })
    };

    //微信支付成功之后处理
    var paySuccessedHandler = function() {
      xiaomaiService.fetchOne('payStatusCheck').then(function(res) {
        //跳转到支付成功页面
        $state.go('root.paySuccess', {
          userId: userId,
          orderId: orderId
        });
      }, function() {
        //跳转到支付失败页面
        $state.go('root.payFail', {
          userId: userId,
          orderId: orderId
        });
      }).finally(function() {
        $scope.lock = false;
      })
    };

    //微信支付失败处理
    var payFailedHandler = function() {
      alert('支付失败,再试一次!');
      $scope.lock = false;
    };

    //兼容浏览器的支付信息
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', triggerPay, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', triggerPay);
        document.attachEvent('onWeixinJSBridgeReady', triggerPay);
      }
    } else {
      triggerPay();
    }

    //手动点击去支付
    $scope.toPay = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      if ($scope.lock) {
        return false;
      }
      $scope.lock = true;
      triggerPay();
    };
  }
>>>>>>> b4a0b90bf99b308d4d3902a190d9a7be66f1dc18
]);
