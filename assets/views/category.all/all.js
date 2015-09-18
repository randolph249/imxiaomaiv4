angular.module('xiaomaiApp').controller('category.allCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function($scope, $state, xiaomaiService, schoolManager) {
    // debugger;
    //先获取当前学校信息
    schoolManager.get().then(function(res) {
      var collegeId = res.collegeId;
      //根据学校信息获取当前活动列表
      return xiaomaiService.fetchOne('activities', {
        collegeId: collegeId
      });
    }).then(function(res) {
      debugger;
    });
  }
]);
