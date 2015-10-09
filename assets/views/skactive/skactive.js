angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
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

    //微信分享配置
    var wxshareConfig = function() {
      wxshare({
        title: '小麦特供-' + $scope.activityShowName,
        imgUrl: 'http://wap.tmall.imxiaomai.com/img/logo_new.png',
        desc: '小麦特供,便宜有好货,赶快点进来看看吧!'
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


    //独立活动PV统计
    xiaomaiLog('m_p_31singleactivity' + activityId);
    //页面来源统计
    xiaomaiLog('m_r_31activefrom' + $state.params.refer);

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

      wxshareConfig();
    });

    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
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

    //订阅滚轮滑动
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


    //删除所有订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('skactiveiscrollupdate',
        iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId);
    });


    //回退
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    };

    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId,
        'activebanner' + activityId);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, router.params);
      }
      return false;
    }

    //跳转到详情页
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType, 'active' + activityId);
      return false;
    };

    //弹出分享窗口
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
      xiaomaiMessageNotify.pub('maskManager', 'show');
    }



    //执行购买
    $scope.buyHandler = function($event, good, $index) {
      //日志：抢点击次数
      xiaomaiLog('m_b_31singleactivitypanicbuy' + activityId);

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
          //购物车来源统计
          xiaomaiLog('m_r_31cartfromactive' + activityId);

          alert('赶快去下单吧\n否则可能会被其他人抢走了哦');
          $scope.goods[$index].killed = true;

        },
        function(msg) {
          alert(msg);
          return false;
        }).finally(function() {
        $scope.goods[$index]['isPaying'] = false;
      });

      $event.stopPropagation();
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
