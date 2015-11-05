angular.module('xiaomaiApp').controller('wechartprepayCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  '$timeout',
  'safeApply',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiMessageNotify, $timeout, safeApply) {
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
    var payInfo = xiaomaiCacheManager.readCache('prepayData');
    xiaomaiCacheManager.clean('prepayData');

    //发起支付信息
    var triggerPay = function() {
      $scope.lock = true;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": payInfo.appId,
          "timeStamp": payInfo.timeStamp,
          "signType": payInfo.signType,
          "package": payInfo.packageStr,
          "nonceStr": payInfo.nonceStr,
          "paySign": payInfo.paySign
        },
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
      safeApply(function() {
        $scope.lock = false;
      })
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
]);
