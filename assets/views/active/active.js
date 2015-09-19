angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  function($scope, $state, xiaomaiService) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化
    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam) {
      collegeId = toparam.collegeId;
      activityId = toparam.activityId;
      page = toparam.page || 1;
      $scope.activeName = decodeURIComponent(toparam.activeName);

      loadSku();


      !bannerhasFresh && loadBanner();
    });


    //抓取Banner信息
    function loadBanner() {
      xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      }).then(function(res) {
        // debugger;
      })
    }

    $scope.goodsList = [];
    //获取活动商品列表数据
    var loadSku = function() {
      xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20,
        v: (+new Date)
      }).then(function(res) {
        console.log(res);
        $scope.goodsList = $scope.goodsList.concat(res.goods);
      });
    }

    //翻页
    $scope.pagination = function(page) {
      debugger;
    }
  }
]);
