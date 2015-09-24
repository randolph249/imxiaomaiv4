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
      queryCallback && queryCallback(res);
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
    return {
      add: add,
      remove: remove,
      query: query,
      clear: clear,
      store: store,
      readCartCache: readCartCache
    }
  }
])

/**
 *打开详情open/closedetail页面 open/close遮罩
 **/
angular.module('xiaomaiApp').factory("cartDetailGuiMananger", function() {
  var callback;
  //接受命令
  var sub = function(call) {
    callback = call;
  };
  //发送命令
  var pub = function(order) {

    if (!/show|hide/.test(order)) {
      console.log('只接受show和hide两个命令');
      return false;
    }
    callback && angular.isFunction(callback) && callback(order);
  };
  //传输指令&接受指令
  return {
    sub: sub,
    pub: pub,
  }

});


angular.module('xiaomaiApp').directive("cartDetailGui", [
  'cartDetailGuiMananger',
  'maskManager',
  function(cartDetailGuiMananger, maskManager) {
    var link = function($scope, ele, attrs) {

      var activeClass = attrs.activeClass;
      //根据命令显示或者隐藏
      cartDetailGuiMananger.sub(function(order) {

        //打开或者关闭遮罩
        maskManager.pub(order);
        ele[order == 'show' ? 'addClass' : 'removeClass'](activeClass);

      });
    };
    return {
      link: link
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
    return function() {

      var deferred = $q.defer(),
        args = Array.prototype.slice.call(arguments, 0),
        param = args[0] || {},
        type = args[1],
        numInCart = args[2],
        maxNum = args[3];

      //判断当前购买流程 如果正在购买 禁止发生购买行为
      if (lock) {
        deferred.reject('正在添加到购物车,请稍等');
        return deferred.promise;
      }

      if (args.length != 4) {
        deferred.reject('参数缺失!');
        return deferred.promise;
      }



      if (type == 'minus' && numInCart <= 0) {
        deferred.reject('购物该商品已经不存在')
        return deferred.promise;
      }



      if (type == 'plus' && numInCart >= maxNum) {
        deferred.reject('超出库存!');
        return deferred.promise;
      };

      //执行购买

      var eventName = type == 'plus' ? 'add' : 'remove';
      cartManager[eventName](param).then(function() {
        deferred.resolve(type == 'plus' ? (numInCart + 1) : (
          numInCart - 1));
      }, function(msg) {
        deferred.reject(msg);
      })
      return deferred.promise;
    }

  }
]);
