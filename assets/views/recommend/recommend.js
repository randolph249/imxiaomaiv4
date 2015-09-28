angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'buyProcessManager',
  'siblingsNav',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, buyProcessManager,
    siblingsNav) {
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
      })
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {

      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType);

    };

    //购买按钮点击处理
    //如果是聚合类产品 打开购买链接
    //如果是非聚合类产品 执行购买流程
    $scope.buyHandler = function(good, $index, $parentindex) {


      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      $scope.categorys[$parentindex]['goods'][$index]['isPaying'] = true;
      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', Math.min(good.maxNum, good.skuList[0].stock)).then(
        function() {

        },
        function(msg) {
          alert(msg);
        }).finally(function() {
        $scope.categorys[$parentindex]['goods'][$index]['isPaying'] =
          false;

      });
    };
  }
])
