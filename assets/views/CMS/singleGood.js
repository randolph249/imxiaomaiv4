angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'wxshare',
  'getRouterTypeFromUrl',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify,
    getRouterTypeFromUrl, xiaomaiLog) {
    var collegeId, activityId;
    
    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('singleGoods', {
        collegeId: collegeId,
        activityId: activityId
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;

    $scope.activityId = activityId;

    //初始化数据请求
    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.headerImageUrls = res.headerImageUrl;
      $scope.goods = res.goods;
      $scope.status = res.status;
      $scope.mainImageUrls = res.mainImageUrl;
      $scope.activityRule = res.activityRule.split("\r\n");
      $scope.hasRule = res.activityRule.length ? true : false;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
    });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate',
        iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId)
    });

  }
]);


