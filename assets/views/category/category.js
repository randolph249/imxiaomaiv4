angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  'xiaomaiCacheManager',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  'getRouterTypeFromUrl',
  'xiaomaiLog',
  function($state, xiaomaiService, $scope,
    xiaomaiCacheManager, buyProcessManager, xiaomaiMessageNotify,
    getRouterTypeFromUrl, xiaomaiLog) {
    var collegeId, categoryId;
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;
      loadGoodList();
      loadBanner();
      //类目页面PV统计
      xiaomaiLog('m_p_31tabcategory' + categoryId);
    });

    //下载商品列表
    var preRouter, nextRouter;
    $scope.isloading = true;
    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId,
        recordPerPage: 10
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = false;
        // return siblingsNav('up', collegeId, 3, categoryId);
      }, function(tip) {
        $scope.haserror = true;
        $scope.errortip = tip;
      }).finally(function() {
        $scope.isloading = false;
        //发送提示;
        var isLastPage = $scope.paginationInfo.currentPage ==
          $scope.paginationInfo.totalPage;
        var downtip = isLastPage ? '' : '请求下一页数据';
        xiaomaiMessageNotify.pub('navmainheightstatus',
          'up', 'ready', '', downtip);
      }, function(msg) {
        $scope.errorip = msg;
        $scope.haserror = true;
      });
    };

    var loadBanner = function() {
      xiaomaiService.fetchOne('categoryBanners', {
        categoryId: categoryId,
        collegeId: collegeId
      }).then(function(res) {
        $scope.banners = res.banners;
      });
    };

    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId,
        'categorybanner' + categoryId);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, router.params);
      }
      return false;
    };

    //接受directive指令
    //当上拉的时候跳到上一个导航页面
    //如果下拉 先查询是否分页 如果分页 如果分页 请求下一页数据


    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {
        if (arrow == 'up') {
          return false;
          preRouter && $state.go(preRouter.name, preRouter.params);
        } else if ($scope.paginationInfo.currentPage == $scope.paginationInfo
          .totalPage) {
          return false;

          //$state.go(nextRouter.name, nextRouter.params);
        } else {

          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
            'pending', '正在请求数据...');
          //发送下页数据请求
          !nextPageLock && getNextPageData().then(function(res) {
            var isLastPage = $scope.paginationInfo.currentPage ==
              $scope.paginationInfo.totalPage;
            var downtip = isLastPage ? '' : '请求下一页数据';
            xiaomaiMessageNotify.pub('navmainheightstatus',
              'down',
              'ready', '', downtip);
          });
        }

      });

    //请求下一页数据
    var nextPageLock = false;
    var getNextPageData = function() {
      if (nextPageLock) {
        return false;
      }
      nextPageLock = true;
      return xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId,
        recordPerPage: 10,
        currentPage: $scope.paginationInfo.currentPage + 1
      }).then(function(res) {
        //更新当前页码数据
        nextPageLock = false;
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

    //打开详情页面
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType, 'category' + categoryId);
      $event.preventDefault();
      $event.stopPropagation();
    };

    //进行流程购买
    $scope.buyHandler = function($event, good, $index) {

      //类目下购买按钮点击次数统计
      xiaomaiLog('m_b_31homepagetabcategoryadd' + categoryId);


      if (good.goodsType == 3) {
        $scope.gotoDetail($event, good);
        $event.stopPropagation();
        return false;
      }

      $scope.goods[$index].isPaying = true;
      buyProcessManager({
        goodsId: good.goodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', Math.min(good.maxNum, good.skuList[0].stock)).then(
        function(numInCart) {
          xiaomaiLog('m_r_31cartfromcategory' + categoryId);
        },
        function(msg) {
          alert(msg);
        }).finally(function() {
        $scope.goods[$index].isPaying = false;
      });
      $event.stopPropagation();
    }
  }
]);
