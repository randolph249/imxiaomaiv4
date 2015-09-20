angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  'cartDetailManager',
  function($state, $scope, xiaomaiService, cartManager, cartDetailManager) {

    cartManager.query(function(res) {
      $scope.totalCount = res.totalCount;
      $scope.totalPrice = res.totalPrice;
    });

    //打开详情页面
    $scope.gotoDetail = function() {
      if (!$scope.totalCount || $scope.totalCount == 0) {
        return false;
      }
      cartDetailManager.gotoDetail();
    }

  }
])


angular.module('xiaomaiApp').controller('buy.cartDetailCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
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
    });

    //继续购物
    $scope.continueShop = function() {
      cartDetailGuiMananger.pub('hide');
    }


    var loadDetail = function() {
      return xiaomaiService.fetchOne('queryCartDetail', {});
    };


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
        //如果这个数据的numInCart==0 删除这条数据
        if (good.skuList[0]['numInCart'] == 0) {
          $scope.goods.splice($index, 1);
        }
      });

    };

  }
]);


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
