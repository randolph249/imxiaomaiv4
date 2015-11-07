angular.module('xiaomaiApp').directive('xiaomaiGoodItem', [
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  'buyProcessManager',
  function(xiaomaiMessageNotify, xiaomaiLog, buyProcessManager) {
    var link = function($scope, iElm, iAttrs) {
      //打开详情页面
      var clickEvent = iAttrs.clickEvent;
      var sourceEvent = iAttrs.sourceEvent;
      var detailSourceEvent = iAttrs.detailSourceEvent;


      //购买按钮点击处理
      //如果是聚合类产品 打开购买链接
      //如果是非聚合类产品 执行购买流程
      $scope.buyHandler = function($event) {
        //点击购买日志统计
        xiaomaiLog(clickEvent);

        if ($scope.goods.goodsType == 3) {
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
