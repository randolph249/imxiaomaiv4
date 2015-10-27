angular.module('xiaomaiApp').controller('addrEditCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, xiaomaiCacheManager) {
    var userId = $state.params.userId,
      addrId = $state.params.addrId,
      userAddrId = $state.params.userAddrId;

    //获取当前收货地址信息
    xiaomaiService.fetchOne('getAddr', {
      userId: userId,
      userAddrId: userAddrId
    }).then(function(res) {

      $scope.receiverName = res.receiverName;
      $scope.receiverPhone = res.receiverPhone;
      return res;

    }).then(function(res) {
      var checkedCollegeCaches = xiaomaiCacheManager.readCache('addrCollegeInfo');
      //更新缓存学校时候候要判断使用页面旧数据还是选中的新学校数据
      if (checkedCollegeCaches) {
        $scope.receiverCollegeId = checkedCollegeCaches.collegeId;
        $scope.receiverCollegeName = checkedCollegeCaches.collegeName;
      } else {
        $scope.receiverCollegeId = res.receiverCollegeId;
        $scope.receiverCollegeName = res.receiverCollegeName;
      }
    });


    //缓存当前地址信息
    $scope.$on('$destroy', function() {
      xiaomaiCacheManager.writeCache('getAddr', {
        receiverName: $scope.receiverName,
        receiverPhone: $scope.receiverPhone,
        receiverCollegeId: $scope.receiverCollegeId,
        receiverCollegeName: $scope.receiverCollegeName
      }, {
        userId: userId,
        userAddrId: userAddrId
      });

      //这个数据只是要做为编辑页面和学校学校列表的一个临时数据交换 用完删除
      xiaomaiCacheManager.clean('addrCollegeInfo');
    });


    //从缓存中读取数据
    // if (chosenCollege) {
    //   var cache = xiaomaiCacheManager.readCache('addrCollegeInfo');
    //   $scope.receiverCollegeId = cache.collegeId;
    //   $scope.receiverCollegeName = cache.collegeName;
    // }

    //返回
    $scope.goBack = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addr', {
        userId: userId,
        addrId: addrId
      })
    };

    //跳转到城市列表页
    $scope.goLocate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('root.addrLocate', {
        r: 'root.addrEdit'
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


      xiaomaiService.save('setAddr', {
        userId: userId,
        userAddrId: userAddrId,
        receiverName: $scope.receiverName,
        receiverPhone: $scope.receiverPhone,
        receiverCollegeId: $scope.receiverCollegeId
      }).then(function() {
        $state.go('root.addr', {
          userId: userId,
          addrId: addrId
        });
      });
    }
  }
])
