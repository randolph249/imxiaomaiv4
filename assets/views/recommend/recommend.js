angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    var collegeId;

    $scope.isloading = true;
    //获取学校ID 根据学校ID 获取推荐类目
    schoolManager.get().then(function(schoolInfo) {
      collegeId = schoolInfo.collegeId;
      return xiaomaiService.fetchOne('categoryGoods', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.categorys = res;
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function(res) {

      //通知iscroll说高度发生变化
      xiaomaiMessageNotify.pub('navmainheightstatus', 'down', 'ready',
        '');

      $scope.isloading = false;
    });

    var subId = xiaomaiMessageNotify.sub('navmainscrollupdate', function(
      arrow) {

      if (arrow == 'up') {

        xiaomaiMessageNotify.pub('navmainheightstatus', 'up', 'doing',
          '将进入首页');

        $state.go('root.buy.nav.all')
      } else {
        xiaomaiMessageNotify.pub('navmainheightstatus', 'down', 'doing',
          '下一页是老李活动');
      }
    });



    //数据销毁之前保存数据
    $scope.$on('$destroy', function() {
      xiaomaiCacheManager.writeCache('categoryGoods', $scope.categorys);
    });



    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      })
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {
      // $state.go($state.current.name, {
      //   showDetail: true,
      //   goodId: good.goodsId,
      //   sourceType: good.sourceType
      // });

      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType);

    };

    //购买按钮点击处理
    //如果是聚合类产品 打开购买链接
    //如果是非聚合类产品 执行购买流程
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      return false;


      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
      });
    };
  }
])
