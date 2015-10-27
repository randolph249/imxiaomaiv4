< script >
//get URL parameter
var orderId, userId;
orderId = Request['orderId'];
userId = Request['userId'];
var collegeId;
//埋点数据
var obj = "~~" + openId + "~~" + orderId + "~^data~tag~~~^";
//  orderId = 83;
// userId = 4; 
/*渲染支付成功的订单信息*/
$(document).ready(function() {
    //新加关闭按钮
    $(".btn_close").bind("click", function() {
        WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
    });

    //埋点
    var event = "m_p_paysuccess";
    mallLog(event, obj);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/wap/order/query?userId=" + userId + "&orderId=" + orderId,
        //url: "/mockup/confirm.json",
        beforeSend: function() {},
        success: function(data) {
            var data = data.data;
            var order = data.order;
            collegeId = order.collegeId;
            //         $(".js_username").text(order.receiverName);
            //         $(".js_telephone").text(order.receiverPhone);

            //         for (var i = 0; i < order.childOrderList.length; i++) {
            //             $('.deliveryTypeBlock').append(format(order.childOrderList[i]));
            //             if (order.childOrderList[i].distributeType == 0) {
            //                 $('.title').eq(i).html("次日达订单");
            //             } else if (order.childOrderList[i].distributeType == 1) {
            //                 $('.title').eq(i).html("当日达订单");
            //             }
            //             if (order.childOrderList[i].deliveryType == 1) {
            //                 var deliveryBeginTime = order.childOrderList[i].deliveryBeginTime;
            //                 var deliveryEndTime = order.childOrderList[i].deliveryEndTime;
            //                 function checkTime(i)
            //      {
            //         if (i<10) 
            //           {i="0" + i}
            //           return i
            //      }
            //                 var d = new Date();
            //                 d.setTime(deliveryBeginTime);
            //                 var beginMonth = d.getMonth()+1;
            //                 var beginDate = d.getDate();
            //                 var beginHour =checkTime(d.getHours());
            //      var beginMin = checkTime(d.getMinutes());
            //                 deliveryBeginTime = beginMonth + "月" + beginDate + "日&nbsp;" + beginHour + ":" + beginMin;
            //                 d.setTime(deliveryEndTime);
            //                 var endHour = checkTime(d.getHours());
            //      var endMin = checkTime(d.getMinutes());
            //                 deliveryEndTime = endHour + ":" + endMin;
            //                 $(".deliveryBlock").eq(i).find($(".shipTime")).html(deliveryBeginTime + '~' + deliveryEndTime);
            //                 $(".deliveryBlock").eq(i).find($(".zitiAddress")).parent().remove();
            //             } else if (order.childOrderList[i].deliveryType == 0) {
            //                 $(".deliveryBlock").eq(i).find($(".shipTime")).parent().remove();
            //             }
            //         }
            //         if (order.onlinePayType == 1) {
            //             $("#onlinePayType").text('微信支付');
            //         } else if (order.onlinePayType == 2) {
            //             $("#onlinePayType").text('支付宝支付');
            //         }

            //         $("#totalPay").html('￥' + order.totalPay / 100.0);
            //         if (order.firstSub == 0) {
            //             $("#firstSub").parent().hide();
            //             $("#firstSub").parent().next().hide();
            //         } else {
            //             $("#firstSub").html('-￥' + order.firstSub / 100.0);
            //         }
            //         if (order.fullSub == 0) {
            //             $("#fullSub").parent().hide();
            //             $("#fullSub").parent().next().hide();
            //         } else {
            //             $("#fullSub").html('-￥' + order.firstSub / 100.0);
            //         }
            //         $("#onlinePay").html('￥' + order.onlinePay / 100.0);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/wap/couponActivity/qualifiedInviteFriend',
                //url: '/mockup/bonusavel.json',
                data: {
                    "openId": openId,
                    "collegeId": collegeId
                },
                success: function(dataBonus) {
                    if (dataBonus.code == 0) {
                        if (dataBonus.data.qualification == 1) {
                            $('#toShare').show();
                            $('.toBonus').css({
                                "background-image": "url(../img/redPacket/I_share.png)",
                                "z-index": "111"
                            });
                            $('.left_button').click(function() {
                                $('#toShare').hide();
                            });
                            $('.right_button').click(function() {
                                window.location.href = "/couponwap/fusion/share?orderId=" + orderId;
                            });
                            $('.toBonus').click(function() {
                                window.location.href = "/couponwap/fusion/share?orderId=" + orderId;
                            });
                        } else {
                            $('#toShare').hide();
                            $('.toBonus').unbind('click');
                        }
                    }
                }
            })
        },
        complete: function() {},
        error: function() {
            //alert("error"); 
        }
    });
}); < /script> < script >
    // function format(d) {
    //     return '<div class="block_bg deliveryBlock">' +
    //         '<h4 class="f16 title">' + d.type + '</h4>' +
    //         '<ul class="deliveryInfo">' +
    //         '<li>麦客将于 <span class="underline shipTime"></span>' +
    //         '将货物送至 <span class="underline shipAddress">' + d.deliveryAddress +
    //         '</span> ,请您保持手机畅通' +
    //         '</li>' +
    //         '<li>' +
    //         '货物到达 <span class="underline zitiAddress">' + d.selfPickUpAddress +
    //         '</span>后，我们将第一时间通知您去门店取货' +
    //         '</li>' +
    //         '</ul>' +
    //         '</div>';
    // }

    var openId = $.cookie("xiaomai_open_id");
$(document).ready(function() {
    //清空购物车
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/wap/cart/delete",
        beforeSend: function() {},
        success: function(data) {},
        complete: function() {},
        error: function() {
            alert("购物车清空失败了，请手动清理~");
        }
    });

    //header 回退
    $(".canBack").click(function() {
        // window.history.back(-1);
    });

    //返回首页
    $("#goIndex").unbind("touchend").bind("touchend", function() {
        window.location.href = "/page/newv4/index.html";
    });

    /**
    $("#goIndex").click(function () {
        //window.location.href = "/page/newv4/index.html";
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/wap/cart/delete",
            success: function (data) {
                window.location.href = "/page/newv4/index.html";
            },
            error: function () {
                alert("服务器开小差了！");
            }
        });
        //埋点
        var event = "m_b_paysuccessreturnhome";
        mallLog(event, obj);
    });
    */
    //查看订单详情
    $(".checkDetail").unbind('click').bind('click', function() {
        window.location.href = "/order/orderDetail?orderId=" + orderId + "&userId=" + userId;
        //埋点
        var event = "m_b_paysuccessgoorderdetail";
        mallLog(event, obj);
    });


}) < /script>
