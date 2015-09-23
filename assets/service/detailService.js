/**
 *调起详情页面
 **/
angular.module('xiaomaiApp').factory('detailManager', [
  function() {
    //请求吊起详情页面
    var callback;

    function gotoDetail(good) {
      callback && angular.isFunction(callback) && callback(good.goodId,
        good.sourceType);
    };

    function invokeDetail(call) {
      //注册callback
      callback = call;
    };

    return {
      gotoDetail: gotoDetail,
      invokeDetail: invokeDetail
    }
  }
]);

/**
 *打开详情open/closedetail页面 open/close遮罩
 **/
angular.module('xiaomaiApp').factory("detailGuiMananger", function() {
  var callback;
  //接受命令
  var sub = function(call) {
    callback = call;
  };
  //发送命令
  var pub = function(order) {

    if (!/show|hide/.test(order)) {
      console.log('只接受show和hide两个命令');
      return false;
    }
    callback && angular.isFunction(callback) && callback(order);
  };



  //传输指令&接受指令
  return {
    sub: sub,
    pub: pub,
  }

});

angular.module('xiaomaiApp').factory("maskManager", function() {
  //遮罩管理
  var callback;
  //接受命令
  var sub = function(call) {
    callback = call;
  };
  //发送命令
  var pub = function(order) {

    if (!/show|hide/.test(order)) {
      console.log('只接受show和hide两个命令');
      return false;
    }
    callback && angular.isFunction(callback) && callback(order);
  };



  //传输指令&接受指令
  return {
    sub: sub,
    pub: pub,
  }
});


//接受mask服务指令 打开或者关闭遮罩
angular.module('xiaomaiApp').directive("maskGui", [
  'maskManager',
  function(maskManager) {
    var link = function($scope, ele, attrs) {

      //根据命令显示或者隐藏
      maskManager.sub(function(order) {

        //打开或者关闭遮罩
        ele.css({
          display: order == 'show' ? 'block' : 'none'
        });

      });
    };


    return {
      link: link
    }
  }
])


angular.module('xiaomaiApp').directive("detailGui", [
  'detailGuiMananger',
  'maskManager',
  function(detailGuiMananger, maskManager) {
    var link = function($scope, ele, attrs) {

      var activeClass = attrs.activeClass;
      //根据命令显示或者隐藏
      detailGuiMananger.sub(function(order) {

        //打开或者关闭遮罩
        maskManager.pub(order);
        ele[order == 'show' ? 'addClass' : 'removeClass'](activeClass);

      });
    };


    return {
      link: link
    }
  }
])
