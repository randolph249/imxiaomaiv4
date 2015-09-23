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
<<<<<<< HEAD
=======

>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    $scope.locationResult = [];
    $scope.isLocating = true; //默认正在执行定位

    //获取定位
<<<<<<< HEAD
    locationManager().then(function(lnglat) {

      return xiaomaiService.fetchOne('locate', {
        latitude: lnglat.lat,
        longitude: lnglat.lng
      })

    }).then(function(res) {
      $scope.locationResult = res.colleges;
    }, function() {
      $scope.localFail = true;
    }).finally(function() {
      $scope.isLocating = false;
=======
    locationManager.getLocation().then(function(res) {
      $scope.locationResult = res.colleges;
      $scope.isLocating = false; //定位结束
    }, function(err) {
      $scope.locationResult = false;
      $scope.isLocating = false; //定位结束
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    });


    //获取所有城市列表
    $scope.citylist = [];
<<<<<<< HEAD
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
      $state.go('root.locate.colleges', {
=======
    xiaomaiService.fetchOne('citylist', {}, true).then(function(res) {
      $scope.citylist = res.cities;
    });

    $scope.setCurcity = function(city) {
      $state.go($state.current.name, {
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
        cityid: city.cityId
      });
    };

<<<<<<< HEAD
    //监听路由参数中的cityId变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.curcityid = toParam.cityid;
      //获取当前城市学校列表
    });

    $scope.checkCollege = function(college) {
      schoolManager.set(college).then(function() {
        $state.go('root.buy.nav.all');
      });
=======
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
      $state.go('root.buy.nav.all');
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    }
  }
]);
