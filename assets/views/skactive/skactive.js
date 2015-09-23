angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
<<<<<<< HEAD
  'buyProcessManager',
  'xiaomaiCacheManager',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {

    };
=======
  function($scope, $state, xiaomaiService) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化
    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam) {
      collegeId = toparam.collegeId;
      activityId = toparam.activityId;
      page = toparam.page || 1;
      $scope.activeName = decodeURIComponent(toparam.activeName);

      loadSku();


      !bannerhasFresh && loadBanner();
    });


    //抓取Banner信息
    function loadBanner() {

    }
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3

    $scope.goodsList = [];
    //获取活动商品列表数据
    var loadSku = function() {
<<<<<<< HEAD
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
    });



    loadBanner();

    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam) {
      if (toparam.page && toparam.page != page) {
        loadSku.then(function(res) {
          $scope.goodsList = $scope.goodsList.concat(res.goods);

        });
      }
    });



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
=======
      xiaomaiService.fetchOne('skactiveGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20,
        v: (+new Date)
      }).then(function(res) {
        console.log(res);
        $scope.goodsList = $scope.goodsList.concat(res.goods);
      });
    }

    //翻页
    $scope.pagination = function(page) {

      debugger;
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
    };

    $scope.timecountdown = function(activityBgGoodsId) {
      var countdownindex;
      angular.forEach($scope.goodsList, function(item, index) {
        if (item.activityBgGoodsId === Number(activityBgGoodsId)) {

          countdownindex = index;
          return false;
        }
      });

<<<<<<< HEAD
=======
      console.log('截止index is:' + countdownindex)

>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
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
