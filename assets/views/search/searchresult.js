/**
 *搜索结果页面
 **/
angular.module('xiaomaiApp').controller('searchresultCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function($scope, $state, xiaomaiService, schoolManager) {
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.searchkey = decodeURIComponent(toParam.key);
      $scope.isloading = true;
      loadSku(toParam.key, toParam.page);
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
    var loadSku = function(key, page) {
      var collegeId;
      schoolManager.get().then(function(res) {
        collegeId = res.collegeId;
        return xiaomaiService.fetchOne('searchresult', {
          collegeId: collegeId,
          key: key,
          currentPage: page
        });
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
      });
      xiaomaiService.fetchOne('searchsuggest', {

      })
    };


  }
]);
