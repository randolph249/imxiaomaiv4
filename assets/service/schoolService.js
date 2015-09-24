/**
 *管理用户学校信息
 *看一下如果同时发多个请求 其他请求 先返回一个请求信息
 **/
angular.module('xiaomaiApp').factory('schoolManager', [
  '$q',
  'xiaomaiService',
  'env',
  'xiaomaiCacheManager',
  function($q, xiaomaiService, env, xiaomaiCacheManager) {

    var queryQueue = [];
    var lock = false; //多个请求过来 先锁住其他请求
    var hanlderQuerys = function() {
      lock = false; //上一个请求完成 解锁

      //如果请求队列中有等待promise 吐出promise进行处理
      //如果没有等待promise 直接return
      if (queryQueue.length) {
        var newDeffered = queryQueue.shift();
        //执行一次新的请求
        querySchoolInfo(newDeffered);
      } else {
        return false;
      }

    };
    var hanlderErrorQueue = function(msg) {
      if (queryQueue.length) {
        var newDeffered = queryQueue.shift();
        newDeffered.reject(msg);
      } else {
        return false;
      }
    };

    //查询学校信息
    var querySchoolInfo = function(deferred) {
      lock = true, //请求功能中上锁
        schoolInfo = xiaomaiCacheManager.readCache('getSchool'); //尝试从缓存中读取学校信息
      //如果有缓存的学校信息 直接执行缓存 如果没有向后台发送请求

      xiaomaiService.fetchOne('getSchool').then(function(res) {
        //缓存到本地
        xiaomaiCacheManager.writeCache('getSchool', res)
          //吐给用户备份数据 防止原数据被修改
        deferred.resolve(res);
        hanlderQuerys();
      });
    }
    var getSchool = function() {

      var deferred = $q.defer();

      //如果锁住 说明正在有一个请求发生
      //这个时候把请求放到请求队列里面
      if (lock) {
        queryQueue.push(deferred);
      } else {
        querySchoolInfo(deferred);
      };

      return deferred.promise;
    };

    //设置学校信息 同时把学校信息提交给后台接口
    var setSchool = function(info) {
      var deferred = $q.defer();

      var schoolInfo = xiaomaiCacheManager.readCache('getSchool'); //尝试从缓存中读取学校信息


      //如果用户提交过来的学校信息和缓存中的学校信息一致
      if (schoolInfo && schoolInfo.collegeId == info.collegeId) {
        deferred.resolve();
        return deferred.promise;
      }

      xiaomaiService.save('saveSchool', {
        collegeId: info.collegeId
      }).then(function(res) {
        deferred.resolve();
        xiaomaiCacheManager.clean('getSchool')

      }, function(msg) {
        deferred.reject(msg)
      });
      return deferred.promise;
    };
    return {
      get: getSchool,
      set: setSchool
    }
  }
])
