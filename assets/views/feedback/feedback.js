angular.module('xiaomaiApp').controller('feedbackCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  function($scope, $state, xiaomaiService) {

    $scope.goBack = function() {
      $state.go('root.buy.nav.all');
    };

    $scope.feedback = "";
    $scope.mobile = "";

    var mobilereg = /^(\+86)?1[3|4|5|8][0-9]\d{4,8}$/g;

    $scope.submit = function() {
      var feedback = $scope.feedback,
        mobile = $scope.mobile;

      feedback = feedback.trim && feedback.trim();

      if (!feedback || !feedback.length) {
        alert('请输入您的建议或意见');
        return false;
      }

      if (mobile.length && !mobilereg.test(mobile)) {
        alert('手机号有误,请确认');
        return false;
      }

      xiaomaiService.save('feedback', {
        mobile: mobile,
        feedback: feedback
      }).then(function() {
        alert('提交成功!谢谢!');
        $state.go('root.buy.nav.all');
      });

    }

    //提交
  }
]);
