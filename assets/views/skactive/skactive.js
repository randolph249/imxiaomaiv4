angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    var collegeId, activityId, page = 1,
      bannerhasFresh = false;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      });
    };

    $scope.goods = [];
    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 10
      });
    };


    //获取下一页数据
    //上锁 频繁请求 只触发一个请求
    var nextPageLock = false
    var getNextPageData = function() {
      if (nextPageLock) {
        return false;
      }
      nextPageLock = true;
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: $scope.paginationInfo.currentPage + 1,
        recordPerPage: 10
      }).then(function(res) {
        nextPageLock = false;
        $scope.paginationInfo = res.paginationInfo;
        $scope.goods = $scope.goods.concat(res.goods);
        return res;
      });
    }

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;

    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.activityShowName = res.activityShowName;
      $scope.goods = res.goods;
      $scope.paginationInfo = res.paginationInfo;
      $scope.haserror = $scope.goods.length ? false : true;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo
        .totalPage;

      xiaomaiMessageNotify.pub('skactiveheightstatus', 'up', 'ready',
        '', hasNextPage ? '请求下一页数据' : '');
    });

    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
    });


    var iscrollSubId = xiaomaiMessageNotify.sub('skactiveiscrollupdate',
      function(arrow) {
        if (arrow == 'down' && $scope.paginationInfo.currentPage !=
          $scope.paginationInfo
          .totalPage) {

          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('skactiveheightstatus', 'down',
            'pending', '', '正在请求数据');
          //发送下页数据请求
          !nextPageLock && getNextPageData().then(function(res) {
            var hasNextPage = $scope.paginationInfo.currentPage !=
              $scope.paginationInfo
              .totalPage;
            xiaomaiMessageNotify.pub('skactiveheightstatus', 'up',
              'ready',
              '', hasNextPage ? '请求下一页数据' : '');
          });
        }
      });



    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('skactiveiscrollupdate',
        iscrollSubId);
    });


    //回退
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    };

    //根据URl解析Router参数
    var getRouterTypeFromUrl = function(url) {
      var router = {};
      if (url.match(/[\?&]m=([^\?&]+)/)) {
        router.name = 'root.buy.nav.category';
        router.params = {
          categoryId: url.match(/[\?&]id=([^\?&]+)/)[1],
          collegeId: collegeId
        }
      } else if (url.match(/skActivity/)) {
        router.name = 'root.buy.skactive';
        router.params = {
          collegeId: collegeId,
          activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1]
        }
      } else if (url.match(/activity/)) {
        router.name = 'root.buy.skactive';
        router.params = {
          collegeId: collegeId,
          activityId: url.match(/[\?&]activityId=([^\?&]+)/)[1]
        }
      } else {
        router.path = url;
      }
      return router;
    };
    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      var router = getRouterTypeFromUrl(banner.hrefUrl);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, router.params);
      }
      return false;
    }

    //跳转到详情页
    $scope.gotoDetail = function(good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType);
      return false;
    };

    //弹出分享窗口
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
      xiaomaiMessageNotify.pub('maskManager', 'show');
    }


    //执行购买
    $scope.buyHandler = function(good, $index) {
      $scope.goods[$index]['isPaying'] = true;
      buyProcessManager({
        goodsId: good.activityGoodsId,
        sourceType: 2,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].activitySkuId,
        price: good.skuList[0].activityPrice,
        propertyIds: ''
      }, 'plus', Math.min(good.maxNum, good.skuList[0].stock)).then(
        function() {
          alert('赶快去下单吧\n否则可能会被其他人抢走了哦');
          $scope.goods[$index].killed = true;

        },
        function(msg) {
          alert(msg);
          return false;
        }).finally(function() {
        $scope.goods[$index]['isPaying'] = false;
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
      if ($scope.goods[countdownindex]['killStarted'] === 0) {
        //修改活动状态
        $scope.goods[countdownindex]['killStarted'] = 1;
        //修改距离开始时间
        $scope.goods[countdownindex]['beginTime'] = -1;
        //截止时间到期了
      } else if ($scope.goodsList[countdownindex]['killStarted'] === 1) {
        $scope.goods[countdownindex]['killStarted'] = 2;
        $scope.goods[countdownindex]['buyLeftTime'] = -1;
      }
    }
  }
]);
