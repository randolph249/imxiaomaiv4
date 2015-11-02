//购物车详情页面
angular.module('xiaomaiApp').controller('buy.cartDetailCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cookie_openid',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  'cartManager',
  'env',
  'xiaomaiCacheManager',
  'xiaomaiLog',
  function($state, $scope, xiaomaiService, cookie_openid, buyProcessManager,
    xiaomaiMessageNotify, cartManager, env, xiaomaiCacheManager, xiaomaiLog
  ) {


    //创建一个监听,如果因为商品缺货导致创建订单失败 删除订单中的缺货商品
    var subCreateOrderId = xiaomaiMessageNotify.sub('createOrderFail', function(stockoutGoods) {
      var skuIds = [];
      angular.forEach(stockoutGoods, function(goods) {
        angular.forEach(goods.goodsList, function(good) {
          skuIds.push(good.skuId);
        });
      });
      deleteStockoutGoods(skuIds);
    });


    //删除缺货商品
    var deleteStockoutGoods = function(skuIds) {
      var newGoods = [];
      angular.forEach($scope.goods, function(good, $index) {
        var skuId = good.sourceType == 1 ? good.skuList[0].skuId : good.skuList[0].activitySkuId;
        var reg = new RegExp("(," + skuId + ")|(" + skuId + ",)");
        if (!reg.test(skuIds.join(','))) {
          newGoods.push(good);
        }
      });
      $scope.goods = newGoods;
    };

    //查询购物车详情信息
    var queryDetail = function() {
      $scope.isloading = true;
      return cartManager.queryCartDetail().then(function(res) {
        $scope.goods = res['goods'];
        $scope.ldcFreight = res['ldcFreight'];
        $scope.haserror = false;
        return res;
      }, function() {
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;
      })
    };

    //查询优惠劵
    var queryCoupon = function() {
      return xiaomaiService.fetchOne('mycoupon', {
        openId: cookie_openid,
        type: 1
      }).then(function(coupons) {
        //缓存购物车信息
        xiaomaiCacheManager.writeCache('mycoupon', coupons);
        //不可用优惠劵过滤
        var availableCoupons = [];
        angular.forEach(coupons.couponInfo, function(item) {
          item.status === 0 && (availableCoupons.push(
            availableCoupons));
        });
        $scope.coupons = availableCoupons;
      })
    };

    //显示或者隐藏购物车
    var cartDetailSubId = xiaomaiMessageNotify.sub('cartGuiManager',
      function(status) {
        if (status == 'show') {
          //购物车PV统计
          xiaomaiLog('m_p_31shoppingcart');
          //查询购物车详情
          queryDetail();
          //查询优惠劵信息
          queryCoupon();
          //展开购物车
          setTimeout(function() {
            //因为 购物车弹起有延时效果（0.5S） 所以通知必须在购物车动画播放结束以后再放
            xiaomaiMessageNotify.pub(
              'shopcartdetailheightupdate',
              'up', 'ready', '', '');
          }, 600);

        };

        $scope.showcart = status == 'show' ? true : false;
        //通知遮罩层做掉对应的
        xiaomaiMessageNotify.pub('maskManager', status);
      });

    //$scope销毁时候 删除订阅
    $scope.$on('destory', function() {
      xiaomaiMessageNotify.removeOne('cartGuiManager', cartDetailSubId);
      xiaomaiMessageNotify.removeOne('createOrderFail', subCreateOrderId);
    });


    //跳转到优惠劵
    $scope.gotoCoupon = function() {
      //优惠劵点击次数统计
      xiaomaiLog('m_b_31shoppingcartcoupons');
      var host = env == 'online' ? 'http://h5.imxiaomai.com' :
        'http://wap.tmall.imxiaomai.com';
      window.location.href = host + '/couponwap/myCouponList/webwiew';
      return false;
    };

    //继续购物
    $scope.continueShop = function($event) {
      xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
      $event.preventDefault();
      //继续购物点击次数统计
      xiaomaiLog('m_b_31shoppingcartclose');
    };


    //执行购买操作
    $scope.buyHandler = function($event, type, $index) {
      //点击+/-日志统计次数
      xiaomaiLog(type == 'plus' ? 'm_b_31shoppingcartadd' :
        'm_b_31shoppingcartless');

      var good = $scope.goods[$index],
        sourceType = good.sourceType,
        skuInfo = good.skuList[0],
        options = sourceType == 2 ? {
          goodsId: good.activityGoodsId,
          sourceType: 2,
          skuId: skuInfo.activitySkuId,
          distributeType: skuInfo.distributeType,
          price: skuInfo.activityPrice,
          propertyIds: skuInfo.skuPropertyValueIdList || '',
        } : {
          goodsId: good.goodsId,
          sourceType: good.sourceType,
          distributeType: skuInfo.distributeType,
          skuId: skuInfo.skuId,
          price: skuInfo.wapPrice,
          propertyIds: skuInfo.skuPropertyValueIdList || '',
        };

      var good = $scope.goods[$index];

      $scope.goods[$index].isPaying = true;
      buyProcessManager(options, type, Math.min(good.maxNum, good.skuList[
          0].stock), good.skuList[0].numInCart)
        .then(function(
          numInCart) {

          //购物车来源统计
          type == 'plus' && xiaomaiLog('m_r_31cartfromcart');

          good.skuList[0]['numInCart'] = numInCart;
          //如果这个数据的numInCart==0 删除这条数据
          if (good.skuList[0]['numInCart'] == 0) {
            $scope.goods.splice($index, 1);
            xiaomaiMessageNotify.pub('shopcartdetailheightupdate',
              'up', 'ready', '', '');
          }

        }, function(msg) {
          alert(msg);
        }).finally(function() {
          $scope.goods[$index] && ($scope.goods[$index].isPaying =
            false);
        });
      $event.stopPropagation();
      $event.preventDefault();
    };
  }
]);
