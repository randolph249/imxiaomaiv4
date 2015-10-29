//判断是否是空对象
angular.module('xiaomaiApp').factory('isEmptyObject', function() {
  return function(obj) {
    if (angular.isFunction(Object.keys)) {
      return Object.keys(obj).length == 0;
    }
    var keys = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  }
});

/**
 *订单管理
 **/
angular.module('xiaomaiApp').factory('orderManager', [
  'xiaomaiService',
  'ipCookie',
  '$q',
  'isEmptyObject',
  'schoolManager',
  '$q',
  function(xiaomaiService, ipCookie, $q, isEmptyObject, schoolManager, $q) {
    var orderInfo = {};
    //创建订单
    //先去查询本地是否存在订单信息 如果存在直接返回订单信息 避免重复创建订单
    //如果不存在 创建订单
    var createOrder = function() {
      var deferred = $q.defer();
      //如果存在于缓存中(代表没有关闭页面)
      if (!isEmptyObject(orderInfo)) {
        deferred.resolve();
        return deferred.promise;
      }

      //如果存在于Cookie中
      //根据Cookie中的orderId和userId去查询refer接口
      if (ipCookie('xiaomaiv4_order') && !isEmptyObject(ipCookie('xiaomaiv4_order'))) {

        deferred.resolve();
        return deferred.promise;
      }

      //创建订单
      xiaomaiService.save('createOrder').then(function(res) {

        orderInfo = angular.extend({}, res.orderInfo);
        deferred.resolve();
        //创建缓存
        //设置Cookie的失效时间15min
        ipCookie('xiaomaiv4_order', {
          userId: orderInfo.order.userId,
          orderId: orderInfo.order.orderId,
          limitTime: orderInfo.limitTime,
          createTime: +new Date
        }, {
          expirationUnit: 'minutes',
          expires: orderInfo.limitTime
        });
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };


    //删除本地订单信息
    //表示支付完成或者要求重新下单
    //监听购物车
    //购物车出现任何变更 删除本地订单
    //支付完成 删除本地订单
    //支付失败 手动删除本地订单
    //订单超时删除订单
    var deleteOrder = function() {
      ipCookie.remove('xiaomaiv4_order');
      orderInfo = {};
    };

    //Cookie中订单信息仅仅缓存orderId和UserId
    //如果重新大开页面 根据这两个ID去获取订单信息
    var queue = [];
    var queryLock = false;
    //处理订单查询请求
    var queryOrder = function(deferred) {
      //上锁
      queryLock = true;
      if (!isEmptyObject(orderInfo)) {
        deferred.resolve(orderInfo);
        queryLock = false;
        //处理队列中的其他请求
        queue.length && queryOrder(queue.shift());
        return false
      };

      var collegeId,
        userId = getUserId(),
        orderId = getOrderId();

      //如果订单已经不存在
      if (!userId || !getOrderId) {
        deferred.reject();
        //处理队列中的其他请求
        queue.length && queryOrder(queue.shift());
        return false;
      }

      schoolManager.get().then(function(res) {
        collegeId = res.collegeId;
        return xiaomaiService.fetchOne('queryOrder', {
          userId: userId,
          orderId: orderId,
          collegeId: collegeId
        });
      }).then(function(res) {
        orderInfo = res;
        //解锁
        queryLock = false;
        deferred.resolve(res);
        //处理队列中的其他请求
        queue.length && queryOrder(queue.shift());
      });
    };

    //查询订单状态 查看订单是否失效
    var queryOrderStatus = function() {
      var userId = getUserId();
      if (userId === false) {
        return false;
      }
      return true;
    };

    //获取订单详情
    var getOrder = function() {
      var deferred = $q.defer();
      if (queryLock) {
        queue.push(deferred);
      } else {
        queryOrder(deferred);
      }

      return deferred.promise;
    };

    //获取userId信息
    var getUserId = function() {
      var caches = ipCookie('xiaomaiv4_order');
      return angular.isObject(caches) ? caches['userId'] : false;
    };

    //获取orderId信息
    var getOrderId = function() {
      var caches = ipCookie('xiaomaiv4_order');
      return angular.isObject(caches) ? caches['orderId'] : false;
    };


    //获取剩余时间
    var getRemaintime = function() {
      return queryOrderStatus() ? {
        createTime: ipCookie('xiaomaiv4_order')['createTime'],
        limitTime: ipCookie('xiaomaiv4_order')['limitTime']
      } : {
        createTime: 0,
        limitTime: 0
      };
    };


    //获取订单中的相关信息
    var getOrderInfo = function(querystring) {
      var deferred = $q.defer();
      getOrder().then(function(res) {

        try {
          deferred.resolve(eval('res.' + querystring));
        } catch (e) {
          deferred.reject();
        }
      });
      return deferred.promise;
    }

    return {
      createOrder: createOrder,
      getOrderInfo: getOrderInfo,
      getUserId: getUserId,
      getRemaintime: getRemaintime,
      deleteOrder: deleteOrder,
      queryOrderStatus: queryOrderStatus
    }
  }
]);

//获取收货地址信息
//收货地址可以直接返回默认地址
//也可以根据addrId返回地址信息
angular.module('xiaomaiApp').factory('addrMananger', [
  'orderManager',
  'isEmptyObject',
  '$q',
  function(orderManager, isEmptyObject, $q) {
    var addrInfo = {};
    var getAddr = function() {
      var deferred = $q.defer();
      if (!isEmptyObject(addrInfo)) {
        deferred.resolve(addrInfo)
        return deferred.promise;
      }

      orderManager.getOrderInfo('defaultUserAddr').then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    };
    var setAddr = function(info) {
      addrInfo = info;
    };
    return {
      getAddr: getAddr,
      setAddr: setAddr
    }
  }
]);
