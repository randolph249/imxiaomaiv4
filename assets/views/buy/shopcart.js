angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
<<<<<<< HEAD
  function($state, $scope, xiaomaiService, cartManager) {
=======
  'cartDetailManager',
  function($state, $scope, xiaomaiService, cartManager, cartDetailManager) {
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3

    cartManager.query(function(res) {
      $scope.totalCount = res.totalCount;
      $scope.totalPrice = res.totalPrice;
<<<<<<< HEAD

      //因为购物车信息请求过一次之后 任何操作都会更新购物车数据
      //所以可以缓存购物车信息
      cartManager.store({
        totalCount: $scope.totalCount,
        totalPrice: $scope.totalPrice
      });
=======
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    });

    //打开详情页面
    $scope.gotoDetail = function() {
      if (!$scope.totalCount || $scope.totalCount == 0) {
        return false;
      }
<<<<<<< HEAD


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
=======
      cartDetailManager.gotoDetail();
    }
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3

  }
])

<<<<<<< HEAD
//购物车详情页面
=======

>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
angular.module('xiaomaiApp').controller('buy.cartDetailCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
<<<<<<< HEAD
  'cartDetailGuiMananger',
  'cookie_openid',
  'buyProcessManager',
  function($state, $scope, xiaomaiService,
    cartDetailGuiMananger, cookie_openid, buyProcessManager) {

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      if (toParam.showCart == 'true') {
        loadDetail().then(function(res) {
          $scope.goods = res['goods'];
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
=======
  'cartDetailManager',
  'cartDetailGuiMananger',
  'shopValidate',
  'cartManager',
  function($state, $scope, xiaomaiService, cartDetailManager,
    cartDetailGuiMananger, shopValidate, cartManager) {
    cartDetailManager.invokeDetail(function() {
      loadDetail().then(function(res) {
        $scope.goods = res['goods'];
        return loadCouponCount();
      }).then(function(coupons) {
        $scope.coupons = coupons.couponInfo;
        console.log(coupons)
        return true;
      }).then(function() {
        cartDetailGuiMananger.pub('show');
      })
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    });

    //继续购物
    $scope.continueShop = function() {
<<<<<<< HEAD
      $state.go($state.current.name, {
        showCart: false,
        r: (+new Date)
      });
    };
=======
      cartDetailGuiMananger.pub('hide');
    }
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3


    var loadDetail = function() {
      return xiaomaiService.fetchOne('queryCartDetail', {});
    };

<<<<<<< HEAD
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
=======

    //获取用户优惠劵数量
    var loadCouponCount = function() {
      return xiaomaiService.fetchOne('mycoupon', {
        openId: ''
      });
    };

    //添加或者删除
    $scope.buyHandler = function(type, $index) {


      var validlist = {},
        good = $scope.goods[$index];

      if (type == 'minus') {
        validlist['minCountVali'] = [good.skuList[0].numInCart];
      } else if (type == 'plus') {
        validlist['maxCountVali'] = [good.skuList[0].numInCart, good.maxNum];
      }

      //进行校验
      if (!shopValidate(validlist)) {
        return false;
      }


      var eventName = type == 'plus' ? 'add' : 'remove';
      cartManager[eventName]({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: ''
      }).then(function() {
        good.skuList[0]['numInCart'] += type == 'plus' ? (+1) : (-1);
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
        //如果这个数据的numInCart==0 删除这条数据
        if (good.skuList[0]['numInCart'] == 0) {
          $scope.goods.splice($index, 1);
        }
<<<<<<< HEAD
      }, function(msg) {
        alert(msg);
=======
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
      });

    };

  }
]);
<<<<<<< HEAD
=======


/**
 *调起购物车详情页面
 **/
angular.module('xiaomaiApp').factory('cartDetailManager', [
  function() {
    //请求吊起详情页面
    var callback;

    function gotoDetail(good) {
      callback && angular.isFunction(callback) && callback();
    };

    function invokeDetail(call) {
      //注册callback
      callback = call;
    };

    return {
      gotoDetail: gotoDetail,
      invokeDetail: invokeDetail
    }
  }
]);

/**
 *打开详情open/closedetail页面 open/close遮罩
 **/
angular.module('xiaomaiApp').factory("cartDetailGuiMananger", function() {
  var callback;
  //接受命令
  var sub = function(call) {
    callback = call;
  };
  //发送命令
  var pub = function(order) {

    if (!/show|hide/.test(order)) {
      console.log('只接受show和hide两个命令');
      return false;
    }
    callback && angular.isFunction(callback) && callback(order);
  };
  //传输指令&接受指令
  return {
    sub: sub,
    pub: pub,
  }

});


angular.module('xiaomaiApp').directive("cartDetailGui", [
  'cartDetailGuiMananger',
  'maskManager',
  function(cartDetailGuiMananger, maskManager) {
    var link = function($scope, ele, attrs) {

      var activeClass = attrs.activeClass;
      //根据命令显示或者隐藏
      cartDetailGuiMananger.sub(function(order) {

        //打开或者关闭遮罩
        maskManager.pub(order);
        ele[order == 'show' ? 'addClass' : 'removeClass'](activeClass);

      });
    };
    return {
      link: link
    }
  }
])
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
