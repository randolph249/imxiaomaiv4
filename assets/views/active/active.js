angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'buyProcessManager',
  'xiaomaiCacheManager',
  'xiaomaiMessageNotify',
  'wxshare',
  'getRouterTypeFromUrl',
  'schoolManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, wxshare,
    getRouterTypeFromUrl, schoolManager, xiaomaiLog) {


    var collegeId, activityId = $state.params.activityId,
      page = 1;

    $scope.activityId = activityId;


    //初始化数据请求
    $scope.isloading = true;
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      return loadGoodList();
    }).then(function(flag) {
      return loadBanner(flag);
    }).finally(function() {
      $scope.isloading = false;

      //活动结束跳转到首页
      if ($scope.haserror) {
        $scope.errortip = '活动已结束,将跳转到首页';
        setTimeout(function() {
          $state.go('root.buy.nav.all');
        }, 300);
      } else {
        var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage;
        xiaomaiMessageNotify.pub('activeheightstatus', 'up', 'ready', '', hasNextPage ? '请求下一页数据' : '');
        wxshareConfig();
      }
    });

    //获取活动商品列表数据
    var loadGoodList = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 10
      }).then(function(res) {
        $scope.activityShowName = res.activityShowName;
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = $scope.goods.length ? false : true;
        return $scope.haserror ? false : true;
      }, function() {
        $scope.haserror = true;
        return false;
      });
    };

    //抓取Banner信息
    //如果获取活动商品信息出错 不需要再获取Banner信息
    var loadBanner = function(flag) {
      if (!flag) {
        return false;
      }
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      }).then(function(res) {
        angular.forEach(res.banners, function(banner) {
          banner.imageUrl += '&imageView2/0/w/600';
        });
        $scope.banners = res.banners;
        return res;
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
    //独立活动页面PV统计
    xiaomaiLog('m_p_31singleactivity+' + activityId);
    //页面来源统计
    xiaomaiLog('m_r_31activefrom' + $state.params.refer);

    //订阅detailGuiManager 如果详情页面关闭 重新修改微信分享配置
    var subDetailGuiId = xiaomaiMessageNotify.sub('detailGuiManager', function(status) {
      if (status == 'hide') {
        setTimeout(function() {
          wxshareConfig();
        }, 100)
      }
    });


    //订阅滚轮滑动
    var iscrollSubId = xiaomaiMessageNotify.sub('activeiscrollupdate', function(arrow) {
      if (arrow == 'down' && $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage) {
        //提示文案 下一页数据
        xiaomaiMessageNotify.pub('activeheightstatus', 'down', 'pending', '', '正在请求数据');
        //发送下页数据请求
        !nextPageLock && getNextPageData().then(function(res) {
          var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage;
          xiaomaiMessageNotify.pub('activeheightstatus', 'down', 'ready', '', hasNextPage ? '请求下一页数据' : '');
        });
      }
    });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate', iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId)
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
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, angular.extend(router.params, {
          r: 'activebanner+' + activityId
        }));
      }
      return false;
    };

    //跳转到详情页
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId, good.sourceType, 'active' +
        activityId);
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
  'schoolManager',
  'wxshare',
  function($scope, $state, xiaomaiService, buyProcessManager,
    xiaomaiCacheManager, xiaomaiMessageNotify, getRouterTypeFromUrl,
    xiaomaiLog, schoolManager, wxshare) {
    var collegeId, activityId = $state.params.activityId,
      page = 1;

    $scope.activityId = activityId;

    //初始化数据请求
    $scope.isloading = true;
    schoolManager.get().then(function(res) {
      collegeId = res.collegeId;
      return loadGoodList();
    }).then(function(flag) {
      return loadBanner(flag);
    }).finally(function() {
      $scope.isloading = false;

      //活动结束跳转到首页
      if ($scope.haserror) {
        $scope.errortip = '活动已结束,将跳转到首页';
        setTimeout(function() {
          $state.go('root.buy.nav.all');
        }, 500);
      } else {
        var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage;
        xiaomaiMessageNotify.pub('activeheightstatus', 'up', 'ready', '', hasNextPage ? '请求下一页数据' : '');
        wxshareConfig();
      }
    });

    //获取活动商品列表数据
    var loadGoodList = function() {
      return xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 10
      }).then(function(res) {
        $scope.activityShowName = res.activityShowName;
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = $scope.goods.length ? false : true;
        return $scope.haserror ? false : true;
      }, function() {
        $scope.haserror = true;
        return false;
      });
    };

    //抓取Banner信息
    //如果获取活动商品信息出错 不需要再获取Banner信息
    var loadBanner = function(flag) {
      if (!flag) {
        return false;
      }
      return xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      }).then(function(res) {
        angular.forEach(res.banners, function(banner) {
          banner.imageUrl += '&imageView2/0/w/600';
        });
        $scope.banners = res.banners;
        return res;
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
    //独立活动页面PV统计
    xiaomaiLog('m_p_31singleactivity+' + activityId);

    //订阅detailGuiManager 如果详情页面关闭 重新修改微信分享配置
    var subDetailGuiId = xiaomaiMessageNotify.sub('detailGuiManager', function(status) {
      if (status == 'hide') {
        setTimeout(function() {
          wxshareConfig();
        }, 500)
      }
    });


    //订阅滚轮滑动
    var iscrollSubId = xiaomaiMessageNotify.sub('activeiscrollupdate', function(arrow) {
      if (arrow == 'down' && $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage) {
        //提示文案 下一页数据
        xiaomaiMessageNotify.pub('activeheightstatus', 'down', 'pending', '', '正在请求数据');
        //发送下页数据请求
        !nextPageLock && getNextPageData().then(function(res) {
          var hasNextPage = $scope.paginationInfo.currentPage != $scope.paginationInfo.totalPage;
          xiaomaiMessageNotify.pub('activeheightstatus', 'down', 'ready', '', hasNextPage ? '请求下一页数据' : '');
        });
      }
    });

    $scope.$on('$destroy', function() {
      //删除订阅
      xiaomaiMessageNotify.removeOne('activeiscrollupdate', iscrollSubId);
      xiaomaiMessageNotify.removeOne('detailGuiManager', subDetailGuiId)
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
      var router = getRouterTypeFromUrl(banner.hrefUrl, collegeId);

      if (router.hasOwnProperty('path')) {
        window.location.href = router.path;
      } else {
        $state.go(router.name, angular.extend(router.params, {
          r: 'activebanner+' + activityId
        }));
      }
      return false;
    };

    //跳转到详情页
    $scope.gotoDetail = function($event, good) {
      xiaomaiMessageNotify.pub('detailGuiManager', 'show', good.activityGoodsId, good.sourceType, 'active' +
        activityId);
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
