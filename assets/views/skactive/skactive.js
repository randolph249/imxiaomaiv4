angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      });
    };

    $scope.goodsList = [];
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



    $scope.isloading = true;
    loadSku().then(function(res) {
      $scope.activityShowName = res.activityShowName;
      $scope.goodsList = res.goods;
      $scope.paginationInfo = res.paginationInfo;
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

      $scope.goodsList[$index]['isPaying'] = true;
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
        $scope.goodsList[$index]['isPaying'] = false;
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
