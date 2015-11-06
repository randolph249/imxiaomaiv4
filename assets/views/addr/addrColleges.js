angular.module('xiaomaiApp').controller('addrCollegesCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  function($state, $scope, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, xiaomaiLog) {
    //根据cityid获取学校列表
    $scope.countrylist = [];
    var cityId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      cityId = toParam.cityId;
      getSchoolListByCityId(cityId);
    });

    $scope.isloading = true;
    var getSchoolListByCityId = function(cityId) {

      xiaomaiService.fetchOne('collegelist', {
        cityId: cityId
      }).then(function(res) {
        $scope.haserror = res.cities.length ? false : true;
        $scope.countrylist = res.cities;
      }, function(msg) {
        $scope.haserror = true;
      }).finally(function() {
        xiaomaiMessageNotify.pub('collegesheightupdate', 'up',
          'ready', '', '');
        $scope.isloading = false;
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
    $scope.goback = function($event) {
      //跳回到编辑页或者新增页
      $state.go('root.addrLocate', {
        r: redirectname,
        userId: userId,
        userAddrId: userAddrId
      });
    };
  }
])
