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
        recordPerPage: 20
      });
    };


    //获取下一页数据
    var getNextPageData = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: $scope.paginationInfo.currentPage + 1,
        recordPerPage: 20
      }).then(function(res) {
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
      $scope.haserror = $scope.goodsList.length ? false : true;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('skactiveheightstatus', 'down',
        'ready');
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
          xiaomaiMessageNotify.pub('activeheightstatus', 'down',
            'pending', '请求下一页数据');
          //发送下页数据请求
          getNextPageData().then(function(res) {
            xiaomaiMessageNotify.pub('skactiveheightstatus', 'down',
              'ready');
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


    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      $state.go('root.buy.skactive', {
        collegeId: banner.collegeId,
        activityId: banner.activityId
      });
    }

    //跳转到详情页
    $scope.gotoDetail = function(good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType);
      return false;
    };
    //翻页
    $scope.pagination = function(page) {

    };


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
      }, 'plus', good.maxNum).then(function() {
        $scope.goodsList[$index].killed = true;

      }, function(msg) {
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
