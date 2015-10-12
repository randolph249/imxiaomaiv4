/**
 *搜索结果页面
 **/
angular.module('xiaomaiApp').controller('searchresultCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, schoolManager,
    searchresultheightupdate) {
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.searchkey = decodeURIComponent(toParam.key);
      $scope.isloading = true;
      loadSku(toParam.key);
    });

    $scope.gohomepage = function($event) {
      $state.go('root.buy.nav.all');
      $event.preventDefault();
      $event.stopPropagation();
    };

    //跳转到搜索
    $scope.gotosearch = function($event) {
      $state.go('root.search');
      $event.preventDefault();
      $event.stopPropagation();
    };

    //加载搜索结果
    var loadSku = function(key) {
      $scope.isloading = true;
      var collegeId;
      schoolManager.get().then(function(res) {
        collegeId = res.collegeId;
        return xiaomaiService.fetchOne('searchresult', {
          collegeId: collegeId,
          key: key,
          currentPage: 1
        });
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = !$scope.goods || !$scope.goods.length;
      }, function() {
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;
      });
    };


  }
]);
