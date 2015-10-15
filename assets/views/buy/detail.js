/**详情页面**/
angular.module('xiaomaiApp').controller('buy.detailCtrl', [
  '$scope',
  '$state',
  'xiaomaiMessageNotify',
  'xiaomaiLog',
  function(
    $scope,
    $state,
    xiaomaiMessageNotify,
    xiaomaiLog
  ) {
    var goodId, sourceType;

    //初始化的时候 默认购物中有O个商品
    $scope.numInCart = 0;

    //接受DetailPageChange变化
    var detailSubId = xiaomaiMessageNotify.sub('detailGuiManager', function(
      status, id,
      type, source) {
      if (status == 'show') {
        //详情页面来源统计
        xiaomaiLog('m_r_31detailfrom' + source);
        //详情页面PV统计
        xiaomaiLog('m_p_31productdetailinfo');
        $scope.goodsId = id;
        $scope.sourceType = type;
      } else {
        $scope.goodsId = '';
        $scope.sourceType = '';
        //关闭对话框
        $scope.showdetail = false;
        xiaomaiMessageNotify.pub('maskManager', 'hide');
      }
    });

    //接受directive的回调 当数据OK之后弹开页面
    $scope.openDetailPop = function() {
      $scope.showdetail = true;
      xiaomaiMessageNotify.pub('maskManager', 'show');
      xiaomaiMessageNotify.pub('detailgoodheightupdate',
        'up', 'ready', '', '');
    };

    //监听scope销毁 删除订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('detailGuiManager', detailSubId);
    });

    //打开分享对话框
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
      xiaomaiLog('m_b_31productdetailinfoshare');
    };

    //关闭详情页
    $scope.closeDetail = function($event) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
      $event.preventDefault();
      xiaomaiLog('m_b_31productdetailinfoclose');
    };

    //图片加载完成
    $scope.imageLoadedCall = function() {
      xiaomaiMessageNotify.pub('detailgoodheightupdate',
        'up', 'ready', '', '');

    };
  }
]);
