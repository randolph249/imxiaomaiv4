angular.module('xiaomaiApp').controller('nav.allCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function($scope, $state, xiaomaiService, schoolManager) {

    $scope.activities = [];

    //先获取当前学校信息
    //学校ID
    var collegeId;
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      //根据学校信息获取当前活动列表
      return xiaomaiService.fetchOne('activities', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.activities = res.activities;
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
        activeName: encodeURIComponent(active.activityShowName),
        collegeId: collegeId,
        activityId: active.activityId
      });
    }
  }
]);
