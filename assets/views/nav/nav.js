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
    schoolManager.get().then(function(res) {
      $scope.schoolname = res.collegeName;
    });

    //跳转到选择学校页面
    $scope.gotoLocate = function() {
      $state.go('root.locate');
    };

    //跳转到反馈页面
    $scope.gotoFeedback = function() {
      $state.go('root.feedback');
    };

  }
]);


angular.module('xiaomaiApp').controller('nav.listCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {

    $scope.navs = [];
    //获取导航栏
    schoolManager.get().then(function(res) {
      return xiaomaiService.fetchOne('navgatorlist', {
        collegeId: res.collegeId
      });
    }).then(function(res) {
      $scope.navs = res.navigateItems;
      xiaomaiMessageNotify.pub('navheightupdate', 'up', 'ready', '', '')
      xiaomaiCacheManager.writeCache('navgatorlist', res);
    });

    $scope.paths = {
      '0': 'root.buy.nav.all',
      '1': 'root.buy.nav.recommend',
      '2': 'root.buy.nav.active',
      '3': 'root.buy.nav.category'
    };

    $scope.navChecked = function(nav) {
      //all recommend skactive active categoryId
      var flag = false;
      switch ($scope.curpath) {
        case 'all':
          flag = nav.displayType == 0;
          break;
        case 'recommend':
          flag = nav.displayType == 1;
          break;
        case 'active':
          flag = $scope.activityId == nav.activityId;
          break;
        case 'skactive':
          flag = $scope.activityId == nav.activityId;
          break;
        case 'category':
          flag = $scope.curcategoryId == nav.categoryId;
          break;
        default:
          break;
      }
      return flag;
    };

    //监听当前路径变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      $scope.type = toParam.type;
      var reg = /nav\.(\w+)/;


      var curpaths = toState.name.match(reg);
      $scope.curcategoryId = toParam.categoryId;
      $scope.activityId = toParam.activityId;
      if (curpaths && curpaths.length) {
        $scope.curpath = curpaths[1];
      }

    });

    $scope.goto = function(routerInfo) {
      schoolManager.get().then(function(res) {
        var collegeId = res.collegeId,
          displayType = routerInfo.displayType,
          activityType = routerInfo.activityType,
          path;


        path = $scope.paths[displayType];
        //跳转到对应的链接上
        $state.go(path, {
          categoryId: routerInfo.categoryId,
          activityId: routerInfo.activityId,
          collegeId: collegeId,
          showDetail: false,
          showCart: false
        });
      });
    }

  }
]);
