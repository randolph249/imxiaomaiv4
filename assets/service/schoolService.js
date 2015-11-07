/**
 *管理用户学校信息
 *看一下如果同时发多个请求 其他请求 先返回一个请求信息
 **/
angular.module('xiaomaiApp').factory('schoolManager', [
  '$q',
  '$window',
  'xiaomaiService',
  'env',
  'xiaomaiCacheManager',
  '$timeout',
  function($q, $window, xiaomaiService, env, xiaomaiCacheManager, $timeout) {

    //如果collegeId=1跳转
    //小流量测试切换
    var handlerWhilteListSchool = function(newCollegeId) {
      var urlSearch = window.location.search;
      var reg = /[\?&]xiaomai_schollid=([^\?&#]+)/;
      var oldCollegeId = angular.isArray(urlSearch.match(reg)) ? Number(urlSearch.match(reg)[1]) : -9999;


      if (oldCollegeId !== 3270 && newCollegeId === 3270) {
        $window.location.href = '/page/newv4/index.html?collegeId=1';
        return true;
      }

      if (oldCollegeId === 3270 && newCollegeId !== 3270) {
        $window.location.href = '/page/newv4/index.html';
        return true;
      }
      return false;
    };
    var $t;
    var getSchool = function() {
      var deferred = $q.defer();
      //如果锁住 说明正在有一个请求发生
      //这个时候把请求放到请求队列里面

      xiaomaiService.fetchOne('getSchool').then(function(res) {
        $t && $timeout.cancel($t);
        $t = $timeout(function() {
          handlerWhilteListSchool(res.collegeId);
        }, 10);
        deferred.resolve(res);
      });
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
        if (res.hasOwnProperty('collegeId')) {
          xiaomaiCacheManager.writeCache('getSchool', res);
          handlerWhilteListSchool(res.collegeId);
          deferred.resolve(schoolInfo);
        } else {
          deferred.reject(msg);
        }
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
