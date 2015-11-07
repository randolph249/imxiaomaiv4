/**
 *所有的接口信息都在这里配置管理
 *GET请求可以配置三条信息
 *URL地址
 *请求method
 *GET请求是否可以缓存 默认true
 **/
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
      //保存学校信息
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
        type: 'GET',
        canstore: false
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
      //类目下的banner
      'categoryBanners': {
        type: 'GET',
        url: '/wap/category/banners'
      },
      //普通类目下产品
      'goods': {
        url: '/wap/category/goods',
        type: 'GET',
        canstore: false
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
      //清空购物车
      'emptyCart': {
        url: '/wap/cart/delete',
        type: 'POST'
      },
      //新版本学校白名单
      'whitelist': {
        type: 'GET',
        url: '/wap/college/whitelist'
      },
      //添加到购物车
      'addCart': {
        url: '/wap/cart/add',
        type: 'POST'
      },
      //查询购物车
      'queryCart': {
        url: '/wap/cart/sync',
        type: 'GET',
        canstore: false
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
      //获取微信配置
      "getWxConfig": {
        url: "/wap/getWxConfig",
        type: "GET"
      },
      //提交反馈
      "feedback": {
        url: "/wap/feedback/detail",
        type: "POST"
      },
      //日志统计
      "log": {
        // url: "/wap/log",
        url: "http://logger.imxiaomai.com/client/event",
        type: "GET"
      },
      //搜索结果页
      "searchresult": {
        url: "/wap/goods/search",
        type: "GET"
      },
      //搜索提示
      "searchsuggest": {
        url: "/wap/goods/suggest",
        type: "GET"
      },
      //发送验证码
      "sendCode": {
        url: "/wap/userBind/sendCode",
        type: "POST"
      },
      //用户绑定信息
      "bindUser": {
        url: "/wap/userBind/bind",
        type: "POST"
      },
      //验证用户登录状态
      "checkUser": {
        url: "/wap/userBind/check",
        type: "POST"
      },
      //获取用户收货地址列表
      "addrList": {
        url: "/wap/useraddr/query",
        type: "GET"
      },
      //删除某条用户收货地址信息
      "addrDel": {
        url: "/wap/useraddr/delete",
        type: "GET" //?
      },
      //查询某条用户收货地址信息
      "getAddr": {
        url: "/wap/useraddr/get",
        type: "GET"
      },
      //更新某条用户收货地址信息
      "setAddr": {
        url: "/wap/useraddr/set",
        type: "POST"
      },
      //新增一套用户收货地址信息
      "addAddr": {
        url: "/wap/useraddr/add",
        type: "POST"
      },
      //创建订单
      "createOrder": {
        url: "/wap/order/createOrder",
        type: 'POST'
      },
      //获取订单
      "queryReferOrder": {
        url: "/wap/order/refer",
        type: "GET"
      },
      //微信授权初始化
      "userAuth": {
        url: "/wap/userBind/auth",
        type: "GET"
      },
      //订单确认提交
      "confirmOrder": {
        url: "/wap/order/confirm",
        type: "POST"
      },
      //订单查询
      "queryOrder": {
        url: "/wap/order/query",
        type: "GET"
      },
      //支付状态校验
      "payStatusCheck": {
        url: "/wap/order/pay/check",
        type: "POST"
      },
      //送货时间表
      "ldcDeliveryTime": {
        url: "/wap/get/ldc/deliveryTime",
        type: "GET"
      },
      //用户中心
      "usercenter": {
        url: "/wap/usercenter/index",
        type: "GET"
      },
      //模板多商品活动
      'complexGoods': {
        url: '/wap/activity/popularGoods',
        type: 'GET'
      },
      //模板单商品活动
      'singleGoods': {
        url: '/wap/activity/brandGoods',
        type: 'GET'
      }
    },

    getModel = function() {
      var args = Array.prototype.slice.call(arguments, 0),
        name = args[0],
        type = args[1] || 'GET';

      if (urls.hasOwnProperty(name) && urls[name].type === type) {
        return urls[name];
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

  };
  return interceptor;
}]);

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
  '$timeout',
  function(
    env,
    $q,
    urlInterceptor,
    xiaomaimodelManage,
    $http,
    xiaomaiCacheManager,
    getDataType,
    httpRequstParam,
    $timeout
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
      fetchQueue = {},
      handlerQueue = function(name, errorObj) {

        if (fetchQueue[name]['queue'].length) {
          var queueItem = fetchQueue[name]['queue'].shift();
          fetchQueue[name]['lock'] = true;
          //如果第一个接口返回错误信息 其他接口也就不用在继续请求了
          //直接返回错误信息
          if (angular.isObject(errorObj)) {
            queueItem.deferred.reject(errorObj);
            handlerQueue(name, errorObj);
          } else {
            fetchQuery(queueItem.deferred, queueItem.name, queueItem.params);
          }
        } else {
          delete fetchQueue[name];
        }
      },
      fetchQuery = function(deferred, name, params) {
        var urlModel = xiaomaimodelManage(name, 'GET'),
          url, canstore, cacheResult, errorObj;
        if (urlModel === false) {
          errorObj = {
            code: '404',
            msg: '接口请求错误'
          };
          deferred.reject(errorObj);
          handlerQueue(name, errorObj);
          return false;
        }


        url = urlInterceptor(urlModel['url']);
        canstore = urlModel['canstore'] !== false;

        //从页面缓存中查找
        cacheResult = xiaomaiCacheManager.readCache(name, params);
        if (canstore && cacheResult) {
          deferred.resolve(cacheResult);
          handlerQueue(name);
          return false;
        }


        //向后台发送请求
        $http({
          url: url,
          method: 'GET',
          params: angular.extend({
            redirect: 'mall',
            v: Math.random().toString().replace('.', '')
          }, params)
        }).success(function(res) {
          //如果返回结果有异常 reject
          if (handlerResult(res) === false) {
            errorObj = res;
            deferred.reject(res);
          } else {
            //写入缓存
            errorObj = false;
            canstore && xiaomaiCacheManager.writeCache(name, res.data, params);
            deferred.resolve(res.hasOwnProperty('data') ? res.data : res);

          }
        }).error(function(res) {
          errorObj = {
            code: '503',
            msg: '接口异常'
          }
          deferred.reject(errorObj);
        }).finally(function() {
          fetchQueue[name]['lock'] = false;
          handlerQueue(name, errorObj);
        });
      },
      /**
       *@请求后台数据
       *@params {String} name 接口名，对应的接口地址在modelManager中定义
       *@params {Object} [params] 请求参数
       *@params {Boolean} isCached 是否读取缓存
       **/

      fetchOne = function(name) {
        var deferred = $q.defer();
        var args = Array.prototype.slice.call(arguments, 0),
          name = args[0],
          params = {},
          urlModel,
          url,
          canstore; //是否使用缓存数据

        if (getDataType(args[1]) == 'object') {
          params = args[1];
        }

        //如果相同的请求同时发送过来 处理第一个请求 同时将其他请求打到待处理队列中
        if (fetchQueue.hasOwnProperty(name) && fetchQueue[name].lock == true) {
          fetchQueue[name].queue.push({
            deferred: deferred,
            name: name,
            params: params
          });
        } else {
          fetchQueue[name] = {
            lock: true,
            queue: []
          };
          fetchQuery(deferred, name, params);
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
       *@param isForm 因为后台POST接口不太一致 所以手动设置提交方式
       **/
      save = function(name, params, isJSON) {
        var deferred = $q.defer();
        var urlModel, url;

        //判断接口是否已经在modelManager中定义
        urlModel = getUrl(name, 'POST');
        //如果当前开发环境是线下环境 将接口转成本地文件地址
        if (!urlModel) {
          deferred.reject({
            code: '404',
            msg: '接口错误或接口请求方式错误'
          });
          return deferred.promise;
        }

        url = urlInterceptor(urlModel['url']);

        var defaulOptions = env == 'develop' ? {
          method: 'GET',
          params: params
        } : {
          method: 'POST',
          data: isJSON ? params : httpRequstParam(params)
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
            deferred.reject(res);
          }
        }).error(function() {
          deferred.reject({
            msg: '接口异常'
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
