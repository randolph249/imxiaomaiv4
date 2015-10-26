/**
 *进行定位
 **/
angular.module('xiaomaiApp').controller('addrLocateCtrl', [
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
    xiaomaiService.fetchOne('citylist', {}).then(function(res) {
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
      $state.go('root.addrColleges', {
        cityid: city.cityId,
        userId: userId,
        userAddrId: userId,
        r: redirectname
      });
    };


    //从两个定位结果中选择一个
    var redirectname = $state.params.r;
    var userId = $state.params.userId;
    var userAddrId = $state.params.userAddrId;
    $scope.checkCollege = function($event, college, $index) {

      xiaomaiCacheManager.writeCache('addrCollegeInfo', college);
      $event.preventDefault();
      $event.stopPropagation();

      //跳回到编辑页或者新增页
      $state.go(redirectname, {
        userId: userId,
        userAddrId: userAddrId,
        chosenCollege: true
      });
    };

    //返回首页
    $scope.goback = function() {
      //跳回到编辑页或者新增页
      $state.go(redirectname, {
        userId: userId,
        userAddrId: userAddrId
      });
    }
  }
]);
