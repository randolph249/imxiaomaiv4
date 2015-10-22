angular.module('xiaomaiApp').controller('nav.allCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiMessageNotify',
  'xiaomaiCacheManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiMessageNotify, xiaomaiCacheManager, xiaomaiLog) {


    //导航栏homepagePV统计
    xiaomaiLog('m_p_31tabhome');

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
      angular.forEach(res.activities, function(item) {
        item.hasOwnProperty('wapImageUrl') && (item.wapImageUrl =
          item.wapImageUrl +
          '&imageView2/0/w/400/q/100');
      });

      $scope.activities = res.activities;
      // return siblingsNav('down', collegeId, 0);
    }, function(msg) {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up',
        'ready', '', '');
    });

    //缓存页面数据
    $scope.$on('$destroy', function() {
      xiaomaiCacheManager.writeCache('activities', {
        activities: $scope.activities
      }, {
        collegeId: collegeId
      });
    });


    //链接跳转
    $scope.goto = function(active) {

      if (active.isLinkUrl == '1') {
        window.location.href = active.linkUrl;
        return false;
      }

      //跳转到对应的活动页面
      $state.go('root.buy.active', {
        //编译活动名会不会导致活动名过长
        collegeId: collegeId,
        activityId: active.activityId,
        refer: 'homepage'
      });
    }
  }
]);
