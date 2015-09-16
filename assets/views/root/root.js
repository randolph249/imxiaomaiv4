angular.module('xiaomaiApp').controller('rootCtrl', [
  '$state',
  '$scope',
  function($state, $scope) {

  }
]);

/**
 *左侧导航
 **/
angular.module('xiaomaiApp').controller('catnavCtrl', [
  '$scope',
  'xiaomaiService',
  function($scope, xiaomaiService) {
    $scope.navs = [];
    //获取导航栏
    xiaomaiService.fetchOne('categoryNav', true).then(function(res) {
      $scope.navs = res.data;
    });
  }
]);
