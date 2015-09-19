angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  function($state, xiaomaiService, $scope) {
    var collegeId, categoryId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;

      loadGoodList();
    });

    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId
      }).then(function(res) {
        console.log(res.goods);
        $scope.goods = res.goods;
      })
    }
  }
])
