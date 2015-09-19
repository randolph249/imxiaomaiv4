angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function($scope, $state, xiaomaiService, schoolManager) {
    var collegeId;
    schoolManager.get().then(function(schoolInfo) {
      collegeId = schoolInfo.collegeId;
      return xiaomaiService.fetchOne('categoryGoods', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.categorys = res;

      console.log(res);
    });

    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      })
    }
  }
])
