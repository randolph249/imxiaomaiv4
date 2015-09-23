angular.module('xiaomaiApp').filter('xiaomaiprice', function() {
  return function(val) {
    return (val / 100).toFixed(2);
  }
})
