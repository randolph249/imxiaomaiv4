angular.module('xiaomaiApp').controller('buyCtrl', [
  '$state',
  '$scope',
  'schoolManager',
  '$q',
  'xiaomaiMessageNotify',
  function($state, $scope, schoolManager, $q, xiaomaiMessageNotify) {
    //在这里拦截用户请求
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      //在这里请求用户学校信息
      schoolManager.get().then(function(schoolInfo) {
        if (toState.name == 'root.buy') {
          $state.go('root.buy.nav.all');
        }
      }, function() {
        alert('无法获取学校信息,将跳转到选择学校页~');
        $state.go('root.locate');
      });
    });

    //点击遮罩关闭所有图层
    $scope.closeMask = function($event) {
      xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
      xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
      xiaomaiMessageNotify.pub('shareModelManager', 'hide');
      // $event.stopPropagation();
      $event.preventDefault();
    }

    //关闭分享对话框
    $scope.closeShare = function($event) {
      xiaomaiMessageNotify.pub('shareModelManager',
        'hide');
      //判断是否购物车或者商品详情是否打开
      if (detailGuiStatus != 'show' && cartGuiStatus != 'show') {
        xiaomaiMessageNotify.pub('maskManager', 'hide');
      }
      $event.preventDefault();
      $event.stopPropagation();
    }

    var detailGuiStatus, cartGuiStatus;
    var detailGuiId = xiaomaiMessageNotify.sub('detailGuiManager', function(
      status) {
      detailGuiStatus = status;
    });

    var cartGuiId = xiaomaiMessageNotify.sub('cartGuiManager', function(
      status) {
      cartGuiStatus = status;
    });

    var sharModelId = xiaomaiMessageNotify.sub('shareModelManager', function(status) {
      $scope.shareIsShow = status == 'show' ? true : false;
    });

    //删除订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('cartGuiManager', cartGuiId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', detailGuiId);
      xiaomaiMessageNotify.removeOne('shareModelManager', sharModelId);
    });

    //如果目标地址下这个数组中的地址 对浏览器默认行为不阻止(往这个目标上跳转);
    var preventRouterWhiteList = ['root.confirmorder'];

    //监听路由变化前 如果详情页 或者购物车打开 组织默认行为 关闭对话框
    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {

      if ((detailGuiStatus == 'show' || cartGuiStatus == 'show') &&
        preventRouterWhiteList.join(',').indexOf(toState.name) == -1) {
        xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
        xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
        e.preventDefault();
      }
    });

  }
]);
