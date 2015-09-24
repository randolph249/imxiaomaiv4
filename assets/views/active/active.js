angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'detailManager',
  'buyProcessManager',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager) {
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
    }).then(function() {
      xiaomaiCacheManager.writeCache('activeBanner', {
        banners: $scope.banners
      });
    });


    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {
      if (
        toParam.collegeId == fromParam.collegeId &&
        toParam.activityId == fromParam.activityId &&
        toParam.page == fromParam.page) {
        xiaomaiCacheManager.writeCache('activeGoods', {
          activityShowName: $scope.activityShowName,
          goods: $scope.goodsList,
          paginationInfo: $scope.paginationInfo
        });
      } else {
        xiaomaiCacheManager.clean('activeGoods');
      }
    });

    //页面跳转之后销毁活动列表页面的数据(这个数据不需要缓存)
    $scope.$on('$destory', function() {
      xiaomaiCacheManager.clean('activeGoods');

      xiaomaiCacheManager.clean('activeBackRouter');
    });

    //回退
    $scope.goback = function() {

      debugger;
      var backCache = xiaomaiCacheManager.readCache('activeBackRouter');
      if (backCache) {
        $state.go(backCache.state, backCache.param);
      } else {
        $state.go('root.buy.nav.all');
      }
    };

    $scope.gotoActive = function(banner) {
      debugger;
      return false;
    }



    $scope.$on('$stateChangeSuccess', function(e, toState, toParam,
      fromState, fromParam) {
      //监听到翻页请求 请求下一页数据
      if (toParam.page !== fromParam.page) {
        loadSku().then(function(res) {
          $scope.goodsList = $scope.goodsList.concat(res.goods);
        });
      }

      //保存条转过来的链接
      if (fromState.name.indexOf('root.buy.nav') != -1) {
        xiaomaiCacheManager.writeCache('activeBackRouter', {
          state: fromState.name,
          param: fromParam
        });
      }
    });

    //跳转到详情页
    $scope.gotoDetail = function(good) {

      $state.go($state.current.name, {
        goodId: good.activityGoodsId,
        sourceType: good.sourceType,
        showDetail: true,
        r: (+new Date)
      });
    };

    //执行购买
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
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
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager) {
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


    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
    }).then(function() {
      xiaomaiCacheManager.writeCache('activeBanner', {
        banners: $scope.banners
      });
    });

    //在页面跳转之前 如果发现所有和列表页相关的参数都没有变化 说明我我不需要重新请求数据
    //那么就把数据放到缓存中
    //反之就请清空所有的缓存 避免不能获取到新数据
    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {

      if (
        toParam.collegeId == fromParam.collegeId &&
        toParam.activityId == fromParam.activityId &&
        toParam.page == fromParam.page) {
        xiaomaiCacheManager.writeCache('activeGoods', {
          goods: $scope.goods
        });
      } else {
        xiaomaiCacheManager.clean('activeGoods');
      }
    });

    //页面销毁之前 缓存页面数据
    $scope.$on('$destory', function() {
      xiaomaiCacheManager.writeCache('activeGoods', {
        goods: $scope.goods
      });
    });

    //跳转到详情页
    $scope.gotoDetail = function(good) {

      $state.go($state.current.name, {
        goodId: good.bgGoodsId,
        sourceType: good.sourceType,
        showDetail: true,
        r: (+new Date)
      });
    };

    //执行购买
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      }, 'plus', good.skuList[0].numInCart, good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
      });
    };

    //翻页
    $scope.pagination = function(page) {}
  }
]);
