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
        ipCookie('xiaomaiv4_order', {
          userId: orderInfo.order.userId,
          orderId: orderInfo.order.orderId
        });
      });

      return deferred.promise;
    };

    //错误状态处理
    var errorHandler = function() {};

    //删除本地订单信息
    //表示支付完成或者要求重新下单
    //监听购物车
    //购物车出现任何变更 删除本地订单
    //支付完成 删除本地订单
    //支付失败 手动删除本地订单
    var deleteOrder = function() {

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
      return ipCookie('xiaomaiv4_order')['userId'];
    };

    //获取orderId信息
    var getOrderId = function() {
      return ipCookie('xiaomaiv4_order')['orderId'];
    };

    //获取ldc订单
    var getLdcOrder = function() {
      var ldcOrder = {};
      var deferred = $q.defer();
      getOrder().then(function(res) {
        var totalOrderList = res.order.childOrderList;
        angular.forEach(totalOrderList, function(item) {
          if (item.distributeType == 1) {
            ldcOrder = item;
          }
        });
        deferred[isEmptyObject(ldcOrder) ? 'reject' : 'resolve'](ldcOrder);

      });
      return deferred.promise;
    };

    //获取RDC订单
    var getRdcOrder = function() {
      var rdcOrder = [];
      var deferred = $q.defer();
      getOrder().then(function(res) {
        var totalOrderList = res.order.childOrderList;
        angular.forEach(totalOrderList, function(item) {
          if (item.distributeType == 0) {
            rdcOrder = item;
          }
        });
        deferred[isEmptyObject(rdcOrder) ? 'reject' : 'resolve'](rdcOrder);
      });
      return deferred.promise;
    };


    //获取第三方订单
    var getThirdOrder = function() {
      var thirdOrder = [];
      var deferred = $q.defer();
      getOrder().then(function(res) {
        var thirdOrder = res.order.thirdChildOrderList;

        deferred[!thirdOrder || isEmptyObject(thirdOrder) ? 'reject' : 'resolve']({
          thirdChildOrderList: thirdOrder,
          thirdFreight: res.order.thirdFreight,
          thirdFreightSub: res.order.thirdFreightSub
        });
      });
      return deferred.promise;
    };

    //获取剩余时间
    var getRemaintime = function() {};

    //获取订单信息中默认订单地址信息
    var getDefaultAddr = function() {
      var deferred = $q.defer();
      getOrder().then(function(res) {
        deferred.resolve(res.defaultUserAddr);
      });
      return deferred.promise;
    }

    //返回给当前学校的物流信息
    var getLogistics = function() {
      var deferred = $q.defer();
      getOrder().then(function(res) {
        deferred.resolve(res.college);
      });
      return deferred.promise;
    }


    return {
      createOrder: createOrder,
      getAddrInfo: getDefaultAddr,
      getUserId: getUserId,
      getLdcOrder: getLdcOrder,
      getRdcOrder: getRdcOrder,
      getThirdOrder: getThirdOrder,
      getLogistics: getLogistics
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
      orderManager.getAddrInfo().then(function(res) {
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
])
