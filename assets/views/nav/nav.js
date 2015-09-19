/**
 *左侧导航
 **/
angular.module('xiaomaiApp').controller('navCtrl', ['$scope', '$state',
  function($scope, $state) {

  }
]);

/**
 *头部
 **/
angular.module('xiaomaiApp').controller('nav.headCtrl', [
  '$scope',
  '$state',
  'schoolManager',
  function($scope, $state, schoolManager) {
    //获取用户当前定位学校
    $scope.schoolname = '未选择所在学校';
    schoolManager.get().then(function(res) {
      $scope.schoolname = res.collegeName;
    })


  }
]);

angular.module('xiaomaiApp').controller('nav.listCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function($scope, $state, xiaomaiService, schoolManager) {

    $scope.navs = [];
    //获取导航栏
    xiaomaiService.fetchOne('navgatorlist', true).then(function(res) {
      $scope.navs = res.navigateItems;
    });

    $scope.paths = {
      '0': 'root.buy.nav.all',
      '1': 'root.buy.nav.recommend',
      '2': 'root.buy.active',
      '3': 'root.buy.skactive',
      '4': 'root.buy.nav.category'
    };

    //监听当前路径变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      $scope.type = toParam.type;
      var reg = /nav\.(\w+)/;


      var curpaths = toState.name.match(reg);
      $scope.curcategoryId = toParam.categoryId;
      $scope.activityId = toParam.activityId;
      // debugger;
      if (curpaths && curpaths.length) {
        $scope.curpath = curpaths[1];
      }

    });

    $scope.goto = function(routerInfo) {
      schoolManager.get().then(function(res) {
        var collegeId = res.collegeId;

        //跳转到对应的链接上
        $state.go($scope.paths[routerInfo.displayType], {
          categoryId: routerInfo.categoryId,
          activityId: routerInfo.activityId,
          collegeId: collegeId,
          activeName: encodeURIComponent(routerInfo.navigateName)
        });
      });


    }

  }
]);
