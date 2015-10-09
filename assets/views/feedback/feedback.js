angular.module('xiaomaiApp').controller('feedbackCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'xiaomaiLog',
  function($scope, $state, xiaomaiService, xiaomaiLog) {

    $scope.goBack = function() {
      $state.go('root.buy.nav.all');
    };

    //feedback页面LOG统计
    xiaomaiLog('m_p_31feedback');

    $scope.feedback = "";
    $scope.mobile = "";

    var mobilereg = /^(\+86)?1[3|4|5|8][0-9]\d{4,8}$/g;

    $scope.submit = function() {
      //提交点击次数日志统计
      xiaomaiLog('m_b_31feedbacksubmit');

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
      }, function(msg) {
        alert('提交失败,请重新尝试!\n失败原因:' + msg);
      });

    }

    //提交
  }
]);
