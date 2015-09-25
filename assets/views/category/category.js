angular.module('xiaomaiApp').controller('Controller', function($scope) {

});



angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  'xiaomaiCacheManager',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  function($state, xiaomaiService, $scope,
    xiaomaiCacheManager, buyProcessManager, xiaomaiMessageNotify) {
    var collegeId, categoryId;

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;

      loadGoodList();
    });

    //下载商品列表
    $scope.isloading = true;
    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.haserror = false;

      }, function(msg) {
        $scope.errorip = msg;
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;
      });
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {

      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType);

      return false;
    };

    $scope.buyHandler = function(good) {

      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      buyProcessManager({
        goodsId: good.goodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
      });

    }
  }
]);
