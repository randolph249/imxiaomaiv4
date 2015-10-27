angular.module('xiaomaiApp').controller('addrListCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, schoolManager, xiaomaiCacheManager) {
    //获取地址列表信息
    var collegeId,
      userId = $state.params.userId;
    schoolManager.get().then(function(res) {
      var collegeId = res.collegeId;
      return xiaomaiService.fetchOne('addrList', {
        userId: userId,
        collegeId: collegeId
      })
    }).then(function(res) {
      $scope.addrList = res.addrList;
      $scope.defaultUserAddr = res.defaultUserAddr;
    });

    //删除某条学校信息
    $scope.delOneAddr = function($event, userAddrId, $index) {
      $event.preventDefault();
      $event.stopPropagation();
      if (!confirm('确定要删除当前收货人信息？')) {
        return false;
      }

      xiaomaiService.save('addrDel', {
        userId: userId,
        userAddrId: userAddrId
      }).then(function(res) {
        $scope.addrList.splice($index, 1);
        //删除缓存
        xiaomaiCacheManager.clean('addrList');
      }, function(msg) {
        debugger;
        alert('删除用户地址失败，请再试一次~');
      })
    };

    //跳转到编辑页面
    $scope.gotoEdit = function($event, userAddrId) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addrEdit', {
        userId: userId,
        userAddrId: userAddrId
      })
    };

    //跳转新增页面
    $scope.gotoAdd = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addrAdd', {
        userId: userId
      });
    };

    //返回下单页面
    $scope.goBack = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $state.go('root.confirmorder');
    }

  }
])
