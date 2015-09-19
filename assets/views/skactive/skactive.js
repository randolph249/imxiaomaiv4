angular.module('xiaomaiApp').controller('buy.skactiveCtrl', [
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

    }

    $scope.goodsList = [];
    //获取活动商品列表数据
    var loadSku = function() {
      xiaomaiService.fetchOne('skactiveGoods', {
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
    };

    $scope.timecountdown = function(activityBgGoodsId) {
      var countdownindex;
      angular.forEach($scope.goodsList, function(item, index) {
        if (item.activityBgGoodsId === Number(activityBgGoodsId)) {

          countdownindex = index;
          return false;
        }
      });

      console.log('截止index is:' + countdownindex)

      //如果是活动开始了
      if ($scope.goodsList[countdownindex]['killStarted'] === 0) {
        //修改活动状态
        $scope.goodsList[countdownindex]['killStarted'] = 1;
        //修改距离开始时间
        $scope.goodsList[countdownindex]['beginTime'] = -1;
        //截止时间到期了
      } else if ($scope.goodsList[countdownindex]['killStarted'] === 1) {
        $scope.goodsList[countdownindex]['killStarted'] = 2;
        $scope.goodsList[countdownindex]['buyLeftTime'] = -1;
      }
    }
  }
]);
