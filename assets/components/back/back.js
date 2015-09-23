//模拟回退操作
angular.module('xiaomaiApp').directive('backIcon', [function() {
  var link = function($scope, ele, attrs) {
    //出发回退操作
    ele.bind('touchend', function() {
      // debugger;
      if (history && angular.isFunction(history.go)) {
        history.go('-1');
        return false;
      }
    })
  };
  return {
    link: link
  }
}]);
