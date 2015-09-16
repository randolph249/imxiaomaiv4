/**
 *所有的基础公用服务都放到service.js下面
 **/

/**
 *GET当前开发环境
 **/
angular.module('xiaomaiApp').factory('env', ['$window', function($window) {
  var onlineReg = /h5\.imxiaomai\.com/,
    testReg = /wap\.tmall\.imxiao\.com/,
    host = $window.location.host;

  if (onlineReg.test(host)) {
    return 'online';
  } else if (testReg.test(host)) {
    return 'test';
  } else {
    return 'develop';
  }
}]);

/**
 *获取当前浏览器操作系统/系统版本号/当前浏览器
 **/
angular.module('xiaomaiApp').factory('systemInfo', ['$window', function(
  $window) {
  var UA = $window.navigator.userAgent,
    platform, //操作平台
    version, //手机系统
    browser, //当前浏览器
    model, //手机型号
    androidReg = /(android)\s+([\d\.]+)/i,
    iphoneReg = /(iphone|ipad).+(os\s[\d_]+)/i,
    wechartReg = /micromessenger/,
    result;

  if (UA.match(androidReg) && UA.match(androidReg).length) {
    result = UA.match(androidReg);
    platform = result[1];
    version = UA.match(androidReg)[2];
  } else if (UA.match(iphoneReg) && UA.match(androidReg).length) {
    result = UA.match(iphoneReg);
    platform = result[1];
    version = result[2];
  } else {
    platform = 'unknown';
    version = 'unknown';
  }

  if (wechartReg.test(UA)) {
    browser = 'wechart';
  } else {
    browser = 'other';
  }

  return {
    platform: platform,
    version: version,
    browser: browser
  }
}]);

//获取当前用户网络环境
angular.module('xiaomaiApp').factory('networkType', ['$q', function($q) {
  var deferred = $q.defer();
  wx.getNetworkType({
    fail: function(error) {
      deferred.reject()
      debugger;
    },
    success: function(res) {
      // 返回网络类型2g，3g，4g，wifi
      var networkType = res.networkType;
      deferred.resolve(networkType);
    }
  });
  return deferred.promise;
}]);

/**
 *url拦截器
 *如果是当前环境是线下环境 拦截URL转成对应的JS文件
 **/
angular.module('xiaomaiApp').factory('urlInterceptor', ['env', function(env) {
  var interceptor = function(url) {
    if (env !== 'develop') {
      return url;
    }
    return url + '.json';

  };
  return interceptor;
}]);


//接口列表管理
angular.module('xiaomaiApp').factory('xiaomaimodelManage', function() {
  var urls = {
      'categoryNav': {
        url: '/api/categoryNav',
        type: 'GET'
      }
    },
    getModel = function() {
      var args = Array.prototype.slice.call(arguments, 0),
        name = args[0],
        type = args[1] || 'GET';

      if (urls.hasOwnProperty(name) && urls[name].type === type) {
        return urls[name]['url'];
      } else {
        return false;
      }
    }
  return getModel;
});

/**
 *快速排序
 **/
angular.module('xiaomaiApp').factory('xiaomaiQuicksort', [function() {

  var quicksort = function(sortArr) {
    if (sortArr.length <= 1) {
      return sortArr;
    }

    var args = Array.prototype.slice.call(arguments, 0),
      sortArr = args[0],
      arrType = args[1] || 'number', //快排数据类型 可以是number | object;
      sortKey = args[2]; //如果是object类型 需要快排元素的key值

    var middleIndex = Math.ceil(sortArr.length / 2),
      middleNum = arrType == 'number' ? sortArr[middleIndex] : sortArr[
        middleIndex][sortKey],
      smallerArr = [],
      biggerArr = [];

    $.each(sortArr, function(index, item) {
      var num = arrType === 'number' ? item : item[sortKey];
      //跳过自己
      if (index == middleIndex) {
        return true;
      }

      if (num <= middleNum) {
        smallerArr.push(item);
      } else {
        biggerArr.push(item);
      }
    });

    return quicksort(smallerArr).concat([sortArr[middleIndex]]).concat(
      quicksort(
        biggerArr));
  };
  return quicksort;
}]);

/**
 *接口数据缓存 统一管理
 *不需要经常更新数据 可以存放到xiaomaiInterfaceDataCache
 **/
