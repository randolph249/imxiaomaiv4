//所有的Cookie信息都放到这个页面
//现在Cookie这块只用到查询购物车信息
//后期的话 可以用到缓存用户购物方式


angular.module('xiaomaiApp').factory('cookieManager', ['ipCookie', function(
  ipCookie) {

}]);

//用户opend_id;
angular.module('xiaomaiApp').factory('cookie_openid', ['env', 'ipCookie',
  function(env, ipCookie) {

    if (env == 'online') {
      return ipCookie('xiaomai_open_id');
    } else {
      return 'oTS2xjtXWVPcdQd9OPI11jjBheco'
    }

  }
]);
