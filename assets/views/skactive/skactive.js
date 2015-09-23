angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {

    };

    $scope.goodsList = [];
    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('skactiveGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20
      });
    };


    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;
    $scope.activeName = '金业Help';

    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.goodsList = res.goods;
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {

      $scope.isloading = false;
    });


    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {

      if (
        toParam.collegeId == fromParam.collegeId &&
        toParam.activityId == fromParam.activityId &&
        toParam.page == fromParam.page) {
        xiaomaiCacheManager.writeCache('skactiveGoods', {
          goods: $scope.goodsList
        });
      } else {
        xiaomaiCacheManager.clean('skactiveGoods');
      }
    });

    //页面跳转之后销毁活动列表页面的数据(这个数据不需要缓存)
    $scope.$on('$destory', function() {
      xiaomaiCacheManager.clean('skactiveGoods');
      xiaomaiCacheManager.clean('activeBackRouter');

    });



    loadBanner();

    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam,
      fromState, fromParam) {
      if (toparam.page && toparam.page != page) {
        loadSku.then(function(res) {
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


    //回退
    $scope.goback = function() {
      var backCache = xiaomaiCacheManager.readCache('activeBackRouter');

      if (backCache) {
        $state.go(backCache.state, backCache.param);
      } else {
        $state.go('root.buy.nav.all');
      }
    }



    //跳转到详情页
    $scope.gotoDetail = function(good) {

      $state.go($state.current.name, {
        goodId: good.bgGoodsId,
        sourceType: good.sourceType,
        showDetail: true
      });
    };
    //翻页
    $scope.pagination = function(page) {

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

    $scope.timecountdown = function(activityBgGoodsId) {
      var countdownindex;
      angular.forEach($scope.goodsList, function(item, index) {
        if (item.activityBgGoodsId === Number(activityBgGoodsId)) {

          countdownindex = index;
          return false;
        }
      });

      //如果是活动开始了
      if ($scope.goodsList[countdownindex]['killStarted'] === 0) {
        //修改活动状态
        $scope.goodsList[countdownindex]['killStarted'] = 1;
        //修改距离开始时间
        $scope.goodsList[countdownindex]['beginTime'] = -1;
        //截止时间到期了
      } else if ($scope.goodsList[countdownindex]['killStarted'] === 1) {
        $scope.goodsList[countdownindex]['killStarted'] = 2;
        $scope.goodsList[countdownindex]['buyLeftTime'] = -1;
      }
    }
  }
]);
