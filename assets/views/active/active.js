angular.module('xiaomaiApp').controller('buy.activeCtrl', [
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
    var collegeId, activityId, page;
    //监听路由参数变化

    //抓取Banner信息
    var loadBanner = function() {
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      });
    };

    //微信分享配置
    var wxshareConfig = function() {
      wxshare({
        title: '小麦特供-' + $scope.activityShowName,
        imgUrl: 'http://xiaomai-p2p.qiniudn.com/2b7ef2e2c2ce364303283bf49131a40f',
        desc: '小麦特供,便宜有好货,赶快点进来看看吧!'
      });
    };

    //获取活动商品列表数据
    var loadSku = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 10
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;

    $scope.activityId = activityId;
    //独立活动页面PV统计
    xiaomaiLog('m_p_31singleactivity+' + activityId);
    //页面来源统计
    xiaomaiLog('m_r_31activefrom' + $state.params.refer);

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

      var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo
        .totalPage;

      xiaomaiMessageNotify.pub('activeheightstatus', 'up', 'ready',
        '', hasNextPage ? '请求下一页数据' : '');

      wxshareConfig();
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
    var iscrollSubId = xiaomaiMessageNotify.sub('activeiscrollupdate',
      function(arrow) {
        if (arrow == 'down' && $scope.paginationInfo.currentPage !=
          $scope.paginationInfo
          .totalPage) {
          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('activeheightstatus', 'down',
            'pending', '', '正在请求数据');
          //发送下页数据请求
          !nextPageLock && getNextPageData().then(function(res) {
            var hasNextPage = $scope.paginationInfo.currentPage !=
              $scope.paginationInfo
              .totalPage;
            xiaomaiMessageNotify.pub('activeheightstatus', 'down',
              'ready',
              '', hasNextPage ? '请求下一页数据' : '');
          });
        }
      });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate',
        iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId)
    });

    loadBanner().then(function(res) {
      angular.forEach(res.banners, function(banner) {
        banner.imageUrl + '&imageView2/0/w/600';
      });
      $scope.banners = res.banners;
      return res;
    });

    //分享
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
      xiaomaiMessageNotify.pub('maskManager', 'show');
    };


    //回退
    $scope.goback = function() {
      $state.go('root.buy.nav.all');
    };

    //跳转到对应的活动
    $scope.gotoActive = function(banner) {
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId,
        'activebanner+' + activityId);

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

    //翻页
    var nextPageLock = false;
    var getNextPageData = function() {
      if (nextPageLock) {
        return false;
      }
      nextPageLock = true;
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        recordPerPage: 10,
        currentPage: $scope.paginationInfo.currentPage + 1
      }).then(function(res) {
        //更新当前页码数据
        nextPageLock = false;
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
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'getRouterTypeFromUrl',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, getRouterTypeFromUrl,
    xiaomaiLog) {
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
        recordPerPage: 10
      });
    };

    collegeId = $state.params.collegeId;
    activityId = $state.params.activityId;
    page = $state.params.page || 1;

    $scope.activityId = activityId;

    //左侧导航活动页面PV统计
    xiaomaiLog('m_p_31tabactivity' + activityId);

    //初始化数据请求
    $scope.isloading = true;

    var preRouter, nextRouter;

    loadSku().then(function(res) {
      $scope.haserror = res.goods.length ? false : true;
      $scope.goods = res.goods;
      $scope.paginationInfo = res.paginationInfo;
    }, function() {
      $scope.haserror = true;
    }).finally(function() {
      $scope.isloading = false;

      var isLastPage = $scope.paginationInfo.currentPage ==
        $scope.paginationInfo.totalPage;
      var downtip = isLastPage ? '' : '请求下一页数据';
      xiaomaiMessageNotify.pub('navmainheightstatus', 'up',
        'ready', '', downtip);
    });


    //获取banner数据
    loadBanner().then(function(res) {
      $scope.banners = res.banners;
      return res;
    });


    //跳转到详情页
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId,
        good.sourceType, 'active' + activityId);
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
          // xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
          //   'ready', angular.isObject(preRouter) ? preRouter.text : '',
          //   angular.isObject(nextRouter) ? nextRouter.text : '');
          // nextRouter && $state.go(nextRouter.name, nextRouter.params);
        } else {
          //提示文案 下一页数据
          xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
            'pending', '正在请求数据...');
          //发送下页数据请求
          !nextPageLock && getNextPageData().then(function(res) {
            var isLastPage = $scope.paginationInfo.currentPage ==
              $scope.paginationInfo.totalPage;
            var downtip = isLastPage ? '' : '请求下一页数据';
            xiaomaiMessageNotify.pub('navmainheightstatus', 'down',
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
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
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
  }
]);
