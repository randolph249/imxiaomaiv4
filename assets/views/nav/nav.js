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
  'xiaomaiLog',
  function($scope, $state, schoolManager, xiaomaiLog) {
    //获取用户当前定位学校
    schoolManager.get().then(function(res) {
      $scope.schoolname = res.collegeName;
    });

    //跳转到选择学校页面
    $scope.gotoLocate = function() {
      xiaomaiLog('m_b_31homepageswitchsch');
      $state.go('root.locate');
    };

    //跳转到反馈页面
    $scope.gotoFeedback = function() {
      //日志统计反馈页面点击量
      xiaomaiLog('m_b_31homepagefeedback');
      $state.go('root.feedback');
    };

    //跳转到搜索操作页面
    $scope.gotoSearch = function() {
      //
      xiaomaiLog('m_b_31homepagesearch');
      $state.go('root.search');
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
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, xiaomaiLog) {

    $scope.navs = [];

    //homepagePV统计
    xiaomaiLog('m_p_31homepage');

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

    //左侧导航栏点击日志统计
    var clickLog = function(routerInfo) {
      var logNames = {
        '0': 'm_b_31homepagetabhome',
        '1': 'm_b_31homepagetabrec',
        '2': 'm_b_31homepagetabactivity+' + routerInfo.activityId,
        '3': 'm_b_31homepagetabcategory+' + routerInfo.categoryId
      };
      xiaomaiLog(logNames[routerInfo.displayType]);
    };

    //聚类导航点击日志统计
    $scope.motherNavLog = function($event) {
      xiaomaiLog('m_b_31homepagetabmothernavi');
      //避免多次点击
      $event.preventDefault();
      $event.stopPropagation();
    };

    //导航跳转
    $scope.goto = function($event, routerInfo) {
      schoolManager.get().then(function(res) {
        var collegeId = res.collegeId,
          displayType = routerInfo.displayType,
          activityType = routerInfo.activityType,
          path;
        //日志统计
        clickLog(routerInfo);

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

      //避免多次触发
      $event.preventDefault();
      $event.stopPropagation();
    }

  }
]);
