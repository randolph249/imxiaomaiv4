/**
*将skuList转换成
{
  'pro1=val1&pro2=val2':skuListItem
}
可以供数据查询
**/
angular.module('xiaomaiApp').factory('skuListToObject', function() {
  return function(skuList) {
    var newSkuObject = {};
    angular.forEach(skuList, function(sku, i) {
      var keys = [];

      angular.forEach(sku.skuPropertyList, function(skuProperty,
        j) {
        keys.push(skuProperty['propertyNameId'] + '=' +
          skuProperty['propertyValueId']);
      });

      newSkuObject[keys.join('&')] = sku;
    });
    return newSkuObject;
  }
});

/**
 *购物车管理 添加到购物车 从购物中删除 查询购物车 清空购物车
 **/
angular.module('xiaomaiApp').factory('cartManager', [
  '$q',
  'xiaomaiService',
  'xiaomaiCacheManager',
  function($q, xiaomaiService, xiaomaiCacheManager) {
    //监听最后操作时间
    var updateQueryResult = function(res) {
      xiaomaiCacheManager.writeCache('queryCart', res);
      xiaomaiCacheManager.clean('queryCartDetail');
      queryCallback && queryCallback(res);
      //因为购物车信息更新了 需要重新获取购物车详情信息
    };
    //创建Promise实例
    var createPromise = function() {
      return $q.defer();
    };

    //添加到购物车
    var add = function(param) {
      var deferred = createPromise();
      xiaomaiService.save('addCart', param).then(function(res) {

        updateQueryResult(res);
        deferred.resolve(res);

      }, function(msg) {
        deferred.reject(msg);
      })

      return deferred.promise;
    };
    //从购物中删除
    var remove = function(param) {

      var deferred = createPromise();
      xiaomaiService.save('removeCart', param).then(function(res) {
        updateQueryResult(res);
        deferred.resolve(res);
      }, function(msg) {
        deferred.reject(msg);
      });
      return deferred.promise;
    };
    //生成一个query的Promise实例 允许其他POST操作触发resolve
    var queryCallback;
    var query = function(call) {
      queryCallback = call;

      xiaomaiService.fetchOne('queryCart').then(function(res) {
        queryCallback(res);

        xiaomaiCacheManager.writeCache('queryCart', res);
      }, function(msg) {
        queryCallback('error');
      });
    };
    //保存购物车信息到本地
    var store = function(results) {
      if (results && angular.isObject(results)) {
        xiaomaiCacheManager.writeCache('queryCart', results);
      } else {
        xiaomaiCacheManager.clean('queryCart');
      }
    };
    var readCartCache = function() {
      return xiaomaiCacheManager.readCache('queryCart');
    }
    var clear = function() {

    };
    //读取购物车详情
    var queryCartDetail = function() {

      //读取购物车详情
      var deferred = $q.defer();
      xiaomaiService.fetchOne('queryCartDetail').then(function(res) {
        deferred.resolve(res);

        //写入到缓存中
        xiaomaiCacheManager.writeCache('queryCartDetail', res);
      });

      return deferred.promise;
    };

    //获取当前购物中的数量
    var getnumInCart = function(skuid, sourceType) {
      var detailCarts = [];
      var deferred = $q.defer();
      queryCartDetail().then(function(res) {
        detailCarts = res;
        return detailCarts['goods'];
      }).then(function(carts) {
        var $index = -1;
        //根据skuid从购物车查询对应的sku信息
        angular.forEach(carts, function(item, i) {
          var itemSku = item.skuList[0];
          //sourceType 2是活动商品 1是普通商品
          if (sourceType == 2 && itemSku.activitySkuId ==
            skuid) {
            $index = i;
          } else if (sourceType == 1 && itemSku.skuId == skuid) {
            $index = i;
          }
        });


        //如果从skulist中查询不到 说明购物车没有添加
        deferred.resolve($index == -1 ? 0 : carts[$index]['skuList'][
            0
          ]
          ['numInCart']);

      }, function() {
        deferred.reject(false);
      });

      return deferred.promise;
    };
    return {
      getnumInCart: getnumInCart,
      add: add,
      remove: remove,
      query: query,
      clear: clear,
      store: store,
      readCartCache: readCartCache,
      queryCartDetail: queryCartDetail
    }
  }
]);


//根据选中的条件选取对应的Skull信息
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

/**
 *购买流程
 *列表页 详情页 购物车都可以调用这个服务
 **/

angular.module('xiaomaiApp').factory('buyProcessManager', [
  '$q',
  'cartManager',
  function($q, cartManager) {
    //默认可以购买 添加到购物车过程中 不允许继续操作
    var lock = false;



    /**
     *@param {Object} param 购买提交的参数
     *@param  {string} type 购买操作类型 {minus|plus}
     *@param {Number} numIncart 当前已购买数量
     *@param {Number} maxNum 最大可购买数量
     **/

    var submit = function(type, param) {
      var eventName = type == 'plus' ? 'add' : 'remove';
      return cartManager[eventName](param);
      return deferred.promise;
    };

    return function() {

      var deferred = $q.defer(),
        args = Array.prototype.slice.call(arguments, 0),
        param = args[0] || {},
        type = args[1],
        maxNum = args[2],
        numInCart = args[3]; //可选参数 如果带过来了说明自己有这个参数 不需要从后台去查询
      var skuId = param.skuId;
      var sourceType = param.sourceType;
      var eventName = type == 'plus' ? 'add' : 'remove';


      //判断当前购买流程 如果正在购买 禁止发生购买行为
      if (lock) {
        deferred.reject('正在添加到购物车,请稍等');
        return deferred.promise;
      }


      if (args.length < 3) {
        deferred.reject('参数缺失!');
        return deferred.promise;
      }


      if (type == 'minus' && numInCart <= 0) {
        deferred.reject('该商品已经不存在');
        return deferred.promise;
      }


      //如果传递了numIncart 可以不去购物车详情中查询
      if (angular.isNumber(numInCart)) {

        if (type == 'plus' && numInCart >= maxNum) {
          deferred.reject('该商品购买数量超上限了哦~');
          return deferred.promise;
        }


        //执行提交
        cartManager[eventName](param).then(function() {

          deferred.resolve(type == 'plus' ? (numInCart + 1) : (
            numInCart - 1));
        }, function(msg) {
          deferred.reject(msg);
        });

      } else {
        //根据SkuId去库里查询
        var numIncart = undefined;
        cartManager.getnumInCart(skuId, sourceType).then(function(num) {
          if (angular.isNumber(num) && num < maxNum) {
            numInCart = num;
            return cartManager[eventName](param);
          } else {
            deferred.reject('该商品购买数量超上限了哦');
          }

        }).then(function(res) {

          numIncart = type == 'plus' ? (numIncart + 1) : (numIncart -
            1);

          deferred.resolve(numInCart);
        }, function() {
          deferred.reject('操作失败');
        })
      }

      return deferred.promise;
    }

  }
]);
