//获取相邻导航
angular.module('xiaomaiApp').factory('siblingsNav', ['$q', 'xiaomaiService',
  function($q, xiaomaiService) {
    var getSiblings = function(navs, arrow, displayType, relateId) {
      var $index = -1;

      switch (displayType) {
        //首页
        case 0:
          angular.forEach(navs, function(nav, i) {
            if (nav.displayType == 0) {
              $index = i;
              return false;
            }
          });
          break;
          //推荐
        case 1:
          angular.forEach(navs, function(nav, i) {
            if (nav.displayType == 1) {
              $index = i;
              return false;
            }
          });
          break;
          //活动
        case 2:
          angular.forEach(navs, function(nav, i) {
            if (nav.displayType == 2 && nav.activityId == relateId) {
              $index = i;
              return false;
            }
          });
          break;
          //类目
        case 3:
          angular.forEach(navs, function(nav, i) {
            if (nav.displayType == 3 && nav.categoryId == relateId) {
              $index = i;
              return false;
            }
          });
          break;
        default:
          break;
      }

      //如果是
      if (arrow == 'up') {
        return $index == -1 ? false : ($index - 1);
      }

      if (arrow == 'down') {
        return $index == navs.length - 1 ? false : ($index + 1);
      }
    };

    //将对应的nav数据 转成router.name和router.path
    var getNav = function(nav, collegeId) {

      var paths = {
        '0': 'root.buy.nav.all',
        '1': 'root.buy.nav.recommend',
        '2': 'root.buy.nav.active',
        '3': 'root.buy.nav.category'
      };
      return {
        text: nav.navigateName,
        name: paths[nav.displayType],
        params: {
          collegeId: collegeId,
          categoryId: nav.categoryId,
          activityId: nav.activityId
        }
      }

    };
    return function(arrow, collegeId, displayType, relateId) {
      var $index = 0;
      var deferred = $q.defer();

      // console.log(arguments);

      xiaomaiService.fetchOne('navgatorlist', {
        collegeId: collegeId
      }).then(function(res) {
        var navs = res.navigateItems;
        var navIndex = getSiblings(navs, arrow, displayType,
          relateId);
        angular.isNumber(navIndex) ? deferred.resolve(getNav(navs[
            navIndex], collegeId)) :
          deferred.reject();

      });

      return deferred.promise;

    }
  }
]);
