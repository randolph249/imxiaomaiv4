angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
<<<<<<< HEAD
  'xiaomaiCacheManager',
  'buyProcessManager',
  function($state, xiaomaiService, $scope,
    xiaomaiCacheManager, buyProcessManager) {
    var collegeId, categoryId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

=======
  'detailManager',
  function($state, xiaomaiService, $scope, detailManager) {
    var collegeId, categoryId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;

      loadGoodList();
    });

<<<<<<< HEAD

    //在页面跳转之前 如果发现所有和列表页相关的参数都没有变化 说明我我不需要重新请求数据
    //那么就把数据放到缓存中
    //反之就请清空所有的缓存 避免不能获取到新数据
    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {

      if (
        toParam.collegeId == fromParam.collegeId &&
        toParam.categoryId == fromParam.categoryId &&
        toParam.page == fromParam.page) {
        xiaomaiCacheManager.writeCache('goods', {
          goods: $scope.goods
        });
      } else {
        xiaomaiCacheManager.clean('goods');
      }
    });

    //页面销毁之前 缓存页面数据
    $scope.$on('$destory', function() {
      xiaomaiCacheManager.writeCache('goods', {
        goods: $scope.goods
      });
    });

    //下载商品列表
    $scope.isloading = true;
=======
    //下载商品列表
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId
      }).then(function(res) {
<<<<<<< HEAD
        $scope.goods = res.goods;
        $scope.haserror = false;

      }, function() {
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;
      });
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {

      $state.go($state.current.name, {
        goodId: good.bgGoodsId,
        sourceType: good.sourceType,
        showDetail: true
      });

    };

    $scope.buyHandler = function(good) {


      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

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

=======
        console.log(res.goods);
        $scope.goods = res.goods;
      })
    }

    //打开详情页面
    $scope.goto = function(good) {
      detailManager.gotoDetail({
        goodId: good.bgGoodsId,
        sourceType: good.sourceType
      })
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    }
  }
]);
