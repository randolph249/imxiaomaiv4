angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  '$timeout',
  function($state, $scope, xiaomaiService, cartManager, $timeout) {

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


    $scope.isShowCart = $state.params.showCart == 'true';
    $scope.isShowDetail = $state.params.showDetail == 'true';

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
          cartDetailGuiMananger.pub('show'); //展开购物车

          $scope.haserror = false;

          return loadCouponCount();
        }, function() {
          $scope.haserror = true;
        }).then(function(coupons) {

          $scope.coupons = coupons.couponInfo;

          return false;
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
