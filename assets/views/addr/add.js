angular.module('xiaomaiApp').controller('addrAddCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager) {
    var userId = $state.params.userId,
      chosenCollege = $state.params.chosenCollege === 'true';

    //从缓存中读取数据
    if (chosenCollege) {
      var cache = xiaomaiCacheManager.readCache('addrCollegeInfo');
      $scope.receiverCollegeId = cache.collegeId;
      $scope.receiverCollegeName = cache.collegeName;
    }

    //返回
    $scope.goBack = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addr', {
        userId: userId
      });
    };

    //跳转到城市列表页
    $scope.goLocate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addrLocate', {
        r: $state.current.name
      });
    };

    //保存数据
    $scope.save = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      if (!/[\w\u4e00-\u9fa5]+/.test($scope.receiverName || '')) {
        alert('请输入正确的联系人信息');
        return false;
      }

      if (!/^(\+86)?1[3|4|5|8][0-9]\d{4,8}$/.test($scope.receiverPhone)) {
        alert('请输入正确的手机号');
        return false;
      };

      if (!$scope.receiverCollegeId) {
        alert('请选择学校信息');
        return false;
      }

      xiaomaiService.save('addAddr', {
        userId: userId,
        receiverName: $scope.receiverName,
        receiverPhone: $scope.receiverPhone,
        receiverCollegeId: $scope.receiverCollegeId
      }).then(function() {
        $state.go('root.addr', {
          userId: userId
        });
      });
    }
  }
])
