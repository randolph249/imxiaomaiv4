angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  function($state, $scope, xiaomaiService, cartManager) {

    cartManager.query(function(res) {
      $scope.totalCount = res.totalCount;
      $scope.totalPrice = res.totalPrice;

      //因为购物车信息请求过一次之后 任何操作都会更新购物车数据
      //所以可以缓存购物车信息
      cartManager.store({
        totalCount: $scope.totalCount,
        totalPrice: $scope.totalPrice
      });
    });

    //打开详情页面
    $scope.gotoDetail = function() {
      if (!$scope.totalCount || $scope.totalCount == 0 || $state.params.showCart ==
        'true') {
        return false;
      }


      //购物车详情和详情页面默认只有一个可以显示
      $state.go($state.current.name, {
        showCart: true,
        showDetail: false
      });
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
  'cartDetailGuiMananger',
  'cookie_openid',
  'buyProcessManager',
  function($state, $scope, xiaomaiService,
    cartDetailGuiMananger, cookie_openid, buyProcessManager) {

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      if (toParam.showCart == 'true') {
        loadDetail().then(function(res) {
          $scope.goods = res['goods'];
          $scope.ldcFreight = res['ldcFreight'];
          return loadCouponCount();
        }).then(function(coupons) {
          $scope.coupons = coupons.couponInfo;
          return false;
        }).then(function() {
          cartDetailGuiMananger.pub('show');
        });
      } else if (toParam.showCart == 'false') {
        cartDetailGuiMananger.pub('hide');
      }
    });

    //继续购物
    $scope.continueShop = function() {
      $state.go($state.current.name, {
        showCart: false,
        r: (+new Date)
      });
    };


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

      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function(
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
