angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  '$timeout',
  'xiaomaiMessageNotify',
  function($state, $scope, xiaomaiService, cartManager, $timeout,
    xiaomaiMessageNotify) {

    cartManager.query(function(res) {

      $scope.totalCount = res.totalCount;
      $scope.totalPrice = res.totalPrice;

      //因为URL变化会触发query函数 所以要判断数量是否有真实变化
      var total = cartManager.readCartCache();
      $scope.hasChange = !total.totalCount || total.totalCount !=
        $scope.totalCount ? true :
        false;

      $scope.hasChange && $timeout(function() {
        $scope.hasChange = false;
      }, 200);

      //因为购物车信息请求过一次之后 任何操作都会更新购物车数据
      //所以可以缓存购物车信息

      cartManager.store({
        totalCount: $scope.totalCount,
        totalPrice: $scope.totalPrice
      });


    });

    //自己也监听购物车详情的变化
    xiaomaiMessageNotify.sub('cartGuiManager', function(status) {
      $scope.isShowDetail = status == 'show';
    });

    //打开详情页面
    $scope.gotoDetail = function() {
      if (!$scope.totalCount || $scope.totalCount == 0) {
        return false;
      }

      xiaomaiMessageNotify.pub('cartGuiManager', 'show');
    };

    //页面销毁之前销毁购物车信息
    $scope.$on('$destory', function() {
      cartManager.store(false);
    });

  }
])

//购物车详情页面
angular.module('xiaomaiApp').controller('buy.cartDetailCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cookie_openid',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  function($state, $scope, xiaomaiService, cookie_openid, buyProcessManager,
    xiaomaiMessageNotify) {

    xiaomaiMessageNotify.sub('cartGuiManager', function(status) {

      if (status == 'show') {
        loadDetail().then(function(res) {
          $scope.goods = res['goods'];
          $scope.ldcFreight = res['ldcFreight'];
          $scope.showcart = true;
          $scope.haserror = false;

          return loadCouponCount();
        }, function() {
          $scope.haserror = true;
        }).then(function(coupons) {

          $scope.coupons = coupons.couponInfo;

          return false;
        });
      } else {
        $scope.showcart = false;
      }

      xiaomaiMessageNotify.pub('maskManager', status);
    })

    //继续购物
    $scope.continueShop = function() {
      xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
    };


    $scope.goHomepage = function() {
      $state.go('root.buy.nav.all', {
        showCart: false
      });
    }

    var loadDetail = function() {
      return xiaomaiService.fetchOne('queryCartDetail', {});
    };

    //获取用户优惠劵数量
    var loadCouponCount = function() {
      return xiaomaiService.fetchOne('mycoupon', {
        openId: cookie_openid
      });
    };

    //执行购买操作
    $scope.buyHandler = function(type, $index) {

      var good = $scope.goods[$index],
        sourceType = good.sourceType,
        skuInfo = good.skuList[0],
        options = sourceType == 2 ? {
          goodsId: good.activityGoodsId,
          sourceType: 2,
          skuId: skuInfo.activitySkuId,
          distributeType: skuInfo.distributeType,
          price: skuInfo.activityPrice,
          propertyIds: ''
        } : {
          goodsId: good.goodsId,
          sourceType: good.sourceType,
          distributeType: skuInfo.distributeType,
          skuId: skuInfo.skuId,
          price: skuInfo.wapPrice,
          propertyIds: '',
        };

      var good = $scope.goods[$index];

      buyProcessManager(options, type, good.skuList[0].numInCart, good.maxNum)
        .then(function(
          numInCart) {
          good.skuList[0]['numInCart'] = numInCart;
          //如果这个数据的numInCart==0 删除这条数据
          if (good.skuList[0]['numInCart'] == 0) {
            $scope.goods.splice($index, 1);
          }
        }, function(msg) {
          alert(msg);
        });

    };
  }
]);
