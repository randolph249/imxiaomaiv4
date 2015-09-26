angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  'xiaomaiCacheManager',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  'siblingsNav',
  function($state, xiaomaiService, $scope,
    xiaomaiCacheManager, buyProcessManager, xiaomaiMessageNotify,
    siblingsNav) {
    var collegeId, categoryId;

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      collegeId = toParam.collegeId;
      categoryId = toParam.categoryId;

      loadGoodList();
    });



    //下载商品列表
    $scope.isloading = true;
    var loadGoodList = function() {
      xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId,
        recordPerPage: 20
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;

        $scope.haserror = false;
      }, function(msg) {
        $scope.errorip = msg;
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;

        //通知iscroll数据已经更新
        //通知iscroll说高度发生变化
        xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
          'ready');
      });
    };


    //接受directive指令
    //当上拉的时候跳到上一个导航页面
    //如果下拉 先查询是否分页 如果分页 如果分页 请求下一页数据
    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {

        if (arrow == 'up') {
          //跳转到上一页
          siblingsNav('up', collegeId, 3, categoryId).then(function(
            router) {
            $state.go(router.name, router.params);
          });
        } else if ($scope.paginationInfo.currentPage == $scope.paginationInfo
          .totalPage) {

          //跳转到下一页
          siblingsNav('down', collegeId, 3, categoryId).then(function(
            router) {
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
      return xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId,
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

    //打开详情页面
    $scope.gotoDetail = function(good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType);
      return false;
    };

    //进行流程购买
    $scope.buyHandler = function(good, $index) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
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
      }, 'plus', good.maxNum).then(function(numInCart) {}, function(msg) {
        alert(msg);
      }).finally(function() {
        $scope.goods[$index].isPaying = false;

      });

    }
  }
]);
