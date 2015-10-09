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
    //然后查询白名单 如果在白明白之呢i
    var querySchoolInfo = function(deferred) {
      lock = true; //请求功能中上锁
      var schoolInfo;
      xiaomaiService.fetchOne('getSchool').then(function(res) {
        //缓存到本地
        xiaomaiCacheManager.writeCache('getSchool', res)
          //吐给用户备份数据 防止原数据被修改
        schoolInfo = res;
        return xiaomaiService.fetchOne('whitelist');
      }).then(function(whitelist) {

        var reg = new RegExp(",?(" + schoolInfo.collegeId + "),?");
        //缓存学校白名单
        xiaomaiCacheManager.writeCache('whitelist', whitelist);
        //如果当前学校不在白名单里面 就不用继续处理队列了
        if (reg.test(whitelist.collegeWhiteList)) {
          deferred.resolve(schoolInfo);
          hanlderQuerys();
        } else {
          // alert('当前学校不在商城V4的白名单,将跳到旧版商城!');

          window.location.href = 'http://' + window.location.host;
        }


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
    //获取到学校白名单之后 查询是否在白名单中 只允许白名单中的学校使用新版
    var setSchool = function(info) {
      var deferred = $q.defer();
      var schoolInfo = info;
      xiaomaiService.save('saveSchool', {
        collegeId: info.collegeId
      }).then(function(res) {
        xiaomaiCacheManager.writeCache('getSchool', res);
        return xiaomaiService.fetchOne('whitelist');
      }).then(function(whitelist) {
        var reg = new RegExp(",?(" + schoolInfo.collegeId + "),?");
        //缓存学校白名单
        xiaomaiCacheManager.writeCache('whitelist', whitelist);
        //如果当前学校不在白名单里面 就不用继续处理队列了
        if (reg.test(whitelist.collegeWhiteList)) {
          deferred.resolve(schoolInfo);
        } else {

          // alert('当前学校不在商城V4的白名单,将跳到旧版商城!');
          window.location.href = 'http://' + window.location.host;
        }
        return false;
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
