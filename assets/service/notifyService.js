//不同controller/directive之间相互通信
//一个简单的订阅发布模块
//消息中心缓存不能根据缓存数量删除 以避免订阅以后因为内存不足而被删除
//所以需要单独的放置一块缓存
//所以这块的使用要谨慎
//当不需要的时候 要执行手动删除
angular.module('xiaomaiApp').factory('xiaomaiMessageNotify', [
  'xiaomaiCacheManager',
  '$window',
  function(xiaomaiCacheManager, $window) {
    //消息中心池子
    var notifyPool = {};

    //执行订阅
    var sub = function(eventname, callback) {
      //查看池子中是否已经订阅
      var callbacks = notifyPool.hasOwnProperty(eventname) ?
        notifyPool[
          eventname] : {};

      //给订阅者生成一个唯一ID 方便订阅者以后删除订阅
      var subId = ('' + Math.random()).replace(/\./, '');
      callbacks[subId] = callback;
      //更新消息池子
      notifyPool[eventname] = callbacks;
      return subId;
    };

    //发布通知
    var pub = function(eventname) {

      debugger;


      //先看池子中是否有订阅事件
      var callbacks = notifyPool[eventname];

      //如果没有订阅或者订阅为空
      if (!angular.isObject(callbacks) || !Object.keys(callbacks).length) {
        return false;
      }
      var args = Array.prototype.slice.call(arguments, 1);

      angular.forEach(callbacks, function(callback) {
        angular.isFunction(callback) && callback.apply($window,
          args);
      });
    };

    //从订阅列表中删除某一个订阅
    var removeOne = function(eventname, subId) {
      var callbacks = notifyPool[eventname];

      if (angular.isObject(callbacks) && callbacks.hasOwnProperty(
          subId)) {
        delete callbacks[subId];
      }
    };
    //删除所有订阅释放缓存
    var remove = function(eventname) {

      delete notifyPool[eventname];
    };
    return {
      pub: pub,
      sub: sub,
      removeOne: removeOne,
      remove: remove
    };
  }
]);
