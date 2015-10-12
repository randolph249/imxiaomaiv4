angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'buyProcessManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, buyProcessManager,
    xiaomaiLog) {

    //推荐页面LOG统计
    xiaomaiLog('m_p_31tabrecommendation');
    var collegeId;

    $scope.isloading = true;
    var preRouter, nextRouter;

    //获取学校ID 根据学校ID 获取推荐类目
    schoolManager.get().then(function(schoolInfo) {
      collegeId = schoolInfo.collegeId;
      return xiaomaiService.fetchOne('categoryGoods', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.categorys = res;
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function(flag) {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up',
        'ready', '', '');
    });

    $scope.$on('$destroy', function() {
      //保存页面数据
      xiaomaiCacheManager.writeCache('categoryGoods', $scope.categorys);
      //删除订阅
    });

    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      });

      xiaomaiLog('m_b_31homepagetabrecmore');
    };
  }
]);
