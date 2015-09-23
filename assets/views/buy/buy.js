angular.module('xiaomaiApp').controller('buyCtrl', [
  '$state',
  '$scope',
  'schoolManager',
  '$q',
  function($state, $scope, schoolManager, $q) {
<<<<<<< HEAD
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


=======
    var collegeId;
    //在这里拦截用户请求
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      console.log('router info');

      //如果collegeId存在的话 就不做任何处理
      if (collegeId) {
        return false;
      }

      schoolManager.get().then(function(schoolInfo) {
        collegeId = schoolInfo.collegeId;
      }, function() {
        alert('请选择所在学校!');
        $state.go('root.locate');
      });

    });
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
  }
]);
