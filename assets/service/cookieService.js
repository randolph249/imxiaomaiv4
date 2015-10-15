//所有的Cookie信息都放到这个页面
//现在Cookie这块只用到查询购物车信息
//后期的话 可以用到缓存用户购物方式


angular.module('xiaomaiApp').factory('cookieManager', ['ipCookie', function(
  ipCookie) {

}]);

//用户opend_id;
angular.module('xiaomaiApp').factory('cookie_openid', ['env', 'ipCookie',
  function(env, ipCookie) {
    if (env != 'develop') {
      return ipCookie('xiaomai_open_id') || '';
    } else {
      return 'oTS2xjtXWVPcdQd9OPI11jjBheco';
    }

  }
]);

//用户搜索历史记录管理
angular.module('xiaomaiApp').factory('searchcookieManager', ['ipCookie',
  function(ipCookie) {
    var cookiesname = 'xiaomaiusersearchrecord';
    var cookies = ipCookie(cookiesname) || []; //cookie缓存 不要频繁的操作Cookie(read) 尽量减少Cookie的操作次数
    var cookieMaxlength = 10;

    var setCookies = function(cookiename) {
      //如果Cookies长度==0直接删除Cookie
      cookies.length ? ipCookie(cookiesname, cookies) : ipCookie.remove(
        cookiesname);
    };
    var getCookies = function() {
      return cookies;
    }
    var hasCookie = function(cookiename) {
      if (!cookies.length) {
        return false;
      }
      var $index = -1;
      angular.forEach(cookies, function(item, i) {
        if (item.name === cookiename) {
          $index = i;
          return false;
        }
      });
      return $index === -1 ? false : $index;
    };
    var readCookie = function(cookiename) {

    };
    //写入Cookie
    var writeCookie = function(cookiename) {
      //如果当前Cookie存在
      if (hasCookie(cookiename) !== false) {
        var cookie = cookies.splice(hasCookie(cookiename), 1)[0];
        cookie['name'] = cookiename;
        cookies.unshift(cookie);
        setCookies();
        return false;
      }

      //如果Cookie长度超出限制 删除第一条记录（最老的记录）
      if (cookies.length >= 10) {
        cookies.pop();
      }

      //插入一条新记录到最前面
      cookies.unshift({
        name: cookiename
      });
      setCookies();
    };
    //删除Cookie
    var cleanCookies = function() {
      cookies = [];
      setCookies();
    };
    return {
      getCookies: getCookies,
      writeCookie: writeCookie,
      cleanCookies: cleanCookies
    }
  }
]);
