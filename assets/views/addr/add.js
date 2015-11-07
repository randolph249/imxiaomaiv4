angular.module('xiaomaiApp').controller('addrAddCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog) {

    //添加收货人PV统计
    xiaomaiLog('m_p_33newcontact');

    var userId = $state.params.userId,
      addrId = $state.params.addrId;

    if (xiaomaiCacheManager.readCache('addrCollegeInfo')) {
      var checkedCollegeCache = xiaomaiCacheManager.readCache('addrCollegeInfo');
      $scope.receiverCollegeId = checkedCollegeCache.collegeId;
      $scope.receiverCollegeName = checkedCollegeCache.collegeName;
    }

    //查看是否有页面旧数据
    if (xiaomaiCacheManager.readCache('addraddInfo')) {
      var caches = xiaomaiCacheManager.readCache('addraddInfo');
      $scope.receiverName = caches.receiverName;
      $scope.receiverPhone = caches.receiverPhone;

      //更新缓存学校时候候要判断使用页面旧数据还是选中的新学校数据
      if (!xiaomaiCacheManager.readCache('addrCollegeInfo')) {
        $scope.receiverCollegeId = caches.receiverCollegeId;
        $scope.receiverCollegeName = caches.receiverCollegeName;
      }

    }


    //判断用户路由跳转 如果是跳转到到选择学校列表页
    //保存页面数据
    //否则删除数据
    $scope.$on('$destroy', function() {
      if ($state.current.name == 'root.addrLocate') {
        xiaomaiCacheManager.writeCache('addraddInfo', {
          receiverName: $scope.receiverName,
          receiverPhone: $scope.receiverPhone,
          receiverCollegeId: $scope.receiverCollegeId,
          receiverCollegeName: $scope.receiverCollegeName
        });
      } else {
        xiaomaiCacheManager.clean('addraddInfo');
      }

      //删除选中的的学校缓存数据
      var cache = xiaomaiCacheManager.clean('addrCollegeInfo');

    });

    //返回
    $scope.goBack = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addr', {
        userId: userId,
        addrId: addrId
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
        //删除地址列表缓存数据
        xiaomaiCacheManager.clean('addrList');
        $state.go('root.addr', {
          userId: userId
        });
      });
    }
  }
])
