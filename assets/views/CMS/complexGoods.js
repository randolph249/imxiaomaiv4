angular.module('xiaomaiApp').controller('buy.complexGoodsCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'wxshare',
  'getRouterTypeFromUrl',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, wxshare,
    getRouterTypeFromUrl, xiaomaiLog) {
    var collegeId, activityId;

    //微信分享配置
    var wxshareConfig = function() {
      wxshare({
        title: '小麦特供-' + $scope.activityShowName,
        imgUrl: 'http://xiaomai-p2p.qiniudn.com/2b7ef2e2c2ce364303283bf49131a40f',
        desc: '小麦特供,便宜有好货,赶快点进来看看吧!'
      });
    };

    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('complexGoods', {
        collegeId: collegeId,
        activityId: activityId
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;

    $scope.activityId = activityId;

    //初始化数据请求
    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.headerImage = res.headerImage;
      $scope.templateType = res.templateType;
      $scope.backgroundColor = res.backgroundColor;
      $scope.subjects = res.subjects;
      $scope.activityRule = res.activityRule.split("\r\n");
      $scope.hasRule = res.activityRule.length ? true : false;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      wxshareConfig();
    });

    //订阅detailGuiManager 如果详情页面关闭 重新修改微信分享配置
    var subDetailGuiId = xiaomaiMessageNotify.sub('detailGuiManager',
      function(status) {
        if (status == 'hide') {
          setTimeout(function() {
            wxshareConfig();
          }, 100)
        }
      });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate',
        iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId)
    });

    //分享
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
      xiaomaiMessageNotify.pub('maskManager', 'show');
    };

    //跳转到详情页
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType, 'active' + activityId);
      return false;
    };
  }
]);
