/**详情页面**/
angular.module('xiaomaiApp').controller('buy.detailCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'getSkuInfo',
  'skuListToObject',
  'buyProcessManager',
  'xiaomaiMessageNotify',
  'cartManager',
  function(
    $scope,
    $state,
    xiaomaiService,
    getSkuInfo,
    skuListToObject,
    buyProcessManager,
    xiaomaiMessageNotify,
    cartManager
  ) {
    var goodId, sourceType;

    //初始化的时候 默认购物中有O个商品
    $scope.numInCart = 0;

    //接受DetailPageChange变化
    var detailSubId = xiaomaiMessageNotify.sub('detailGuiManager', function(
      status, id,
      type) {
      if (status == 'show') {
        goodId = id;
        sourceType = type;
        loadDetail(goodId, sourceType).then(function(res) {

          //如果是聚合类产品 生成SkuObject
          //创建一个skuInfo 聚合类如果选出了一个存在的商品 就生成一个skunInfo
          //非聚合类默认有一个SkuInfo
          $scope.good = res;
          if ($scope.good.goodsType == 3) {
            $scope.skuInfo = false;
            $scope.checkedProperties = {};
            $scope.skuObject = createSkukvList($scope.good.skuList);
          } else {
            $scope.skuInfo = $scope.good.skuList[0];

            cartManager.getnumInCart($scope.skuInfo.skuId).then(
              function(num) {
                $scope.numInCart = num;
              });
          }

          //弹出对话框
          $scope.showdetail = true;

        }).finally(function() {
          xiaomaiMessageNotify.pub('detailgoodheightupdate', 'up',
            'ready');
        });
      } else {
        //关闭对话框
        $scope.showdetail = false;
      }
      //通知遮罩做出相应的改变
      xiaomaiMessageNotify.pub('maskManager', status);
    });



    //获取详情信息
    var loadDetail = function(goodId, sourceType) {
      //获取到详情信息 & 同时打开详情页面
      return xiaomaiService.fetchOne('goodDetail', {
        goodsId: goodId,
        sourceType: sourceType
      });
    };

    //将Skulist转成以存在的PropertyId=PropertyVal为key的SkuObject
    var createSkukvList = function(skulist) {
      return skuListToObject(skulist);
    };

    //聚合类产品选择产品类型
    $scope.complexCheckProperty = function(key, val) {
      $scope.checkedProperties[key] = val;

      //判断是否组合出了存在的Sku信息
      var skuInfo = getSkuInfo($scope.checkedProperties, $scope.skuObject);
      $scope.skuInfo = skuInfo == false ? false : skuInfo;
      //如果skuInfo确定之后
      if ($scope.skuInfo) {
        //从后台查询numInCart信息

        var skuId = skuInfo.activitySkuId;
        cartManager.getnumInCart(skuId).then(function(num) {
          $scope.numInCart = num;
        });
      } else {
        $scope.numInCart = 0;
      }
    };

    //打开分享对话框
    $scope.showShareModel = function() {
      xiaomaiMessageNotify.pub('shareModelManager', 'show');
    };



    /**
     *添加到购物车或者那个购物中删除
     *先校验是否可以进行添加或者删除
     *然后向后台提交操作请求
     **/
    $scope.buyHandler = function(type) {


      var propertyIds = '';
      //如果聚合商品
      if ($scope.good.goodsType == 3) {

        if (!skuInfo) {
          alert('请选择商品规格');
          return false;
        } else {
          angular.forEach($scope.checkedProperty, function(item) {
            propertyIds.push(item);
          });
          propertyIds = propertyIds.join('_');
        }
      }


      var options = sourceType == 2 ? {
        goodsId: $scope.good.activityGoodsId,
        sourceType: 2,
        skuId: $scope.skuInfo.activitySkuId,
        distributeType: $scope.skuInfo.distributeType,
        price: $scope.skuInfo.activityPrice,
        propertyIds: ''
      } : {
        goodsId: goodId,
        sourceType: sourceType,
        skuId: $scope.skuInfo.skuId,
        distributeType: $scope.skuInfo.distributeType,
        price: $scope.skuInfo.wapPrice,
        propertyIds: propertyIds
      };


      $scope.good.isPaying = true;

      //执行购买
      //如果是聚合类产品 需要将选中的PropertyIdVal提交给后台
      buyProcessManager(options, type,
          $scope.good.maxNum, $scope.numInCart)
        .then(function(numInCart) {
          //更新numInCart

          $scope.numInCart = numInCart;
          //如果是抢购商品 表示抢购成功
          $scope.good.sourceType == 2 && ($scope.good.killed = true);

        }, function(msg) {
          alert(msg);
          return false;
        }).then(function() {
          $scope.good.isPaying = false;
        });
    };


    //倒计时截止 修改数据状态
    $scope.timecountdown = function(goodId) {
      //如果是活动开始了
      if ($scope.good['killStarted'] === 0) {
        //修改活动状态
        $scope.good['killStarted'] = 1;
        //修改距离开始时间
        $scope.good['beginTime'] = -1;
        //截止时间到期了
      } else if ($scope.good['killStarted'] === 1) {
        $scope.good['killStarted'] = 2;
        $scope.good['buyLeftTime'] = -1;
      }
    };

    //关闭详情页
    $scope.closeDetail = function() {
      xiaomaiMessageNotify.pub('detailGuiManager', 'hide');
    };


  }
]);
