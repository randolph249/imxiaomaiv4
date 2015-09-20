angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  'detailManager',
  function($state, xiaomaiService, $scope, detailManager) {
    var collegeId, categoryId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;

      loadGoodList();
    });

    //下载商品列表
    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId
      }).then(function(res) {
        console.log(res.goods);
        $scope.goods = res.goods;
      })
    }

    //打开详情页面
    $scope.goto = function(good) {
      detailManager.gotoDetail({
        goodId: good.bgGoodsId,
        sourceType: good.sourceType
      })
    }
  }
])
