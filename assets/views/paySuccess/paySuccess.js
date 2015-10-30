angular.module('xiaomaiApp').controller('paySuccessCtrl', [
    '$scope',
    '$state',
    'xiaomaiService',
    'xiaomaiCacheManager',
    'xiaomaiLog',
    'env',
    function($scope, $state, xiaomaiService, xiaomaiCacheManager, xiaomaiLog, env) {
        //关闭窗口
        $scope.closeWindow = function() {
             WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
        };

        //返回首页
        $scope.gotoIndex = function() {
            $state.go('root.buy.nav.all');
        };
        //查看订单详情
        $scope.gotoMyOrder = function() {
            var host = env == 'online' ? 'http://h5.imxiaomai.com' :
                'http://wap.tmall.imxiaomai.com';
            window.location.href = host + '/order/myOrder';
            return false;
        };
        //点击跳转意见反馈
        $scope.gotofeedback = function() {
           $state.go('root.feedback');
        };

    }
]);







// //get URL parameter
// var orderId, userId;
// orderId = Request['orderId'];
// userId = Request['userId'];
// var collegeId;
// //埋点数据
// var obj = "~~" + openId + "~~" + orderId + "~^data~tag~~~^";
// //  orderId = 83;
// // userId = 4; 
// /*渲染支付成功的订单信息*/
// $(document).ready(function() {
//     //新加关闭按钮
//     $(".btn_close").bind("click", function() {
//         WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
//     });

//     //埋点
//     var event = "m_p_paysuccess";
//     mallLog(event, obj);
//     $.ajax({
//         type: "GET",
//         dataType: "json",
//         url: "/wap/order/query?userId=" + userId + "&orderId=" + orderId,
//         //url: "/mockup/confirm.json",
//         beforeSend: function() {},
//         success: function(data) {
//             var data = data.data;
//             var order = data.order;
//             collegeId = order.collegeId;
    
//             $.ajax({
//                 type: 'POST',
//                 dataType: 'json',
//                 url: '/wap/couponActivity/qualifiedInviteFriend',
//                 //url: '/mockup/bonusavel.json',
//                 data: {
//                     "openId": openId,
//                     "collegeId": collegeId
//                 },
//                 success: function(dataBonus) {
//                     if (dataBonus.code == 0) {
//                         if (dataBonus.data.qualification == 1) {
//                             $('#toShare').show();
//                             $('.toBonus').css({
//                                 "background-image": "url(../img/redPacket/I_share.png)",
//                                 "z-index": "111"
//                             });
//                             $('.left_button').click(function() {
//                                 $('#toShare').hide();
//                             });
//                             $('.right_button').click(function() {
//                                 window.location.href = "/couponwap/fusion/share?orderId=" + orderId;
//                             });
//                             $('.toBonus').click(function() {
//                                 window.location.href = "/couponwap/fusion/share?orderId=" + orderId;
//                             });
//                         } else {
//                             $('#toShare').hide();
//                             $('.toBonus').unbind('click');
//                         }
//                     }
//                 }
//             })
//         },
//         complete: function() {},
//         error: function() {
//             //alert("error"); 
//         }
//     });
// }); 
   

//     var openId = $.cookie("xiaomai_open_id");
// $(document).ready(function() {
//     //清空购物车
//     $.ajax({
//         type: "GET",
//         dataType: "json",
//         url: "/wap/cart/delete",
//         beforeSend: function() {},
//         success: function(data) {},
//         complete: function() {},
//         error: function() {
//             alert("购物车清空失败了，请手动清理~");
//         }
//     });

//     //header 回退
//     $(".canBack").click(function() {
//         // window.history.back(-1);
//     });

//     //返回首页
//     $("#goIndex").unbind("touchend").bind("touchend", function() {
//         window.location.href = "/page/newv4/index.html";
//     });


//     //查看订单详情
//     $(".checkDetail").unbind('click').bind('click', function() {
//         window.location.href = "/order/orderDetail?orderId=" + orderId + "&userId=" + userId;
//         //埋点
//         var event = "m_b_paysuccessgoorderdetail";
//         mallLog(event, obj);
//     });


// }) 
