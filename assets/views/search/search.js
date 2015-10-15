/**
 *搜索操作页面
 **/
angular.module('xiaomaiApp').controller('searchCtrl', [
  '$scope',
  '$state',
  'xiaomaiMessageNotify',
  'searchcookieManager',
  'xiaomaiMessageNotify',
  '$timeout',
  'searchcookieManager',
  'xiaomaiLog',
  function($scope, $state, xiaomaiMessageNotify, searchcookieManager,
    xiaomaiMessageNotify, $timeout, searchcookieManager, xiaomaiLog) {

    var referRouter, referParam;
    //搜索页面PV统计
    xiaomaiLog('m_p_31search');

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam,
      fromState, fromParam) {
      referRouter = fromState.name || 'root.buy.nav.all';
      referParam = fromParam;
    });

    $scope.searchkey = $state.params.key || '';

    //从哪个页面打开回到哪个页面
    $scope.goback = function() {
      $state.go(referRouter, referParam);
    };

    //执行搜索
    $scope.updatesearch = function($event, searchkey) {

      if ($event.keyCode == 13 && searchkey && searchkey.length) {
        $state.go('root.buy.searchresult', {
          key: encodeURIComponent(searchkey),
          page: 1
        });
        searchcookieManager.writeCookie(searchkey);
        $event.preventDefault();
        $event.stopPropagation();
      }
    };

    $scope.gotosearch = function($event, searchkey) {
      if (searchkey && searchkey.length) {
        $state.go('root.buy.searchresult', {
          key: encodeURIComponent(searchkey),
          page: 1
        });
        searchcookieManager.writeCookie(searchkey);
        $event.preventDefault();
        $event.stopPropagation();
      }
    }

    //输入搜索关键词
    //发布通知搜索关键词变更
    //停止输入以后 发送通知
    var $t;
    var trimreg = /^\s+|\s+$/g;
    $scope.updateSearchKey = function($event) {
      $t && $timeout.cancel($t);
      $t = null;
      $t = $timeout(function() {
        xiaomaiMessageNotify.pub('searchkeyupdate', $scope.searchkey.replace(
          trimreg, ''));
      }, 100);
    };

  }
]);

//搜索CookieController
angular.module('xiaomaiApp').controller('searchrecordCtrl', [
  '$scope',
  '$state',
  'searchcookieManager',
  'xiaomaiMessageNotify',
  'searchcookieManager',
  function($scope, $state, searchcookieManager, xiaomaiMessageNotify,
    searchcookieManager) {
    //默认情况下 搜索Cookie是显示的
    $scope.showCookie = true;
    var subId = xiaomaiMessageNotify.sub('searchkeyupdate', function(key) {
      $scope.showCookie = key.length ? false : true;
    });
    //获取Cookie列表
    $scope.cookies = searchcookieManager.getCookies();

    //跳转到搜索结果页
    $scope.goresult = function($event, key) {
      searchcookieManager.writeCookie(key);
      $state.go('root.buy.searchresult', {
        key: encodeURIComponent(key),
        page: 1
      });
      $event.preventDefault();
      $event.stopPropagation();
    };
    //删除订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('searchkeyupdate', subId);
    });

    //请求Cookie信息
    $scope.cleancookie = function($event) {
      if (confirm('确定要清除搜索历史吗?')) {
        searchcookieManager.cleanCookies();
        $scope.cookies = [];
      }
      $event.preventDefault();
      $event.stopPropagation();
    };

    //选择某项Cookie
  }
]);

//搜索提示Controller
angular.module('xiaomaiApp').controller('searchsuggestCtrl', [
  '$scope',
  '$state',
  'searchcookieManager',
  'xiaomaiMessageNotify',
  'xiaomaiService',
  function($scope, $state, searchcookieManager, xiaomaiMessageNotify,
    xiaomaiService) {
    $scope.showSuggest = false;
    var subId = xiaomaiMessageNotify.sub('searchkeyupdate', function(key) {
      $scope.showSuggest = key.length ? true : false;
      //如果关键词为空直接清除数据 不发送请求
      if (key.length) {
        loadSuggest(key);
      } else {
        $scope.suggests = [];
      }
      $scope.keywords = key;
    });

    //删除订阅
    $scope.$on('$destroy', function() {
      xiaomaiMessageNotify.removeOne('searchkeyupdate', subId);
    });

    //获取关键字
    var loadSuggest = function(key) {
      $scope.isloading = true;
      xiaomaiService.fetchOne('searchsuggest', {
        keywords: key
      }).then(function(res) {
        $scope.suggests = res.suggestGoods;
        $scope.haserror = $scope.suggests && $scope.suggests.length ?
          false : true;
      }, function() {
        $scope.suggests = [];
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;
      });
    };

    $scope.goresult = function($event, key) {
      searchcookieManager.writeCookie(key);
      $state.go('root.buy.searchresult', {
        key: encodeURIComponent(key),
        page: 1
      });
      $event.preventDefault();
      $event.stopPropagation();
    };
  }
]);
