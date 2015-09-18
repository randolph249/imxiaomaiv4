/**
 *进行定位
 **/
angular.module('xiaomaiApp').controller('positionCtrl', [
  '$scope',
  'locationManager',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function(
    $scope,
    locationManager,
    $state,
    xiaomaiService,
    schoolManager
  ) {

    $scope.locationResult = [];
    $scope.isLocating = true; //默认正在执行定位

    //获取定位
    locationManager.getLocation().then(function(res) {
      $scope.locationResult = res.colleges;
      $scope.isLocating = false; //定位结束
    }, function(err) {
      $scope.locationResult = false;
      $scope.isLocating = false; //定位结束
    });


    //获取所有城市列表
    $scope.citylist = [];
    xiaomaiService.fetchOne('citylist', {}, true).then(function(res) {
      $scope.citylist = res.cities;
    });

    $scope.setCurcity = function(city) {
      $state.go($state.current.name, {
        cityid: city.cityId
      });
    };

    //监听路由变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      getSchoolListByCityId(toParam.cityid);
      //获取当前城市学校列表
    });

    //根据cityid获取学校列表
    $scope.countrylist = [];
    var getSchoolListByCityId = function(cityid) {
      $scope.cityid = cityid;

      if (!cityid) {
        return false;
      }
      xiaomaiService.fetchOne('collegelist', {
        cityId: cityid
      }).then(function(res) {
        console.log(res.cities);
        $scope.countrylist = res.cities;
      });
    };

    $scope.checkCollege = function(college) {
      schoolManager.set(college);
      $state.go('root.buy.category');
    }
  }
]);
