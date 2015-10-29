angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  '$timeout',
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  'cookie_openid',
  'orderManager',
  function($state, $scope, xiaomaiService, cartManager, $timeout,
    xiaomaiMessageNotify, xiaomaiLog, cookie_openid, orderManager) {

    //查询购物车信息
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
    });

    var getRefer = function() {
      var statename = $state.current.name;
      var namereg =
        /root\.buy(\.nav)?\.(\w+)/;
      var refer = "";
      switch (statename.match(namereg)[2]) {
        case 'all':
          refer = 'homepage';
          break;
        case 'category':
          refer = 'category+' + $state.params.categoryId;
          break;
        case 'active':
          refer = 'active+' + $state.params.activityId;
          break;
        default:
          refer = statename.match(namereg)[2];
          break;
      }
      return refer;
    };

    //跳转到结算界面
    $scope.lockSettle = false;
    $scope.goSettlement = function($event) {
      $event.stopPropagation();
      $event.preventDefault();

      //防止重复点击
      if ($scope.lockSettle) {
        return false;
      }
      $scope.lockSettle = true;
      //点击结算按钮的统计
      xiaomaiLog('m_b_31shoppingsettle');

      //创建订单
      orderManager.createOrder().then(function(res) {
        //创建订单成功
        var refer = getRefer();
        $state.go('root.confirmorder', {
          r: refer
        });
      }, function(error) {
        //创建订单失败
        /**
         *code状态:
         *-1 商品缺货
         *1 购物车异常
         *2用户没有绑定（新用户）
         *3购物车被清空
         **/
        switch (error.code) {
          case -1:
            stockoutHanlder(error.data.items);
            break;
          case 1:
            alert(error.msg);
            break;
          case 2:
            initUser();
            break;
          case 3:
            alert(error.msg);
            break;
          default:
            break;

        }
      }).finally(function() {
        //解锁
        $scope.lockSettle = false;
      });


      return false;
    };

    //绑定用户信息
    //将跳转到微信授权认证页面
    var initUser = function() {
      xiaomaiService.fetchOne('userAuth');
    };

    //缺货情况处理
    var stockoutHanlder = function(stockoutGoods) {
      var alertMsgs = ['很遗憾，由于商品缺货，创建订单失败:'];
      angular.forEach(stockoutGoods, function(goods) {
        angular.forEach(goods.goodsList, function(good) {
          alertMsgs.push(good.goodsName);
        });
        alertMsgs.push(goods.title);
      });
      alert(alertMsgs.join('\n'));

      //更新购物车数据
      cartManager.update();
      //给购物车详情发送通知
      xiaomaiMessageNotify.pub('createOrderFail', stockoutGoods);
    };

    //打开详情页面
    $scope.gotoDetail = function() {
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
]);
