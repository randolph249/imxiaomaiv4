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
  function(
    $scope,
    locationManager,
    $state,
    xiaomaiService,
    schoolManager,
    xiaomaiCacheManager
  ) {
    $scope.locationResult = [];
    $scope.isLocating = true; //默认正在执行定位

    //获取定位
    locationManager().then(function(lnglat) {

      return xiaomaiService.fetchOne('locate', {
        latitude: lnglat.lat,
        longitude: lnglat.lng
      })

    }).then(function(res) {
      alert(JSON.stringify(res));
      $scope.locationResult = res.colleges;
    }, function(msg) {
      alert(msg);
      $scope.localFail = true;
    }).finally(function() {
      $scope.isLocating = false;
    });


    //获取所有城市列表
    $scope.citylist = [];
    $scope.isloading = true;
    xiaomaiService.fetchOne('citylist', {}, true).then(function(res) {
      $scope.citylist = res.cities;
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
    });


    //选择当前城市
    $scope.showCollegeList = function(city) {
      $state.go('root.colleges', {
        cityid: city.cityId
      });
    };

    //监听路由参数中的cityId变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.curcityid = toParam.cityid;
      //获取当前城市学校列表
    });

    //返回首页
    $scope.checkCollege = function(college) {
      schoolManager.set(college).then(function() {
        xiaomaiCacheManager.clean('navgatorlist');
        return true;
      }).then(function() {
        $state.go('root.buy.nav.all');
      });
    };

    //返回首页
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    }
  }
]);
