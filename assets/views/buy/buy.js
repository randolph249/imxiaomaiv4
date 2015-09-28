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
        $state.go('root.locate');
      });
    });


    //点击遮罩关闭所有图层
    $scope.closeMask = function() {
      xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
      xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
      xiaomaiMessageNotify.pub('shareModelManager', 'hide');

    }

    //关闭分享对话框
    $scope.closeShare = function() {
      xiaomaiMessageNotify.pub('shareModelManager',
        'hide');
      //判断是否
      if (detailGuiStatus == 'hide' && cartGuiStatus == 'hide') {
        xiaomaiMessageNotify.pub('maskManager', 'hide')
      }
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

    var sharModelId = xiaomaiMessageNotify.sub('shareModelManager',
      function(status) {
        $scope.shareIsShow = status == 'show' ? true : false;
      });


    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('cartGuiManager', cartGuiId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', detailGuiId);
      xiaomaiMessageNotify.removeOne('shareModelManager', sharModelId);
    });



    //监听路由变化前 如果详情页 或者购物车打开 组织默认行为 关闭对话框
    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {
      if (detailGuiStatus == 'show' || cartGuiStatus == 'show') {
        xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
        xiaomaiMessageNotify.pub('cartGuiManager', 'hide');
        e.preventDefault();
      }
    });

  }
]);
