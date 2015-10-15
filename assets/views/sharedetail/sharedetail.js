angular.module('xiaomaiApp').controller('sharedetailCtrl', [
  '$scope',
  '$state',
  'schoolManager',
  'xiaomaiMessageNotify',
  function(
    $scope,
    $state,
    schoolManager,
    xiaomaiMessageNotify
  ) {
    var goodId, sourceType;

    //初始化的时候 默认购物中有O个商品
    $scope.numInCart = 0;

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      $scope.goodsId = toParam.goodId;
      $scope.sourceType = toParam.sourceType;
      $scope.collegeId = toParam.collegeId;
    });

    schoolManager.get().then(function(res) {
      if (res.collegeId != $scope.collegeId) {
        alert('您选择的学校门店中找不到该商品,将跳转到首页~');
        $state.go('root.buy.nav.all');
      }
    });

    //directive load数据成功之后触发回调
    $scope.loadDetailSuccess = function() {
      xiaomaiMessageNotify.pub('sharedetailheightupdate', 'up',
        'ready', '', '');
    };

    //图片加载完成
    $scope.imageLoadedCall = function() {
      xiaomaiMessageNotify.pub('sharedetailheightupdate', 'up',
        'ready', '', '');
    };
  }
])
