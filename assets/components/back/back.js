//iScroll滚动
angular.module('xiaomaiApp').directive('xiaomaiIscroll', [function() {

  var defaultOptions = {

  };

  var currentY;

  var link = function($scope, ele, attrs) {

    new iScroll(ele, {
      vScrollbar: false,
      hScrollbar: false,
      setp: 30,
      useTransition: true,
      onRefresh: function() {},
      onScrollEnd: function() {}
    });

    return false;
    var myScroll = new IScroll(ele[0], angular.extend({}, $scope.options, {
      onRefresh: function() {

      },
      onScrollMove: function() {

      },
      onScrollEnd: function() {

      }
    }));



    setTimeout(function() {
      myScroll.refresh();
    }, 1000);
  }

  return {
    scope: {
      options: '@'
    },
    link: link,
  }
}]);

//
//
// var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");
//
// myScroll = new IScroll('#wrapper', {
//   probeType: 3,
//   mouseWheel: true
// });
// //probeType属性，表明此插件，可以监听scroll事件
//
// myScroll.on("scroll", function() {
//   //scroll事件，可以用来控制上拉和下拉之后显示的模块中，
//   //样式和内容展示的部分的改变。
//   var y = this.y,
//     maxY = this.maxScrollY - y,
//     downHasClass = downIcon.hasClass("reverse_icon"),
//     upHasClass = upIcon.hasClass("reverse_icon");
//
//   if (y >= 40) {
//     !downHasClass && downIcon.addClass("reverse_icon");
//     return "";
//   } else if (y < 40 && y > 0) {
//     downHasClass && downIcon.removeClass("reverse_icon");
//     return "";
//   }
//
//   if (maxY >= 40) {
//     !upHasClass && upIcon.addClass("reverse_icon");
//     return "";
//   } else if (maxY < 40 && maxY >= 0) {
//     upHasClass && upIcon.removeClass("reverse_icon");
//     return "";
//   }
// });
//
// myScroll.on("slideDown", function() {
//   //当下拉，使得边界超出时，如果手指从屏幕移开，则会触发该事件
//   if (this.y > 40) {
//     //获取内容于屏幕拉开的距离
//     //可以在该部分中，修改样式，并且仅限ajax或者其他的一些操作
//     //此时只是为了能演示该功能，只添加了一个alert功能。
//     //并且，由于alert会阻塞后续的动画效果，所以，
//     //添加了后面的一行代码，移除之前添加上的一个样式
//     alert("slideDown");
//     upIcon.removeClass("reverse_icon");
//   }
// });
//
// myScroll.on("slideUp", function() {
//   if (this.maxScrollY - this.y > 40) {
//     //与slideDown相同的，maxScrollY表示文档区域的最大高度
//     alert("slideUp");
//     upIcon.removeClass("reverse_icon")
//   }
// });
