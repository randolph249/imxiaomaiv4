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
    }

    var detailGuiStatus, cartGuiStatus;
    xiaomaiMessageNotify.sub('detailGuiManager', function(status) {
      detailGuiStatus = status;
    });

    xiaomaiMessageNotify.sub('cartGuiManager', function(status) {
      cartGuiStatus = status;
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
