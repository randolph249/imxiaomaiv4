/**
 *快速排序
 *排序结果 从小到大
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
      cacheMaxlen = 20, //缓存数据最大长度
      readCache = function(cachename, params) {

        var $index = hasCache(cachename);
        if ($index === false) {
          return false;
        }
        //如果传递了缓存参数 逐个比较参数 有一个return  false
        if (params && angular.isObject(params) && angular.isObject(caches[
            $index]['params'])) {
          var flag = true;
          angular.forEach(params, function(param, key) {
            if (param != caches[$index]['params'][key]) {
              flag = false;
            }
          });

          if (flag == false) {
            return false;
          }
        }

        //刷新缓存最后更新时间
        return angular.extend({}, caches[$index]['result']);
      },
      hasCache = function(cachename) {
        if (!caches.length) {
          return false;
        }

        var $index = -1;

        angular.forEach(caches, function(item, i) {
          if (item.name === cachename) {
            $index = i;
            return false;
          }
        });

        return $index === -1 ? false : $index;
      },
      writeCache = function(cachename, result, params) {
        //如果caches长度为0 直接写入
        var sameCacheIndex = hasCache(cachename);
        //如果存在同名缓存
        if (sameCacheIndex !== false) {

          var cache = caches.splice(sameCacheIndex, 1)[0];

          caches.push({
            name: cachename,
            result: result,
            params: params
          });
          return false;
          //如果缓存长度超出最大限制
        }


        //如果缓存满了 经过排序之后删除时间最长的缓存(第一个元素)
        if (caches.length == cacheMaxlen) {
          caches.shift();
        }

        //插入新元素
        caches.push({
          name: cachename,
          result: result,
          params: params
        });

      },
      clean = function(cachename) {
        //如果caches长度为0 直接写入
        var sameCacheIndex = hasCache(cachename);
        //如果存在同名缓存
        if (sameCacheIndex !== false) {
          caches.splice(sameCacheIndex, 1);
        }
      };

    return {
      readCache: readCache,
      writeCache: writeCache,
      clean: clean
    }
  }
]);