angular.module('xiaomaiApp').factory('xiaomaiCacheManager', [
  'xiaomaiQuicksort',
  function(xiaomaiQuicksort) {
    var caches = [], //缓存容器
      cacheMaxlen = 10, //缓存数据最大长度
      readCache = function(cachename) {
        var $index = hasCache(cachename);
        if ($index === false) {
          return false;
        }
        //刷新缓存最后更新时间
        caches[$index]['timestamp'] = (+new Date);
        return $.extend({}, caches[$index]['result']);
      },
      hasCache = function(cachename) {
        if (caches.length) {
          return false;
        }

        var $index = -1;

        $.each(caches, function(i, item) {
          if (item.name === cachename) {
            $index = i;
            return false;
          }
        });

        return $index === -1 ? false : $index;
      },
      writeCache = function(cachename, result) {
        //如果caches长度为0 直接写入
        var sameCacheIndex = hasCache(cachename);
        //如果存在同名缓存
        if (sameCacheIndex !== false) {
          caches[sameCacheIndex] = {
            name: cachename,
            result: result,
            timestamp: +new Date
          };
          //如果缓存长度超出最大限制
        } else if (caches.length == cacheMaxlen) {
          //删除最久的数据缓存
        } else {
          caches.push({
            name: cachename,
            result: result,
            timestamp: +new Date
          })
        }
      };

    return {
      readCache: readCache,
      writeCache: writeCache
    }
  }
]);

/**
 *提供ajax服务
 **/
angular.module('xiaomaiApp').factory('xiaomaiService', [
  '$q',
  'urlInterceptor',
  'xiaomaimodelManage',
  '$http',
  'xiaomaiCacheManager',
  function(
    $q,
    urlInterceptor,
    xiaomaimodelManage,
    $http,
    xiaomaiCacheManager
  ) {

    //验证接口是否存在
    var getUrl = function(name, type) {
        var url = xiaomaimodelManage(name, type);
        return url;
      },
      //处理返回结果
      handlerResult = function(deferred, res) {

      },
      //生成Promise实例
      createPromise = function() {
        return $q.defer();
      },
      /**
       *@请求后台数据
       *@params {String} name 接口名，对应的接口地址在modelManager中定义
       *@params {Object} [params] 请求参数
       *@params {Boolean} isCached 是否读取缓存
       **/
      fetchOne = function(name, params, isCached) {
        var deferred = createPromise();

        var args = Array.prototype.slice.call(arguments, 0),
          name = args[0],
          params = {},
          isCached = false,
          url;

        if ($.type(args[1]) == 'object') {
          params = args[1];
        } else if ($.type(args[1] == 'boolean')) {
          isCached = args[1];
        }

        if ($.type(args[2]) == 'boolean') {
          isCached = args[2]
        }

        //判断接口是否已经在modelManager中定义
        url = getUrl(name, 'GET');
        //如果当前开发环境是线下环境 将接口转成本地文件地址
        url = urlInterceptor(url);
        if (!url) {
          deferred.reject({
            type: 'notFound',
            msg: '接口错误或接口请求方式错误'
          });
          return deferred.promise;
        }

        var cache = xiaomaiCacheManager.readCache(name);
        //如果要求读取缓存同时缓存存在就从缓存中读取
        if (isCached && cache !== false) {
          deferred.resolve(cache);
        } else {
          //向后台发送请求
          $http({
            url: url,
            method: 'GET',
            params: params
          }).success(function(res) {
            //写入缓存
            isCached && xiaomaiCacheManager.writeCache(name, res);
            deferred.resolve(res);
          }).error(function(res) {
            deferred.reject({
              type: 'error',
              msg: '接口请求错误'
            });
          });
        }
        return deferred.promise;
      },
      //无顺序全部获取
      fetchAll = function() {

      },
      //按需全部获取
      fetchOrder = function() {

      },
      /**
       *@向后台提交操作
       *@param {String} name 接口名称 在modelManager中定义
       *@param {Object} name 响应操作
       **/
      save = function(name, params) {
        var deferred = createPromise();

        //判断接口是否已经在modelManager中定义
        url = getUrl(name, 'GET');
        //如果当前开发环境是线下环境 将接口转成本地文件地址
        url = urlInterceptor(url);
        if (!url) {
          deferred.reject({
            type: 'notFound',
            msg: '接口错误或接口请求方式错误'
          });
          return deferred.promise;
        }

        $http({
          url: url,
          method: 'POST',
          data: params
        }).success(function(res) {
          deferred.resolve(res);
        }).error(function() {
          deferred.reject({
            type: 'error',
            msg: '接口请求错误'
          });
        });
        return deferred.promise;
      };

    return {
      fetchOne: fetchOne,
      fetchAll: fetchAll,
      fetchOrder: fetchOrder,
      save: save
    };
  }
]);

/**
 *cookie信息管理
 **/
angular.module('xiaomaiApp').factory('cookieManager', [function() {

}]);
