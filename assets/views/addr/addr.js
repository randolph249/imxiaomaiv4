angular.module('xiaomaiApp').controller('addrListCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'addrMananger',
  '$q',
  'orderManager',
  function($scope, $state, xiaomaiService, schoolManager, xiaomaiCacheManager, addrMananger, $q, orderManager) {
    //获取地址列表信息
    var collegeId,
      userId = $state.params.userId;
    $scope.addrId = $state.params.addrId;
    //获取地址列表
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      return xiaomaiService.fetchOne('addrList', {
        userId: userId,
        collegeId: collegeId
      })
    }).then(function(res) {
      $scope.addrList = res.addrList;
      $scope.defaultUserAddr = res.defaultUserAddr;
    });



    //是否可以选择其他学校
    var isChooseOtherCollege = true;
    //判断当前选中订单是否有LDC或者rdc
    orderManager.getOrderInfo('order.childOrderList').then(function(res) {
      res && res.length && (isChooseOtherCollege = false);
    });

    //选取某个地址作为默认地址
    $scope.choosenAddr = function($event, addrInfo) {
      $event.preventDefault();
      $event.stopPropagation();

      if (addrInfo.userAddrId == $scope.addrId) {
        return false;
      }
      if (isChooseOtherCollege == false && collegeId != addrInfo.receiverCollegeId) {
        alert('次日达订单和29分钟达订单只能送到本校，不能送到其他学校哦')
        return false;
      }

      //更新当前选中地址
      $scope.addrId = addrInfo.userAddrId;
      addrMananger.setAddr(addrInfo);
      $state.go('root.confirmorder');
    };

    //删除某条学校信息
    $scope.delOneAddr = function($event, userAddrId, $index) {
      $event.preventDefault();
      $event.stopPropagation();

      if (userAddrId == $scope.addrId) {
        alert('该收货人信息正在使用,无法删除');
        return false;
      }

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
        userId: userId,
        addrId: $scope.addrId
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
