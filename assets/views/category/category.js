angular.module('xiaomaiApp').controller('nav.categoryCtrl', [
  '$state',
  'xiaomaiService',
  '$scope',
  'xiaomaiCacheManager',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  'getRouterTypeFromUrl',
  'schoolManager',
  'wxshare',
  'xiaomaiLog',
  function($state, xiaomaiService, $scope,
    xiaomaiCacheManager, buyProcessManager, xiaomaiMessageNotify,
    getRouterTypeFromUrl, schoolManager, wxshare, xiaomaiLog) {
    var collegeId, categoryId = $state.params.categoryId;

    //PV统计
    xiaomaiLog('m_p_31tabcategory' + categoryId);

    //请求学校ID
    //请求商品类目
    //请求Banner数据
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      return loadGoodList();
    }).then(function(flag) {
      return loadBanner(flag);
    }).finally(function() {
      $scope.isloading = false;
      var isLastPage = $scope.paginationInfo.currentPage == $scope.paginationInfo.totalPage;
      var downtip = isLastPage ? '' : '请求下一页数据';
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up', 'ready', '', downtip);
    });

    //下载商品列表
    var preRouter, nextRouter;
    $scope.isloading = true;
    var loadGoodList = function() {
      return xiaomaiService.fetchOne('goods', {
        collegeId: collegeId,
        categoryId: categoryId,
        recordPerPage: 10
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = $scope.goods.length ? false : true;
        //配置微信分享
        wxshareConfig();
        return true;
      }, function(tip) {
        //错误状态跳转到首页
        $scope.haserror = true;
        return false;
      }).finally(function() {
        $scope.errortip = $scope.haserror ? '类目不存在,将跳转到首页' : '';
        $scope.haserror && setTimeout(function() {
          $state.go('root.buy.nav.all');
        }, 500);
      });
    };

    //微信分享配置
    var wxshareConfig = function() {
      //先获取当前类目列表信息
      var categoryName = '';
      xiaomaiService.fetchOne('navgatorlist', {
        collegeId: collegeId
      }).then(function(res) {
        var navigates = res.navigateItems;
        angular.forEach(navigates, function(navigate) {
          if (categoryId == navigate.categoryId) {
            categoryName = navigate.navigateName
            return false;
          }
        });
        return categoryName
      }).then(function(name) {
        wxshare({
          title: '小麦特供-' + name,
          imgUrl: 'http://xiaomai-p2p.qiniudn.com/2b7ef2e2c2ce364303283bf49131a40f',
          desc: '小麦特供,便宜有好货,赶快点进来看看吧!'
        });
      });
    };

    //订阅detailGuiManager 如果详情页面关闭 重新修改微信分享配置
    var subDetailGuiId = xiaomaiMessageNotify.sub('detailGuiManager', function(status) {
      if (status == 'hide') {
        setTimeout(function() {
          wxshareConfig();
        }, 100);
      }
    });

    //获取类目Banner数据
    var loadBanner = function(flag) {
      //如果类目数据获取失败 不需要执行获取Banner数据
      if (!flag) {
        return false;
      }

      return xiaomaiService.fetchOne('categoryBanners', {
        categoryId: categoryId,
        collegeId: collegeId
      }).then(function(res) {
        angular.forEach(res.banners, function(banner) {
          banner.imageUrl += '&imageView2/0/w/600';
        });
        $scope.banners = res.banners;
      });
    };

    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, angular.extend(router.params, {
          refer: 'categorybanner+' + categoryId
        }));
      }
      return false;
    };

    //接受directive指令
    //当上拉的时候跳到上一个导航页面
    //如果下拉 先查询是否分页 如果分页 如果分页 请求下一页数据
    var iscrollSubId = xiaomaiMessageNotify.sub('navmainscrollupdate',
      function(arrow) {
        if (arrow == 'down' && $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage) {
          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
            'pending', '正在请求数据...');
          //发送下页数据请求
          !nextPageLock && getNextPageData().then(function(res) {
            var isLastPage = $scope.paginationInfo.currentPage == $scope.paginationInfo.totalPage;
            var downtip = isLastPage ? '' : '请求下一页数据';
            xiaomaiMessageNotify.pub('navmainheightstatus', 'down', 'ready', '', downtip);
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
    //删除关于详情页的订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('navmainscrollupdate', iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId);
    });
  }
]);
