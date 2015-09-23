angular.module('xiaomaiApp').controller('buy.couponCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  function($state, $scope, xiaomaiService) {
    xiaomaiService.fetchOne('mycoupon', {}).then(function(res) {

    });
  }
])
