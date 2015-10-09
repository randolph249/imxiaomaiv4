angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'buyProcessManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, buyProcessManager,
    xiaomaiLog) {

    //推荐页面LOG统计
    xiaomaiLog('m_p_31tabrecommendation');
    var collegeId;

    $scope.isloading = true;
    var preRouter, nextRouter;

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
    }).finally(function(flag) {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up',
        'ready', '', '');
    });

    $scope.$on('$destroy', function() {
      //保存页面数据
      xiaomaiCacheManager.writeCache('categoryGoods', $scope.categorys);
      //删除订阅
    });



    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      });

      xiaomaiLog('m_b_31homepagetabrecmore');
    };

    //打开详情页面
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType, 'recommend');

      $event.preventDefault();
      $event.stopPropagation();

    };

    //购买按钮点击处理
    //如果是聚合类产品 打开购买链接
    //如果是非聚合类产品 执行购买流程
    $scope.buyHandler = function($event, good, $index, $parentindex) {

      //点击购买日志统计
      xiaomaiLog('m_b_31homepagetabrecadd');

      if (good.goodsType == 3) {
        $scope.gotoDetail($event, good);
        $event.stopPropagation();
        return false;
      }
      $scope.categorys[$parentindex]['goods'][$index]['isPaying'] = true;
      buyProcessManager({
        goodsId: good.goodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', Math.min(good.maxNum, good.skuList[0].stock)).then(
        function() {
          //购物车来源统计
          xiaomaiLog('m_r_31cartfromrecommend');
        },
        function(msg) {
          alert(msg);
        }).finally(function() {
        $scope.categorys[$parentindex]['goods'][$index]['isPaying'] =
          false;
      });

      $event.stopPropagation();
    };
  }
])
