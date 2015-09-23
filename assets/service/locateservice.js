/**
 *管理用户定位信息
 **/
angular.module('xiaomaiApp').factory('locationManager', [
  'env',
  '$q',
  'xiaomaiService',
  'ipCookie',
  '$timeout',
  function(env, $q, xiaomaiService, ipCookie, $timeout) {
    var checkedCollegeinfo = {},
      $t; //

    var getLocation = function() {

        var deferred = $q.defer();
        var locationCookie = ipCookie('xiaomaiSchoolCookie', undefined, {
          decode: function(val) {
            return decodeURIComponent(val);
          }
        });

        //从Cookie中读取到用户的Cookie信息
        if (locationCookie) {
          deferred.resolve(locationCookie);
          return deferred.promise;
        }

        //如果微信配置需要执行定位
        if (window['__SYS_CONF']['wxready'] !== true) {
          deferred.reject('微信配置注入错误');
          return deferred.promise;
        }

        //500MS之后自动默认定位失败
        $t = setTimeout(function() {
          deferred.reject('定位失败');
        }, 500);

        //测试环境直接调用接口
        if (env == 'develop') {
          getCollegeInfo(1, 2, deferred)
        }



        //调用微信location接口
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            var lat = res.latitude;
            var lng = res.longitude;
            getCollegeInfo(lat, lng, deferred);
          }


        });

        return deferred.promise;
      },
      //根据坐标获取学校信息
      getCollegeInfo = function(lat, lng, deferred) {
        return xiaomaiService.fetchOne('locate', {
          latitude: lat,
          longitude: lng
        }).then(function(res) {
          //写入Cookie
          writeCookie(res);
          deferred.resolve(res);
        }, function(msg) {
          deferred.reject(msg);
        });
      },
      writeCookie = function(res) {
        ipCookie('xiaomaiSchoolCookie', res);
      };

    return {
      getLocation: getLocation
    }
  }
]);

/**
 *管理用户学校信息
 **/
angular.module('xiaomaiApp').factory('schoolManager', [
  '$q',
  'xiaomaiService',
  function($q, xiaomaiService) {

    var schoolInfo;
    var getSchool = function() {
      var deferred = $q.defer();
      if (schoolInfo) {
        deferred.resolve(angular.extend({}, schoolInfo));
        return deferred.promise;
      }
      xiaomaiService.fetchOne('getSchool').then(function(res) {
        deferred.resolve(res);
        //把学校信息写入到缓存中
        setSchool(angular.extend({}, res));
      }, function() {
        deferred.reject()
      });
      return deferred.promise;
    };
    var setSchool = function(info) {
      schoolInfo = info;
    };
    return {
      get: getSchool,
      set: setSchool
    }
  }
])
