/**详情页面**/
angular.module('xiaomaiApp').controller('buy.detailCtrl', [
  '$scope',
  '$state',
  'detailManager',
  'xiaomaiService',
  'detailGuiMananger',
<<<<<<< HEAD
  'getSkuInfo',
  'skuListToObject',
  'buyProcessManager',
=======
  'shopValidate',
  'cartManager',
  'getSkuInfo',
  'skuListToObject',
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
  function(
    $scope,
    $state,
    detailManager,
    xiaomaiService,
    detailGuiMananger,
<<<<<<< HEAD
    getSkuInfo,
    skuListToObject,
    buyProcessManager
  ) {
    var goodId, sourceType;

    //商品ID&来源
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      // debugger;
      // debugger;
      if (toParam.showDetail == "true") {

        loadDetail().then(function(res) {
          $scope.good = res;
          goodId = toParam.goodId;
          sourceType = toParam.sourceType;

          //如果是聚合类产品 生成SkuObject
          //创建一个skuInfo 聚合类如果选出了一个存在的商品 就生成一个skunInfo
          //非聚合类默认有一个SkuInfo
          if ($scope.good.goodsType == 3) {
            $scope.skuInfo = false;
            $scope.checkedProperties = {};
            $scope.skuObject = createSkukvList($scope.good.skuList);
          } else {
            $scope.skuInfo = $scope.good.skuList[0];
          }
          detailGuiMananger.pub('show');

        });
      } else if (toParam.showDetail == "false") {
        detailGuiMananger.pub('hide');
      }
    });



    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState,
      fromParam) {
      if (toParam.showDetail != fromParam.showDetail) {
        console.log(+new Date);

        console.log('param date:' + fromParam.r);
        console.log('new Param date:' + toParam.r)
      }
    })

    //获取详情信息
    var loadDetail = function(goodId, sourceType) {
=======
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
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
      //获取到详情信息 & 同时打开详情页面
      return xiaomaiService.fetchOne('goodDetail', {
        goodsId: goodId,
        sourceType: sourceType
      })
    };

<<<<<<< HEAD
    //将Skulist转成以存在的PropertyId=PropertyVal为key的SkuObject
    var createSkukvList = function(skulist) {
      return skuListToObject(skulist);
    };
=======
    //将Skulist转成SkuObject
    var createSkukvList = function(skulist) {
      return skuListToObject(skulist);
    }
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3

    //聚合类产品选择产品类型
    $scope.complexCheckProperty = function(key, val) {
      $scope.checkedProperties[key] = val;

<<<<<<< HEAD
      //判断是否组合出了存在的Sku信息
      var skuInfo = getSkuInfo($scope.checkedProperties, $scope.skuObject);
      $scope.skuInfo = skuInfo == false ? false : skuInfo;
    };
=======
      //判断是否组合除了存在的Sku信息
      var skuInfo = getSkuInfo($scope.checkedProperties, $scope.skuObject);
      $scope.skuInfo = skuInfo == false ? false : skuInfo;
    }
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3

    /**
     *添加到购物车或者那个购物中删除
     *先校验是否可以进行添加或者删除
     *然后向后台提交操作请求
     **/
    $scope.buyHandler = function(type) {

<<<<<<< HEAD

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


      //执行购买
      //如果是聚合类产品 需要将选中的PropertyIdVal提交给后台
      buyProcessManager({
            goodsId: goodId,
            sourceType: sourceType,
            skuId: $scope.skuInfo.skuId,
            distributeType: $scope.skuInfo.distributeType,
            price: $scope.skuInfo.wapPrice,
            propertyIds: propertyIds
          }, type, $scope.skuInfo.numInCart,
          $scope.good.maxNum)
        .then(function(numIncart) {
          //更新numInCart
          $scope.skuInfo['numInCart'] = numIncart;
          //如果是抢购商品 表示抢购成功
          $scope.good.sourceType == 2 && ($scope.good.killed = true);

        }, function(msg) {
          alert(msg);
          return false;
        });
=======
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

>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
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
<<<<<<< HEAD
    };

    //关闭详情页
    $scope.closeDetail = function() {
      $state.go($state.current.name, {
        showDetail: false,
        r: (+new Date)
      });
    };


  }
]);
=======
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
>>>>>>> 3500292a18e69e97540c436ba4422bc703c8d0a3
