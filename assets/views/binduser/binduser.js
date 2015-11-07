angular.module('xiaomaiApp').controller('bindUserCtrl', [
  '$scope',
  '$state',
  '$interval',
  'xiaomaiService',
  'schoolManager',
  'cookie_openid',
  'xiaomaiLog',
  function($scope, $state, $interval, xiaomaiService, schoolManager, cookie_openid, xiaomaiLog) {

    //banding页面PV统计
    xiaomaiLog('m_p_33banding');

    var mobilereg = /^(\+86)?1[3|4|5|8][0-9]\d{4,8}$/;

    //发送验证码
    $scope.sendCode = function($event) {

      //点击发送验证码统计
      xiaomaiLog('m_b_33logingetcode');

      $event.preventDefault();
      $event.stopPropagation();

      if (!mobilereg.test($scope.tel)) {
        alert('请输入正确手机号');
        return false;
      }

      xiaomaiService.save('sendCode', {
        phone: $scope.tel
      }).then(function() {
        //倒计时60S
        $scope.sendLeftTime = 60;

        var t = $interval(function() {
          $scope.sendLeftTime = $scope.sendLeftTime - 1;

          $scope.sendLeftTime <= 0 && $interval.cancel(t);
        }, 1000);

      }, function(error) {
        alert(error.msg || '获取验证码失败');

        //提示当前手机号已绑定统计
        if (error.code === 1) {
          xiaomaiLog('m_b_33loginbinded');
        }

      })
    };

    //绑定用户
    $scope.bindUser = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      //绑定用户统计
      xiaomaiLog('m_b_33logingo');

      var collegeId;
      //统一用户协议
      if (!$scope.agreedeal) {
        alert('请阅读并同意小麦公社协议');
        return false;
      }

      //手机号正确
      if (!$scope.tel || !mobilereg.test($scope.tel)) {
        alert('请输入正确手机号');
        return false;
      }

      //验证码
      if (!/\d{4,6}/.test('' + $scope.smsCode)) {
        alert('请输入正确验证码');
        return false;
      }
      schoolManager.get().then(function(res) {
        var collegeId = res.collegeId;
        return xiaomaiService.save('bindUser', {
          "phone": $scope.tel,
          "openId": cookie_openid || '',
          "collegeId": collegeId,
          "smsCode": $scope.smsCode,
          "type": 0 //需要区分红包和商城 后期处理
        });
      }).then(function(res) {
        alert('绑定成功');
        $state.go('root.buy.nav.all');
      }, function(err) {
        debugger;
        alert(err.msg);
      });
    }
  }
])
