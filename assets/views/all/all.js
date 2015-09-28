angular.module('xiaomaiApp').controller('nav.allCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiMessageNotify',
  'xiaomaiCacheManager',
  'siblingsNav',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiMessageNotify, xiaomaiCacheManager, siblingsNav) {

    $scope.activities = [];

    //先获取当前学校信息
    //学校ID
    var collegeId, nextRouter;

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
      return siblingsNav('down', collegeId, 0);
    }, function(msg) {
      debugger;
      $scope.haserror = true;
    }).then(function(router) {
      nextRouter = router;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up',
        'ready', '', nextRouter.text);
    });


    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {

        if (arrow == 'up') {
          //跳转到上一页
          siblingsNav('up', collegeId, 0).then(function(
            router) {
            $state.go(router.name, router.params);
          });
        } else {
          //跳转到下一页
          siblingsNav('down', collegeId, 0).then(function(
            router) {
            $state.go(router.name, router.params);
          });

        }

      });


    //缓存页面数据
    $scope.$on('$destory', function() {
      xiaomaiCacheManager.writeCache('activities', {
        activities: $scope.activities
      });
    });


    //链接跳转
    $scope.goto = function(active) {

      if (active.isLinkUrl == '1') {
        window.location.href = active.linkUrl;
        return false;
      }

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
