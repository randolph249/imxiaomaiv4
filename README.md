小麦商城前端V4.0.1重构日志
--------------------------

### 依赖外部框架

-	MVVM框架：angular.js
-	异步加载框架 oclazyload.js(在debug版本使用 线上版本删除)
-	前端路由Router:angular.uirouter
-	点击事件改进:angular-touch.min.js(比原生的ngClick快速没有300ms的延时,但是需要注意e.preventDefault())
-	javascript滚动插件:iscroll-probe(iscroll5的增强版本 可监听滚动中的状态)
-	jweixin-1.0.0.js:微信jssdk
-	swiper.min.js&angualr-swiper.js。轮播图插件
-	Sass
-	构建工具 Gulp

---

### 文件目录

-	assets
	-	javascript
		-	components 通用组件
		-	filter 过滤器
		-	lib 依赖框架
		-	views 业务逻辑

---
