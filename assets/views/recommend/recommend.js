angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'buyProcessManager',
  'siblingsNav',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, buyProcessManager,
    siblingsNav) {
    var collegeId;

    $scope.isloading = true;
    //获取学校ID 根据学校ID 获取推荐类目
    schoolManager.get().then(function(schoolInfo) {
      collegeId = schoolInfo.collegeId;
      return xiaomaiService.fetchOne('categoryGoods', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.categorys = res;
      $scope.haserror = false;
    }, function() {
      $scope.haserror = true;
    }).finally(function(res) {

      //通知iscroll说高度发生变化
      xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
        'ready');
      $scope.isloading = false;
    });
    //接受directive指令
    //当上拉的时候跳到上一个导航页面
    //如果下拉 先查询是否分页 如果分页 如果分页 请求下一页数据
    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {

        if (arrow == 'up') {
          //跳转到上一页
          siblingsNav('up', collegeId, 1).then(function(
            router) {
            $state.go(router.name, router.params);
          });

        } else if ($scope.paginationInfo.currentPage == $scope.paginationInfo
          .totalPage) {
          //跳转到下一页
          siblingsNav('down', collegeId, 1).then(function(
            router) {
            $state.go(router.name, router.params);
          });

        }

      });

    $scope.$on('$destroy', function() {
      //保存页面数据
      xiaomaiCacheManager.writeCache('categoryGoods', $scope.categorys);
      //删除订阅
      xiaomaiMessageNotify.removeOne('navmainscrollupdate',
        iscrollSubId);
    });



    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      })
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {
      // $state.go($state.current.name, {
      //   showDetail: true,
      //   goodId: good.goodsId,
      //   sourceType: good.sourceType
      // });

      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.goodsId,
        good.sourceType);

    };

    //购买按钮点击处理
    //如果是聚合类产品 打开购买链接
    //如果是非聚合类产品 执行购买流程
    $scope.buyHandler = function(good, $index, $parentindex) {


      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      $scope.categorys[$parentindex]['goods'][$index]['isPaying'] = true;
      buyProcessManager({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        distributeType: good.skuList[0].distributeType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: '',
      }, 'plus', good.maxNum).then(function() {

      }, function(msg) {
        alert(msg);
      }).finally(function() {
        $scope.categorys[$parentindex]['goods'][$index]['isPaying'] =
          false;

      });
    };
  }
])
