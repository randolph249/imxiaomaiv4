/**
 *进行定位
 **/
angular.module('xiaomaiApp').controller('positionCtrl', [
  '$scope',
  'locationManager',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  function(
    $scope,
    locationManager,
    $state,
    xiaomaiService,
    schoolManager,
    xiaomaiCacheManager,
    xiaomaiMessageNotify,
    xiaomaiLog
  ) {
    $scope.locationResult = [];

    //选择学校PV统计
    xiaomaiLog('m_p_31selectsch');



    //如果有缓存结果
    if (xiaomaiCacheManager.readCache('locate')) {
      $scope.locationResult = xiaomaiCacheManager.readCache('locate')[
        'colleges'];
    } else {
      $scope.islocating = true; //默认正在执行定位
      //获取定位
      locationManager().then(function(lnglat) {
        //获取定位位置附近的学校
        return xiaomaiService.fetchOne('locate', {
          latitude: lnglat.lat,
          longitude: lnglat.lng
        })

      }).then(function(res) {
        $scope.haserror = false;
        $scope.locationResult = res.colleges;
        //写入缓存
        xiaomaiCacheManager.writeCache('locate', res);
      }, function(msg) {
        //定位失败 发送Log
        xiaomaiLog('m_b_31manuallyselectcity', '');
        $scope.haserror = true;
      }).finally(function() {
        $scope.islocating = false;
      });
    }


    //获取所有城市列表
    $scope.citylist = [];
    $scope.isloading = true;
    xiaomaiService.fetchOne('citylist', {}, true).then(function(res) {
      $scope.citylist = res.cities;

      xiaomaiCacheManager.writeCache('citylist', res);
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('locateheightupdate', 'up', 'ready',
        '', '');
    });


    //选择当前城市
    $scope.showCollegeList = function(city) {
      //日志 统计当前当即城市
      xiaomaiLog('m_b_31manuallyselectcity', '');
      $state.go('root.colleges', {
        cityid: city.cityId
      });
    };

    //监听路由参数中的cityId变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.curcityid = toParam.cityid;
      //获取当前城市学校列表
    });

    //从两个定位结果中选择一个
    $scope.checkCollege = function($event, college, $index) {
      //
      xiaomaiLog($index == 0 ? 'm_b_31autoselectsch1' :
        'm_b_31autoselectsch2', college.collegeId);

      schoolManager.set(college).then(function() {
        xiaomaiCacheManager.clean('navgatorlist');
        return true;
      }).then(function() {
        $state.go('root.buy.nav.all');
      });

      $event.preventDefault();
      $event.stopPropagation();
    };

    //返回首页
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    }
  }
]);
