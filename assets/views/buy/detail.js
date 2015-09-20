/**详情页面**/
angular.module('xiaomaiApp').controller('buy.detailCtrl', [
  '$scope',
  '$state',
  'detailManager',
  'xiaomaiService',
  'detailGuiMananger',
  'shopValidate',
  'cartManager',
  'getSkuInfo',
  'skuListToObject',
  function(
    $scope,
    $state,
    detailManager,
    xiaomaiService,
    detailGuiMananger,
    shopValidate,
    cartManager,
    getSkuInfo,
    skuListToObject
  ) {
    var goodId, sourceType;
    //商品ID&来源



    detailManager.invokeDetail(function(id, type) {
      goodId = id;
      sourceType = type;

      //请求详情数据
      loadDetail().then(function(res) {
        $scope.good = res;

        //如果是聚合类产品 生成SkuObject
        if ($scope.good.goodsType == 3) {
          $scope.skuInfo = false;
          $scope.checkedProperties = {};
          $scope.skuObject = createSkukvList($scope.good.skuList);
        } else {
          $scope.skuInfo = $scope.good.skuList[0];
        }

        return true;

      }).then(function() {
        //吊起页面
        detailGuiMananger.pub('show');
      });
    });

    //获取详情信息
    var loadDetail = function() {
      //获取到详情信息 & 同时打开详情页面
      return xiaomaiService.fetchOne('goodDetail', {
        goodsId: goodId,
        sourceType: sourceType
      })
    };

    //将Skulist转成SkuObject
    var createSkukvList = function(skulist) {
      return skuListToObject(skulist);
    }

    //聚合类产品选择产品类型
    $scope.complexCheckProperty = function(key, val) {
      $scope.checkedProperties[key] = val;

      //判断是否组合除了存在的Sku信息
      var skuInfo = getSkuInfo($scope.checkedProperties, $scope.skuObject);
      $scope.skuInfo = skuInfo == false ? false : skuInfo;
    }

    /**
     *添加到购物车或者那个购物中删除
     *先校验是否可以进行添加或者删除
     *然后向后台提交操作请求
     **/
    $scope.buyHandler = function(type) {

      //提交校验规则
      var validlist = {};
      if (type == 'minus') {
        validlist['minCountVali'] = [$scope.skuInfo.numInCart];
      } else if (type == 'plus') {
        validlist['maxCountVali'] = [$scope.skuInfo.numInCart, $scope.good
          .maxNum
        ];
      }


      //如果是聚合商品 必须要提交skuIsExistVali
      if ($scope.good.goodsType == 3) {
        validlist['skuIsExistVali'] = [$scope.checkedProperties, $scope.skuObject];
      }

      //进行校验
      if (!shopValidate(validlist)) {
        return false;
      }

      //如果是抢购的话 先默认抢购成功
      $scope.good.killed = true;
      var eventName = type == 'plus' ? 'add' : 'remove';
      cartManager[eventName]({
        goodsId: goodId,
        sourceType: sourceType,
        skuId: $scope.good.skuList[0].skuId,
        price: $scope.good.skuList[0].wapPrice,
        propertyIds: ''
      }).then(function() {
        $scope.skuInfo['numInCart'] += type == 'plus' ? (+1) : (-1);
      })

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
    }

    //关闭详情页
    $scope.closeDetail = function() {
      detailGuiMananger.pub('hide');
    }
  }
]);


angular.module('xiaomaiApp').factory('getSkuInfo', [function() {
  var reg = /([^&=]+)=([^&=]+)/;
  return function(checkedProperty, skuObject) {
    var skuinfo = false;
    angular.forEach(skuObject, function(sku, keys) {
      var flag = true;
      angular.forEach(keys.split('&'), function(keyvalue) {
        //检查skuObject是否符合要求
        if (!keyvalue.match(reg) || !keyvalue.match(reg).length) {
          flag = false;
          return false;
        };

        var result = keyvalue.match(reg),
          key = result[1],
          value = result[2];

        // 如果checkedProperty没有带过来
        if (!checkedProperty.hasOwnProperty(key)) {
          flag = false;
          return false;
        }

        if (checkedProperty[key] != value) {
          flag = false;
          return false;
        }
      });

      if (flag == true) {
        skuinfo = sku;
      }

    });

    return skuinfo;
  }
}]);
