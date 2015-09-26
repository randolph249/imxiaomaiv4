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

      //200ms之后把hasChange重置成false hasChange可以一直变化 来表示动画效果
      $scope.hasChange && $timeout(function() {
        $scope.hasChange = false;
      }, 200);
    });

    //自己也监听购物车详情的变化
    xiaomaiMessageNotify.sub('cartGuiManager', function(status) {
      $scope.isShowCart = status == 'show';
    });

    xiaomaiMessageNotify.sub('detailGuiManager', function(status) {
      $scope.isShowDetail = status == 'show';
    })

    //打开详情页面
    $scope.gotoDetail = function() {


      // debugger;

      if (!$scope.totalCount || $scope.totalCount == 0) {
        return false;
      }
      xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
      xiaomaiMessageNotify.pub('cartGuiManager', 'show');
    };

    //页面销毁之前销毁购物车信息
    //大开页面的时候 重新请求购物车信息
    $scope.$on('$destroy', function() {
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
  'cartManager',
  function($state, $scope, xiaomaiService, cookie_openid, buyProcessManager,
    xiaomaiMessageNotify, cartManager) {


    //显示或者隐藏购物车
    var cartDetailSubId = xiaomaiMessageNotify.sub('cartGuiManager',
      function(status) {


        if (status == 'show') {
          //获取购物车详情
          loadDetail().then(function(res) {
            $scope.goods = res['goods'];
            $scope.ldcFreight = res['ldcFreight'];
            $scope.haserror = false;
            return res;
          }, function() {
            $scope.haserror = true;
            return loadCouponCount();

          }).then(function(coupons) {
            //获取优惠劵
            $scope.coupons = coupons.couponInfo;
          });
        };

        $scope.showcart = status == 'show' ? true : false;
        //通知遮罩层做掉对应的
        xiaomaiMessageNotify.pub('maskManager', status);
      });

    $scope.$on('destory', function() {
      xiaomaiMessageNotify.removeOne('cartGuiManager', cartDetailSubId);
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

    //返回购物车详情
    var loadDetail = function() {
      return cartManager.queryCartDetail();
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


      $scope.isPaying = true;

      buyProcessManager(options, type, good.maxNum, good.skuList[0].numInCart)
        .then(function(
          numInCart) {
          good.skuList[0]['numInCart'] = numInCart;
          //如果这个数据的numInCart==0 删除这条数据
          if (good.skuList[0]['numInCart'] == 0) {
            $scope.goods.splice($index, 1);
          }
        }, function(msg) {
          alert(msg);
        }).then(function() {
          $scope.isPaying = false;
        });

    };
  }
]);
