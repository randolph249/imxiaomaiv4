angular.module('xiaomaiApp').controller('collegesCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($state, $scope, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    //根据cityid获取学校列表
    $scope.countrylist = [];


    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      var cityid = toParam.cityid;
      getSchoolListByCityId(cityid);
    });

    $scope.isloading = true;
    var getSchoolListByCityId = function(cityid) {

      xiaomaiService.fetchOne('collegelist', {
        cityId: cityid
      }).then(function(res) {
        $scope.haserror = res.cities.length ? false : true;
        $scope.countrylist = res.cities;
        // alert('cityloaded');
      }, function(msg) {
        $scope.haserror = true;
      }).finally(function() {
        // alert(123);
        xiaomaiMessageNotify.pub('collegesheightupdate', 'up',
          'ready', '', '');
        $scope.isloading = false;
      });
    };

    //选择学校
    $scope.checkCollege = function(college) {
      schoolManager.set(college).then(function() {
        xiaomaiCacheManager.clean('navgatorlist');
        return true;
      }).then(function() {
        $state.go('root.buy.nav.all');
      });
    };

    //返回列表页
    $scope.goback = function() {
      $state.go('root.locate');
    };
  }
])
