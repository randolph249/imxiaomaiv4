//快速获取图片高度
angular.module('xiaomaiApp').factory('quickGetImgHeight', [
  '$q',
  function($q) {
    return function(url) {
      var deferred = $q.defer();

      var log = function() {};

      var img = document.createElement('img');
      img.src = url;
      var loaded = false,
        wait,
        width, height;

      img.addEventListener('load', function() {
        if (loaded) {
          return false;
        }
        loaded = true;
        deferred.resolve({
          width: img.width,
          height: img.height
        });
      });

      img.addEventListener('error', function() {
        if (loaded) {
          return false;
        }
        loaded = true;
        deferred.resolve({
          width: img.width,
          height: img.height
        });
      });

      wait = setInterval(function() {
        //图片高度加载完成
        if (img.height != 0 && img.height == height) {
          clearInterval(wait);
          loaded = true;
          deferred.resolve({
            width: img.width,
            height: img.height
          });
          return false;
        }
        height = img.height;
        log(img.width, log.height);
      }, 50);

      return deferred.promise;

    }
  }
]);

angular.module('xiaomaiApp').factory('safeApply', ['$rootScope', function(
  $rootScope) {
  return function(fn) {
    var phase = $rootScope.$$phase;

    if (phase == '$apply' || phase == '$digest') {
      angular.isFunction(fn) && fn();
    } else {
      $rootScope.$apply(fn);
    }
  }
}]);

