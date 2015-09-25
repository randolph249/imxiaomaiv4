angular.module('xiaomaiApp').controller('nav.allCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'destoryDataManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, schoolManager,
    destoryDataManager, xiaomaiMessageNotify) {

    $scope.activities = [];

    //先获取当前学校信息
    //学校ID
    var collegeId;

    $scope.isloading = true;
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      //根据学校信息获取当前活动列表
      return xiaomaiService.fetchOne('activities', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.haserror = false;
      $scope.activities = res.activities;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'down', 'ready',
        '');
    });

    //缓存当前页面数据
    var destoryRouter;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      destoryRouter = toState.name + angular.toJson(toParam);
    });

    $scope.$on('$destory', function() {
      destoryDataManager.write(
        destoryRouter, 'activities', {
          activities: $scope.activities
        });
    });


    //链接跳转
    $scope.goto = function(active) {
      var tostate = '';
      switch (active.activityType) {
        case 1:
          tostate = 'root.buy.active';
          break;
        default:
          tostate = 'root.buy.skactive';
          break;
      }
      //跳转到对应的活动页面
      $state.go(tostate, {
        //编译活动名会不会导致活动名过长
        collegeId: collegeId,
        activityId: active.activityId
      });
    }
  }
]);
