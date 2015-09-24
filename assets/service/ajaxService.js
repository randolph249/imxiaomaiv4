//接口列表管理
angular.module('xiaomaiApp').factory('xiaomaimodelManage', function() {
  var urls = {
      //导航
      'navgatorlist': {
        url: '/wap/navigate/index',
        type: 'GET'
      },
      //根据定位获取定位学校结果
      'locate': {
        url: '/wap/college/locate',
        type: 'GET'
      },
      //获取所有的城市列表
      'citylist': {
        url: '/wap/geography/cities',
        type: 'GET'
      },
      //获取城市下所有的学校列表
      'collegelist': {
        url: '/wap/geography/colleges',
        type: 'GET'
      },
      //获取用户的学校信息
      'getSchool': {
        url: '/wap/college/detail',
        type: 'GET'
      },
      'saveSchool': {
        url: '/wap/college/detail',
        type: 'POST'
      },
      //获取活动列表
      'activities': {
        url: '/wap/college/activities',
        type: 'GET'
      },
      //普通活动下的商品列表
      'activeGoods': {
        url: '/wap/activity/goods',
        type: 'GET'
      },
      //活动页面的Banner
      'activeBanner': {
        url: '/wap/activity/banners',
        type: 'GET'
      },
      //热门榜产品
      'categoryGoods': {
        url: '/wap/index/categoryGoods',
        type: 'GET'
      },
      //普通类目下产品
      'goods': {
        url: '/wap/category/goods',
        type: 'GET'
      },
      //产品详情
      'goodDetail': {
        url: '/wap/goods/detail',
        type: 'GET'
      },
      //删除购物车
      'removeCart': {
        url: '/wap/cart/remove',
        type: 'POST'
      },
      //添加到购物车
      'addCart': {
        url: '/wap/cart/add',
        type: 'POST'
      },
      //查询购物车
      'queryCart': {
        url: '/wap/cart/sync',
        type: 'GET'
      },
      //购物车详情
      'queryCartDetail': {
        url: '/wap/cart/get',
        type: 'GET'
      },
      //查看我的优惠劵
      'mycoupon': {
        url: '/couponwap/myCouponList',
        type: 'GET'
      },
      "getWxConfig": {
        url: "/wap/getWxConfig",
        type: "GET"
      },
      "feedback": {
        url: "/wap/feedback/detail",
        type: "POST"
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
 *url拦截器
 *如果是当前环境是线下环境 拦截URL转成对应的JS文件
 **/
angular.module('xiaomaiApp').factory('urlInterceptor', ['env', function(env) {
  var interceptor = function(url) {
    if (env !== 'develop') {
      return url;
    }
    return '/api' + url + '.json';
    return url + '.json';

  };
  return interceptor;
}]);



//销毁页面数据管理
//在当前$scope被销毁之前可以保存销毁数据 当页面回退到销毁页面的时候 可以直接读取销毁数据
//不需要再次向后台去做请求
angular.module('xiaomaiApp').factory('destoryDataManager', [
  'xiaomaiCacheManager',
  function(xiaomaiCacheManager) {
    //从整体缓存中读取销毁数据的缓存
    /**
     *@param {String} router 当前页面的路由
     *这个路由要和已经缓存的路由name进行比对
     *如果不一致 说明缓存的不是同一个页面数据 把之前的缓存全部删掉 重新缓存
     *如果一致 只需要在这个缓存上继续添加
     *@param {name} 自定义数据Key
     **/
    var write = function(router, name, obj) {

        var destoryCaches = xiaomaiCacheManager.readCache(
          'beforeDestoryPageData');

        if (!destoryCaches || destoryCaches['router'] != router) {
          destoryCaches = {
            router: router,
            data: {}
          };
        }

        destoryCaches.data[name] = obj;
        //写入缓存
        xiaomaiCacheManager.writeCache('beforeDestoryPageData',
          destoryCaches);

      },
      read = function(name) {
        var destoryCaches = xiaomaiCacheManager.readCache(
          'beforeDestoryPageData');
        if (!destoryCaches) {
          return false;
        }

        return destoryCaches['data'][name] ||
          false;
      };

    return {
      read: read,
      write: write
    }
  }
]);


/**
 *提供ajax服务
 **/
angular.module('xiaomaiApp').factory('xiaomaiService', [
  'env',
  '$q',
  'urlInterceptor',
  'xiaomaimodelManage',
  '$http',
  'xiaomaiCacheManager',
  'getDataType',
  'httpRequstParam',
  function(
    env,
    $q,
    urlInterceptor,
    xiaomaimodelManage,
    $http,
    xiaomaiCacheManager,
    getDataType,
    httpRequstParam
  ) {

    //验证接口是否存在
    var getUrl = function(name, type) {
        var url = xiaomaimodelManage(name, type);
        return url;
      },
      //处理返回结果
      handlerResult = function(res) {
        //如果返回码错误 或者返回data不存在
        if (res.code != 0 || !res.data) {
          return false;
        }
        if (getDataType(res.data) == 'number' && !res.data.length) {
          return false;
        }
        if (getDataType(res.data) == 'object' && !Object.keys(res.data).length) {
          return false;
        }
        return res.data;
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
      fetchOne = function(name) {
        var deferred = createPromise();

        var args = Array.prototype.slice.call(arguments, 0),
          name = args[0],
          params = {},
          url;

        if (getDataType(args[1]) == 'object') {
          params = args[1];
        }


        //判断接口是否已经在modelManager中定义
        url = getUrl(name, 'GET');
        //如果当前开发环境是线下环境 将接口转成本地文件地址
        url = urlInterceptor(url);
        if (!url) {
          deferred.reject('接口错误或接口请求方式错误');
          return deferred.promise;
        }

        //从页面缓存中查找
        if (xiaomaiCacheManager.readCache(name)) {
          deferred.resolve(xiaomaiCacheManager.readCache(name));
          return deferred.promise;
        }

        //向后台发送请求
        $http({
          url: url,
          method: 'GET',
          params: angular.extend({
            v: Math.random().toString().replace(/\./, '')
          }, params)
        }).success(function(res) {
          //如果返回结果有异常 reject
          if (handlerResult(res) === false) {
            deferred.reject(res.msg);
          } else {
            //写入缓存
            deferred.resolve(res.data);
          }

        }).error(function(res) {
          deferred.reject('接口请求错误');
        });

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
        url = getUrl(name, 'POST');
        //如果当前开发环境是线下环境 将接口转成本地文件地址
        url = urlInterceptor(url);
        if (!url) {
          deferred.reject('接口错误或接口请求方式错误');
          return deferred.promise;
        }


        var defaulOptions = env == 'develop' ? {
          method: 'GET',
          params: params
        } : {
          method: 'POST',
          data: httpRequstParam(params)
        };


        $http(angular.extend(defaulOptions, {
          url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        })).success(function(res) {


          if (res.code == 0) {
            deferred.resolve(res.data);
          } else {
            deferred.reject(res.msg);
          }
        }).error(function() {

          deferred.reject('接口异常');
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

//JSON转换成KV字符串
angular.module('xiaomaiApp').factory('httpRequstParam', [function() {

  var param = function(obj) {
    var query = '';
    var name, value, fullSubName, subName, subValue, innerObj, i;


    for (name in obj) {
      value = obj[name];


      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {


          subValue = value[subName];
          if (subValue != null) {
            // fullSubName = name + '[' + subName + ']';
            //user.userName = hmm & user.userPassword = 111
            fullSubName = name + '.' + subName;
            // fullSubName =  subName;
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
      } else if (value !== undefined) //&& value !== null
      {
        query += encodeURIComponent(name) + '=' +
          encodeURIComponent(value) + '&';
      }
    }


    return query.length ? query.substr(0, query.length - 1) :
      query;
  };

  return param;


}])
