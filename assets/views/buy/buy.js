angular.module('xiaomaiApp').controller('buyCtrl', [
  '$state',
  '$scope',
  'schoolManager',
  '$q',
  function($state, $scope, schoolManager, $q) {
    //在这里拦截用户请求
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      //在这里请求用户学校信息
      schoolManager.get().then(function(schoolInfo) {
        if (toState.name == 'root.buy') {
          $state.go('root.buy.nav.all');
        }
      }, function() {
        $state.go('root.locate');
      });
    });

    //点击遮罩关闭所有图层
    $scope.closeMask = function() {
      $state.go($state.current.name, {
        showDetail: false,
        showCart: false
      });
    }


  }
]);