angular.module('xiaomaiApp').directive('goodDetail', [
  '$state',
  '$timeout',
  'xiaomaiService',
  'getSkuInfo',
  'skuListToObject',
  'buyProcessManager',
  'cartManager',
  'wxshare',
  'xiaomaiLog',
  'quickGetImgHeight',
  'schoolManager',
  'safeApply',
  function(
    $state,
    $timeout,
    xiaomaiService,
    getSkuInfo,
    skuListToObject,
    buyProcessManager,
    cartManager,
    wxshare,
    xiaomaiLog,
    quickGetImgHeight,
    schoolManager,
    safeApply
  ) {

    var link = function($scope, ele, iAttrs) {

      $scope.swiper = {};
      $scope.swiperIndex = 0;
      $scope.onReadySwiper = function(swiper) {

        $scope.swiperSlider = function($event, arrow) {

          $event.preventDefault();
          $event.stopPropagation();
          swiper[arrow == 'prev' ? 'slidePrev' : 'slideNext']();

        };
        swiper.on('slideChangeStart', function(swiper) {


          var args1 = Array.prototype.slice.call(arguments)[0];
          safeApply(function() {
            $scope.swiperIndex = args1.activeIndex;

          });

        });

      };



      //监听goodId和sourceType
      var watches = $scope.$watch('goodsId+sourceType', function() {
        if (!/\d+/.test($scope.goodsId) || !/\d+/.test($scope.sourceType)) {
          return false;
        }
        //获取数据
        loadDetail($scope.goodsId, $scope.sourceType);

      });

      //获取详情数据
      var collegeId;
      var loadDetail = function(goodsId, sourceType) {
        schoolManager.get().then(function(res) {
          collegeId = res.collegeId;
          return xiaomaiService.fetchOne('goodDetail', {
            goodsId: goodsId,
            sourceType: sourceType
          })
        }).then(function(res) {

          //修改详情图片配置
          angular.isArray(res.goodsDetailImageList) && angular.forEach(
            res.goodsDetailImageList,
            function(item) {
              item.imageUrl += '&imageView2/0/w/410';
            });

          $scope.good = res;

          //配置微信分享信息
          wxshareConfig();

          //快速获取图片高度
          $scope.good.hasOwnProperty('goodsDetailImageList') &&
            loadImgs();

          //如果是聚合类产品 生成SkuObject
          //创建一个skuInfo 聚合类如果选出了一个存在的商品 就生成一个skunInfo
          //非聚合类默认有一个SkuInfo
          if ($scope.good.goodsType == 3) {
            $scope.skuInfo = false;
            $scope.checkedProperties = {};
            $scope.skuObject = createSkukvList($scope.good.skuList);
            return false;
          } else {
            //非聚合类商品 查询numInCart
            $scope.skuInfo = $scope.good.skuList[0];
            var skuId = $scope.good.sourceType == 1 ? $scope.skuInfo
              .skuId : $scope.skuInfo.activitySkuId;
            return cartManager.getnumInCart(skuId, $scope.good.sourceType)
          }
        }).then(function(num) {
          return angular.isNumber(num) && ($scope.numInCart = num);
        }).finally(function() {
          //通知parent controller数据创建成功
          angular.isFunction($scope.loadSuccess) && $scope.loadSuccess();
        });
      };


      //快速加载图片加载
      var loadImgs = function() {

        var hasImage = $scope.good.goodsDetailImageList && $scope.good.goodsDetailImageList
          .length;
        hasImage && quickGetImgHeight($scope.good.goodsDetailImageList[
              0]
            .imageUrl)
          .then(function(imgObj) {
            $scope.graphicsHeight = imgObj.height * $scope.good.goodsDetailImageList
              .length;
            $scope.graphicHeight = imgObj.height;
            $timeout(function() {
              $scope.imageLoadedCall && $scope.imageLoadedCall();
            }, 100)

          });

      };

      //定位微信配置
      var wxshareConfig = function() {
        var title = '小麦特供-' + ($scope.good.sourceType == 2 ? $scope
          .good
          .activityGoodsName :
          $scope.good.bgGoodsName);
        var desc = "小麦特供,便宜有好货,赶快点进来看看吧!";
        var link = [
          'http://',
          window.location.host,
          window.location.pathname,
          window.location.search,
          '#/buy/sharedetail/',
          '?goodId=',
          $scope.goodsId,
          '&sourceType=',
          $scope.sourceType,
          '&collegeId=',
          collegeId
        ].join('');
        var imgUrl = $scope.good.iconImageUrl;
        var success = function() {

        };
        var cancel = function() {

        };
        wxshare({
          title: title,
          link: link,
          desc: desc,
          imgUrl: imgUrl,
          success: success,
          cancel: cancel
        });

      };


      //将Skulist转成以存在的PropertyId=PropertyVal为key的SkuObject
      var createSkukvList = function(skulist) {
        return skuListToObject(skulist);
      };


      //提示用户想写想想可以选择
      var showPropertiesTip = function(curpropertynameid) {

        var keys = [];
        angular.forEach($scope.skuObject, function(sku, key) {
          //
          var flag = true;
          angular.forEach($scope.checkedProperties, function(
            propertyVal, propertyName) {
            var reg = new RegExp(propertyName + "=" +
              propertyVal);
            if (!reg.test(key)) {
              flag = false;
              return false;
            }
          });

          if (flag == true) {
            keys.push(key);
          }
        });


        var skuGoodsPropertyList = $scope.good.skuGoodsPropertyList;
        angular.forEach(skuGoodsPropertyList, function(
          properties) {
          angular.forEach(properties.propertyValues, function(
            valueItem,
            $index) {
            var str = properties.propertyNameId + '=' +
              valueItem.propertyValueId;
            //当前点击行或者可以选择行可以显示为可选状态
            if (keys.join('&').indexOf(str) != -1) {
              valueItem.disabled = false;
            } else {
              valueItem.disabled = true;
            }
          });
        });

        $scope.good.skuGoodsPropertyList = skuGoodsPropertyList;

      };

      //聚合类产品选择产品类型
      $scope.complexCheckProperty = function($event, key, valItem) {

        $event.preventDefault();
        $event.stopPropagation();

        if (valItem.disabled) {
          return false;
        }
        var val = valItem.propertyValueId;
        //进行toggle操作
        if ($scope.checkedProperties[key] === val) {
          delete $scope.checkedProperties[key];
        } else {
          $scope.checkedProperties[key] = val;
        }
        //提示用户那些选项可以选
        showPropertiesTip(key);

        //判断是否组合出了存在的Sku信息
        var skuInfo = getSkuInfo($scope.checkedProperties, $scope.skuObject);

        $scope.skuInfo = skuInfo == false ? false : skuInfo;
        //如果skuInfo确定之后
        if ($scope.skuInfo) {
          //从后台查询numInCart信息

          var skuId = $scope.good.sourceType == 1 ? $scope.skuInfo.skuId :
            $scope.skuInfo.activitySkuId;

          cartManager.getnumInCart(skuId, $scope.good.sourceType).then(
            function(num) {
              $scope.numInCart = num;
            });
        } else {
          $scope.numInCart = 0;
        }
      };

      /**
       *添加到购物车或者那个购物中删除
       *先校验是否可以进行添加或者删除
       *然后向后台提交操作请求
       **/
      $scope.buyHandler = function($event, type) {

        $event.preventDefault();
        $event.stopPropagation();

        //购买点击次数统计
        var logname = $scope.good.isSeckill == 1 ?
          'm_b_31productdetailinfopanicbuy' : (type == 'plus' ?
            'm_b_31productdetailinfoadd' :
            'm_b_31productdetailinfoless');
        xiaomaiLog(logname);

        var propertyIds = [];

        //如果是聚合类产品 保证已经选出了一个sku信息
        if (!$scope.skuInfo) {
          alert('请选择商品规格');
          return false;
        } else {
          angular.forEach($scope.checkedProperties, function(item) {
            propertyIds.push(item);
          });
          propertyIds = propertyIds.join('_');
        }


        var options = $scope.sourceType == 2 ? {
          goodsId: $scope.good.activityGoodsId,
          sourceType: 2,
          skuId: $scope.skuInfo.activitySkuId,
          distributeType: $scope.skuInfo.distributeType,
          price: $scope.skuInfo.activityPrice,
          propertyIds: ''
        } : {
          goodsId: $scope.good.goodsId,
          sourceType: $scope.sourceType,
          skuId: $scope.skuInfo.skuId,
          distributeType: $scope.skuInfo.distributeType,
          price: $scope.skuInfo.wapPrice,
          propertyIds: propertyIds
        };


        $scope.good.isPaying = true;

        //执行购买
        //如果是聚合类产品 需要将选中的PropertyIdVal提交给后台
        buyProcessManager(options, type,
            Math.min($scope.good.maxNum, $scope.skuInfo.stock),
            $scope.numInCart
          )
          .then(function(numInCart) {
            //更新numInCart

            $scope.numInCart = numInCart;

            //购物车来源统计
            type == 'plus' && xiaomaiLog('m_r_31cartfromdetail');
            //如果是抢购
            if ($scope.good.isSeckill == 1) {
              $scope.good.killed = true;
              alert('抢购成功,赶紧去下单吧!');
            }

          }, function(msg) {
            alert(msg);
            return false;
          }).then(function() {
            $scope.good.isPaying = false;
          });
      };

      //如果是秒杀类产品 倒计时世界截止
      $scope.timecountdown = function() {
        //如果是活动开始了
        if ($scope.good['killStarted'] === 0) {
          //修改活动状态
          $scope.good['killStarted'] = 1;
          //修改距离开始时间
          $scope.good['beginTime'] = -1;
          //截止时间到期了
        } else if ($scope.good['killStarted'] === 1) {
          $scope.good['killStarted'] = 2;
          $scope.good['buyLeftTime'] = -1;
        }
      };
      //销毁监听
      $scope.$on('$destroy', function() {
        watches();
      });
    };

    return {
      link: link,
      templateUrl: '../assets/views/gooddetail/gooddetail.html',
      repalce: true,
      scope: {
        goodsId: '=',
        sourceType: '=',
        loadSuccess: '&',
        imageLoadedCall: '&'
      }
    }
  }
]);
