/**
 *左侧导航
 **/
angular.module('xiaomaiApp').controller('categoryCtrl', ['$scope', '$state',
  function($scope, $state) {

  }
]);

/**
 *头部
 **/
angular.module('xiaomaiApp').controller('category.headCtrl', [
  '$scope',
  '$state',
  'schoolManager',
  function($scope, $state, schoolManager) {
    //获取用户当前定位学校
    return false;
    $scope.schoolname = '未选择所在学校';
    schoolManager.get().then(function(res) {
      $scope.schoolname = res.collegeName;
    }, function() {
      alert('请选择所在学校!');
      $state.go('root.locate');
    })


  }
]);

angular.module('xiaomaiApp').controller('category.listCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  function($scope, $state, xiaomaiService) {

    $scope.navs = [];
    //获取导航栏
    xiaomaiService.fetchOne('categoryNav', true).then(function(res) {
      $scope.navs = res.nav;
    });

    //监听当前路径变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      $scope.type = toParam.type;
      var reg = /category\.(\w+)/;


      var curpaths = toState.name.match(reg);
      // debugger;
      if (curpaths && curpaths.length) {
        $scope.curpath = curpaths[1];
      }
    });

    $scope.goto = function(routerInfo) {
      if (routerInfo.kind !== 'all') {
        return false;
      }
      $state.go('root.buy.category.' + routerInfo.kind);
    }

  }
]);
