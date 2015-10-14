/**
 *搜索结果页面
 **/
angular.module('xiaomaiApp').controller('searchresultCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'xiaomaiMessageNotify',
  function($scope, $state, xiaomaiService, schoolManager,
    xiaomaiMessageNotify) {

    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.searchkey = decodeURIComponent(toParam.key);
      $scope.isloading = true;

      loadSku($scope.searchkey);
    });

    $scope.gohomepage = function($event) {
      $state.go('root.buy.nav.all');
      $event.preventDefault();
      $event.stopPropagation();
    };

    //跳转到搜索
    $scope.gotosearch = function($event, key) {
      $state.go('root.search', {
        key: key
      });
      $event.preventDefault();
      $event.stopPropagation();
    };

    //加载搜索结果
    var collegeId;
    var loadSku = function(key) {
      $scope.isloading = true;
      schoolManager.get().then(function(res) {
        collegeId = res.collegeId;
        return xiaomaiService.fetchOne('searchresult', {
          collegeId: collegeId,
          keywords: key,
          currentPage: 1
        });
        debugger;
      }).then(function(res) {
        $scope.goods = res.goods;
        $scope.paginationInfo = res.paginationInfo;
        $scope.haserror = !$scope.goods || !$scope.goods.length;
      }, function() {
        $scope.haserror = true;
      }).finally(function() {
        $scope.isloading = false;

        var hasNextPage = $scope.goods && $scope.goods.length &&
          $scope.paginationInfo
          .currentPage != $scope.paginationInfo
          .totalPage;

        xiaomaiMessageNotify.pub('searchresultheightupdate', 'up',
          'ready',
          '', hasNextPage ? '请求下一页数据' : '');
      });
    };


    var subScrollId = xiaomaiMessageNotify.sub('searchresultscrollupdate',
      function(arrow) {
        var hasNextPage = $scope.goods && $scope.goods.length &&
          $scope.paginationInfo
          .currentPage != $scope.paginationInfo
          .totalPage;
        if (arrow == 'down' && hasNextPage && $scope.paginationInfo.currentPage !=
          $scope.paginationInfo
          .totalPage) {
          xiaomaiMessageNotify.pub('searchresultheightupdate', 'down',
            'pending', '正在请求数据...');
          !nextPageLock && getNextPageData().then(function(res) {
            var isLastPage = $scope.paginationInfo.currentPage ==
              $scope.paginationInfo.totalPage;
            var downtip = isLastPage ? '' : '请求下一页数据';
            xiaomaiMessageNotify.pub('searchresultheightupdate',
              'down',
              'ready', '', downtip);
          });

        }
      });

    var nextPageLock = false;
    var getNextPageData = function() {
      if (nextPageLock) {
        return false;
      }
      nextPageLock = true;
      return xiaomaiService.fetchOne('searchresult', {
        collegeId: collegeId,
        keywords: $scope.searchkey,
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
      xiaomaiMessageNotify.removeOne('searchresultheightupdate',
        subScrollId);
    });

  }
]);
