angular.module('xiaomaiApp').directive('xiaomaiGoodListItem', [
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  'buyProcessManager',
  function(xiaomaiMessageNotify, xiaomaiLog, buyProcessManager) {
    var link = function($scope, iElm, iAttrs) {
      //打开详情页面
      var clickEvent = iAttrs.clickEvent;
      var sourceEvent = iAttrs.sourceEvent;
      var detailSourceEvent = iAttrs.detailSourceEvent;

      $scope.gotoDetail = function($event, good) {

        var goodId = good.sourceType == 2 ? good.activityGoodsId :
          good.goodsId;
        xiaomaiMessageNotify.pub('detailGuiManager', 'show', goodId,
          good.sourceType, detailSourceEvent);

        $event.preventDefault();
        $event.stopPropagation();

      };
      //购买按钮点击处理
      //如果是聚合类产品 打开购买链接
      //如果是非聚合类产品 执行购买流程
      $scope.buyHandler = function($event) {
        //点击购买日志统计
        xiaomaiLog(clickEvent);

        if ($scope.goods.goodsType == 3) {
          $scope.gotoDetail($event, $scope.goods);
          $event.stopPropagation();
          return false;
        }
        $scope.goods['isPaying'] = true;

        var options = $scope.goods.sourceType == 2 ? {
          goodsId: $scope.goods.activityGoodsId,
          sourceType: 2,
          skuId: $scope.goods.skuList[0].activitySkuId,
          distributeType: $scope.goods.skuList[0].distributeType,
          price: $scope.goods.skuList[0].activityPrice,
          propertyIds: ''
        } : {
          goodsId: $scope.goods.goodsId,
          sourceType: $scope.goods.sourceType,
          skuId: $scope.goods.skuList[0].skuId,
          distributeType: $scope.goods.skuList[0].distributeType,
          price: $scope.goods.skuList[0].wapPrice,
          propertyIds: ''
        };

        var maxNum = Math.min($scope.goods.maxNum, $scope.goods.skuList[
          0].stock);


        buyProcessManager(options, 'plus', maxNum).then(
          function() {
            //购物车来源统计
            xiaomaiLog(sourceEvent);
          },
          function(msg) {
            alert(msg);
          }).finally(function() {
          $scope.goods.isPaying = false;
        });
        $event.stopPropagation();
      };
    };
    return {
      link: link,
      scope: {
        goods: '=',
        column: '@'
      },
      templateUrl: '../assets/views/goodListItem/goodListItem.html',
      replace: true
    }
  }
]);

angular.module('xiaomaiApp').directive('xiaomaiGoodListItemSk', [
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  'buyProcessManager',
  'cartManager',
  function(xiaomaiMessageNotify, xiaomaiLog, buyProcessManager, cartManager) {
    var link = function($scope, iElm, iAttrs) {
      //打开详情页面
      $scope.gotoDetail = function($event) {
        xiaomaiMessageNotify.pub('detailGuiManager', 'show', $scope.goods
          .activityGoodsId,
          $scope.goods.sourceType, 'active+' + $scope.goods.activityId
        );
        $event.preventDefault();
        $event.stopPropagation();

      };

      //监听goods数据 然后查询购物车是否有对应商品
      var goodswatcher = $scope.$watch('goods', function() {
        if (!$scope.goods || !angular.isObject($scope.goods)) {
          return false;
        }
        //销毁监听
        goodswatcher();
        cartManager.getnumInCart($scope.goods.skuList[0].activitySkuId,
          $scope
          .goods.sourceType).then(function(num) {
          num == 1 && ($scope.goods.killed = true);
        });
      });


      $scope.buyHandler = function($event) {

        $event.preventDefault();
        $event.stopPropagation();

        //日志：抢点击次数
        xiaomaiLog('m_b_31singleactivitypanicbuy+' + $scope.goods.activityId);

        var goods = $scope.goods,
          activityId = goods.activityId;

        $scope.goods.isPaying = true;
        buyProcessManager({
          goodsId: goods.activityGoodsId,
          sourceType: 2,
          distributeType: goods.skuList[0].distributeType,
          skuId: goods.skuList[0].activitySkuId,
          price: goods.skuList[0].activityPrice,
          propertyIds: ''
        }, 'plus', Math.min(goods.maxNum, goods.skuList[0].stock)).then(
          function() {
            //购物车来源统计
            xiaomaiLog('m_r_31cartfromactive+' + activityId);

            alert('赶快去下单吧\n否则可能会被其他人抢走了哦');
            $scope.goods.killed = true;

          },
          function(msg) {
            alert(msg);
            return false;
          }).finally(function() {
          $scope.goods.isPaying = false;
        });
      };


      //截止时间提示
      $scope.timecountdown = function() {
        //如果是活动开始了
        if ($scope.goods['killStarted'] === 0) {
          //修改活动状态
          $scope.goods['killStarted'] = 1;
          //修改距离开始时间
          $scope.goods['beginTime'] = -1;
          //截止时间到期了
        } else if ($scope.goods['killStarted'] ===
          1) {
          $scope.goods['killStarted'] = 2;
          $scope.goods['buyLeftTime'] = -1;
        }
      }
    };

    return {
      link: link,
      scope: {
        goods: '='
      },
      templateUrl: '../assets/views/goodListItem/goodListItemSk.html',
      replace: true
    }
  }
]);
