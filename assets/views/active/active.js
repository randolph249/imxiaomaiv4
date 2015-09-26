angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'detailManager',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, xiaomaiMessageNotify) {
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
      $scope.goods = res.goods;
      $scope.paginationInfo = res.paginationInfo;
      $scope.haserror = $scope.goods.length ? false : true;

    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('activeheightstatus', 'down',
        'ready');
    });



    var iscrollSubId = xiaomaiMessageNotify.sub('activeiscrollupdate',
      function(arrow) {
        if (arrow == 'down' && $scope.paginationInfo.currentPage !=
          $scope.paginationInfo
          .totalPage) {

          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('activeheightstatus', 'down',
            'pending', '请求下一页数据');
          //发送下页数据请求
          getNextPageData().then(function(res) {
            xiaomaiMessageNotify.pub('activeheightstatus', 'down',
              'ready');
          });
        }
      });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate',
        iscrollSubId);
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
    $scope.buyHandler = function(good, $index) {

      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      $scope.goods[$index]['isPaying'] = true;

      buyProcessManager({
        distributeType: good.skuList[0].distributeType,
        goodsId: good.activityGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].activitySkuId,
        price: good.skuList[0].activityPrice,
        propertyIds: ''
      }, 'plus', good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
      }).finally(function() {
        $scope.goods[$index]['isPaying'] = false;

      });
    };

    //翻页
    var getNextPageData = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        recordPerPage: 20,
        currentPage: $scope.paginationInfo.currentPage + 1
      }).then(function(res) {
        //更新当前页码数据
        $scope.paginationInfo = res.paginationInfo;
        $scope.goods = $scope.goods.concat(res.goods);
        return res;
      });
    }
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
  'siblingsNav',
  function($scope, $state, xiaomaiService, detailManager, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, siblingsNav) {
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
      $scope.goods = res.goods;
      //
      $scope.paginationInfo = res.paginationInfo;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;
      xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
        'ready');
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



    //接受directive指令
    //当上拉的时候跳到上一个导航页面
    //如果下拉 先查询是否分页 如果分页 如果分页 请求下一页数据
    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {
        if (arrow == 'up') {
          //跳转到上一页
          siblingsNav('up', collegeId, 2, activityId).then(function(
            router) {

            $state.go(router.name, router.params);
          });

        } else if ($scope.paginationInfo.currentPage == $scope.paginationInfo
          .totalPage) {
          //跳转到下一页
          siblingsNav('down', collegeId, 2, activityId).then(function(
            router) {

            alert(router.name);
            $state.go(router.name, router.params);
          });

        } else {
          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
            'pending', '请求下一页数据');
          //发送下页数据请求
          getNextPageData().then(function(res) {
            xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
              'ready');
          });
        }

      });

    //请求下一页数据
    var getNextPageData = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        recordPerPage: 20,
        currentPage: $scope.paginationInfo.currentPage + 1
      }).then(function(res) {
        //更新当前页码数据
        $scope.paginationInfo = res.paginationInfo;
        $scope.goods = $scope.goods.concat(res.goods);
        return res;
      });
    };

    //删除订阅关于iscroll的订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('navmainscrollupdate',
        iscrollSubId);
    });



    //执行购买
    $scope.buyHandler = function(good, $index) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }


      $scope.goods[$index]['isPaying'] = false;

      buyProcessManager({
        distributeType: good.skuList[0].distributeType,
        goodsId: good.activityGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].activitySkuId,
        price: good.skuList[0].activityPrice,
        propertyIds: ''
      }, 'plus', good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
        return false;
      }).finally(function() {
        $scope.goods[$index]['isPaying'] = true;
      });
    };

    //翻页
    $scope.pagination = function(page) {}
  }
]);
