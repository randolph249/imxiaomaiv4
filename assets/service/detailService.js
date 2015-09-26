/**
 *打开详情open/closedetail页面 open/close遮罩
 **/
//接受mask服务指令 打开或者关闭遮罩
angular.module('xiaomaiApp').directive("maskGui", [
  'xiaomaiMessageNotify',
  function(xiaomaiMessageNotify) {
    var link = function($scope, ele, attrs) {

      //根据命令显示或者隐藏
      xiaomaiMessageNotify.sub('maskManager', function(order) {
        ele.css({
          display: order == 'show' ? 'block' : 'none'
        });
      });
    };

    return {
      link: link
    }
  }
]);
