angular.module('xiaomaiApp').controller('buyCtrl', [
  '$state',
  '$scope',
  'schoolManager',
  '$q',
  function($state, $scope, schoolManager, $q) {
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
  }
]);
