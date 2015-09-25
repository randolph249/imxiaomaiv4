angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'detailManager',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    var collegeId, activityId, page;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      });
    }

    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;


    //初始化数据请求
    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.activityShowName = res.activityShowName;

      $scope.goodsList = res.goods;

      $scope.paginationInfo = $scope.paginationInfo;
      $scope.haserror = $scope.goodsList.length ? false : true;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
    });


    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
    });


    //回退
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    };

    //跳转活动链接
    $scope.gotoActive = function(banner) {
      $state.go('root.buy.active', {
        activityId: banner.activityId,
        collegeId: banner.collegeId
      });
    }

    //跳转到详情页
    $scope.gotoDetail = function(good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType);
      return false;
    };

    //执行购买
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      $scope.isPaying = true;

      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
      }).finally(function() {
        $scope.isPaying = false;
      });
    };

    //翻页
    $scope.pagination = function(page) {}
  }
]);



//导航页面的active和单独页面的active活动除了template不一样
angular.module('xiaomaiApp').controller('nav.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'detailManager',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    var collegeId, activityId, page;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      });
    }


    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;

    //初始化数据请求
    $scope.isloading = true;

    loadSku().then(function(res) {
      $scope.haserror = res.goods.length ? false : true;

      $scope.goodsList = res.goods;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
    });


    //获取banner数据
    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
    });


    //跳转到详情页
    $scope.gotoDetail = function(good) {

      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType);
      return false;
    };

    //执行购买
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      $scope.isPaying = true;

      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
      }).finally(function() {
        $scope.isPaying = false;
      });
    };

    //翻页
    $scope.pagination = function(page) {}
  }
]);
