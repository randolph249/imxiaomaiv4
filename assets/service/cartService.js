//校验是否可以购买/删除购买
//总共有三条校验规则
//第一条购买数量！=0
//第二条购买数量超过最大库存
//第三条是聚合类产品是否存在
angular.module('xiaomaiApp').factory('shopValidate', ['getSkuInfo', function(
  getSkuInfo) {

  /**
   *@param {String} type 购买操作类型 {plus | minus}
   *@param {Number} curgoodCount 当前购买的数量
   *@param {Number} 最大可购买数量
   **/
  var validMethods = {
    minCountVali: function(count) {
      if (count <= 0) {
        alert('数量不能为0');
        return false;
      }
      return true;
    },
    maxCountVali: function(count, maxNum) {
      if (count >= maxNum) {
        alert('超出库存');
        return false;
      }
      return true;;
    },
    /**
     *@param {Object} checkedProperty 当前选中的属性
     *example:
     *{'1001':'2002','1002','2003'}
     *@param {Object} skuObject sku集合
     *example:
     *{'1001=2002&1002=2003&1003=2004':{.....}}
     **/
    skuIsExistVali: function(checkedProperty, skuObject) {
      if (!getSkuInfo(checkedProperty, skuObject)) {
        alert('请选择商品');
        return false;
      }
      return true;
    }
  };
  return function(validlist) {

    var flag = true;
    angular.forEach(validlist, function(args, key) {

      //先检查校验规则是否存在 如果不存在直接返回false
      if (!validMethods.hasOwnProperty(key)) {
        flag = false;
        return false;
      }

      //没有传参 直接返回false
      if (!angular.isArray(args) || !args.length) {
        flag = false;
        return false;
      }

      var method = validMethods[key];

      if (!method.apply({}, args)) {
        flag = false;
        return false;
      }

    });

    return flag;
  }
}]);


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
  function($q, xiaomaiService) {
    //监听最后操作时间
    var updateQueryResult = function(res) {
      queryCallback && queryCallback(res.data);
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
      //默认执行一次自查询
      xiaomaiService.fetchOne('queryCart').then(function(res) {
        // debugger;
        queryCallback(res);
      }, function(msg) {
        queryCallback('error');
      });
    };
    var clear = function() {

    };
    return {
      add: add,
      remove: remove,
      query: query,
      clear: clear
    }
  }
])
