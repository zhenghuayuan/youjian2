/*
 * 开发环境：development 
 * 生产环境：production
 * */
var ENV = "development"; 
//var ENV = "production"; 
/**
 * 所有页面信息
 **/
var PAGE = { 
	//首页
	index: {
		url: "./templates/index.html", 
		id: "index.html", 
		show: {autoShow: true},
		createNew: true,
		styles: {
			background: "RGBA(0, 0, 0, 1)",
			popGesture: "none"
		},
		extras: {title: "我的首页"},
	},
	sub: [ 
		{url: "/templates/tab-home.html", id:"tab-home.html", styles: {top: "0", bottom: "57px"}},
		{url: "/templates/tab-card.html", id:"tab-card.html", styles: {top: "0",bottom:"57px"}},
		{url: "/templates/tab-user.html", id:"tab-user.html", styles: {top: "0",bottom:"57px"}},
	],
	recharge: {
		url: "/templates/recharge.html", 
		id: "recharge.html", 
		show: {autoShow: true},
		styles: {
			background: "RGBA(0, 0, 0, 1)",
			popGesture: "close"
		},
		createNew: true,
		extras: {title: "兑换话费"},
	},
	"bind-phone": {
		url: "/templates/bind-phone.html", 
		id: "bind-phone.html", 
		show: {
			autoShow: true,
			aniShow: "",
//			aniShow:"zoom-fade-out",
		},
		styles: {
			background: "transparent",
			popGesture: "none",
		},
	},
	mask: {
		url: "/templates/mask.html", 
		id: "mask.html", 
		show: {
			autoShow: true
		},
		styles: {
			background: "transparent",
			popGesture: "hide",
		},
		
	},
	"recharge-list": {
		url: "/templates/recharge-list.html", 
		id: "recharge-liste.html", 
		show: {
			autoShow: true,
			aniShow: "",
//			aniShow:"zoom-fade-out",
		},
		styles: {
//			popGesture: "none",
		},
	}
	
	
}
/**
 * 本地存储信息
 **/
var LOCAL = { 
	keys: "USERINFO", // userInfo key
	lastUserid: "LAST_USERID", // 上次的充值用户ID
	lastNumber: "LAST_NUMBER", // 上次的兑换手机号
}
/**
 * API
 **/
var DOMAIN = "https://dcyouxi.com";
var API = { 
	// 用户信息
	login: "https://dcyouxi.com/index.php/index/app_login",
	// 售卡列表
	cardList: "https://dcyouxi.com/index.php/Product/get_goods",
	// 兑换产品列表
//	productList: "http://192.168.1.55/dcxcx/index.php/Product",
	productList: "https://dcyouxi.com/index.php/Product",
	// 兑换
//	recharge: "http://192.168.1.55/dcxcx/index.php/Product/redeem",
	recharge: "https://dcyouxi.com/index.php/Product/redeem",
	// 威富通支付
	wftPay: "http://www.dachuanyx.com/dcmjpay/wbpay.php",
	// 识别是否友间会员
	isInClub: "https://dcyouxi.com/index.php/Login/playerExist",
	// 兑换记录
	rechargeList: "https://dcyouxi.com/index.php/Product/get_redeem_order",
	// 改绑手机号
	bindPhone: "https://dcyouxi.com/index.php/login/setMobile"
	
};
//http://192.168.1.55/dcxcx/index.php/Product/get_redeem_order
/**
 * 自定义事件
 **/
var EVENT = function(){
	function fire(allId, ev, data){
		for(var i=0; i<allId.length; i++){
			var webview = plus.webview.getWebviewById(allId[i]);
			if(webview){
				mui.fire(webview, ev, data);
			}
		}
	}
	var getUserInfo = function(){
		//	var unionId = app.getState(LOCAL.keys).sv.unionId;
		app.request(API.login,  {unionId: app.getState(LOCAL.keys).unionid}) //app.getState(LOCAL.keys)
		.then(function(data){
			console.log("用户信息"+JSON.stringify(data))
			// 传递消息给各个页面
			var res = mui.extend(true, app.getState(LOCAL.keys), data);
			app.setState(LOCAL.keys, res);
			fire([PAGE.sub[0].id, PAGE.sub[1].id, PAGE.sub[2].id, PAGE.recharge.id, PAGE["bind-phone"]], "getUserInfo", data)
			
		})
		.catch(function(e){
			alert(e)
		})
	} 
	// 给各个页面提供调用方法
	return {
		// 获取用户信息
		getUserInfo: getUserInfo,
		
	}
}();
/**
 * 调用全屏蒙版弹窗
 * fromId webviewId
 * text 内容
 * YUDIConfirmCallback 回调函数
 **/
var MASKCONFIRM = function(fromId, text){
	return new Promise(function(resolve, reject){
		window.YUDIConfirmCallback = resolve;
		plus.webview.getWebviewById(PAGE.mask.id).evalJS("yudiConfirm('"+fromId+"','"+text+"',"+"'YUDIConfirmCallback')");
	})
}
/*
 * 时间格式化
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 */
Date.prototype.format = function(fmt) {
	if (!fmt) {
		return 0;
	}
	var obj = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var i in obj){
		if (new RegExp("(" + i + ")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[i]) : (("00" + obj[i]).substr(("" + obj[i]).length)));
		}
	}
	return fmt;
}	

/**
 * 常用工具
 **/
;(function($, app) {
	
	/**
	 * 获取当前状态
	 **/
	app.getState = function(key) {
		var stateText = localStorage.getItem(key) ||"{}";
		return stateText?JSON.parse(stateText):stateText;
	};
	/**
	 * 设置当前状态
	 **/
	app.setState = function(key, value, callback) {
		value = value || {};
		localStorage.setItem(key, JSON.stringify(value));
		callback && callback();
	};
	/**
	 * 销毁状态
	 **/
	app.clearState = function(key) {
		localStorage.clear(key);
	};
	/**
	 * 获取授权登录认证服务列表
	 * @param keyword: 指定授权商（可选）
	 * @return 授权服务对象
	 */
	app.getServices = function(keyword){
		return new Promise(function(resolve, reject){
			plus.oauth.getServices(function(services){
				resolve(services.filter(function(item){
					for(var i in item){
						return item[i] == (keyword || "weixin");
					}
				})[0]);
			}, function(e){
				reject("获取登录认证失败："+ e.message);
			});
		})
	}
	
	/**
	 * 授权登录认证（微信）
	 * @param authService: 授权服务对象
	 * @return userInfo
	 */
	app.wxLogin = function(authService){
		return new Promise(function(resolve, reject){
			authService.login(function(event) {
				resolve(event.target);
			},
			function(e){
				reject("授权登录认证失败："+ e.message);
			});
		})
	}
	/**
	 * 获用户信息（微信）
	 * @param authService: 授权服务对象
	 * @return userInfo
	 */
	app.getWxUserInfo = function(authService){
		return new Promise(function(resolve, reject){
			authService.getUserInfo(function(event) {
				resolve(event.target);
			},
			function(e){
				reject("获用户信息失败："+ e.message);
			});
		})
	}
	/**
	 * ajax 请求
	 * @param url, data, type（可选）
	 * @return data
	 */
	app.request = function(url, data, type){
//		return new Promise(function(resolve, reject){
//			mui[type || "get"](url, data, function(data){
//				resolve(data);
//			},"json");
//		});
		return new Promise(function(resolve, reject){
			console.log("【请求地址】："+url);
			console.log("【请求参数】："+JSON.stringify(data));
			
			mui.ajax(url, {
				data: data,
				dataType:'json',//服务器返回json格式数据
				type: type || "get",//HTTP请求类型
				success:function(data){
					console.log("【请求结果】："+JSON.stringify(data));
					resolve(data);
				},
				error: function(e){
					reject(e)
				}
			});
			
		});
	}
	/**
	 * 退出微信登入
	 * @param authService: 授权服务对象
	 * @return data
	 */
	app.authLogout = function(authService){
		return new Promise(function(resolve, reject){
//			if(typeof authService.AuthInfo == "undefined") {
//				resolve("登陆过期或尚未登陆");
//			}else{
				authService.logout(function(e){
					resolve("注销登录成功："+e);
				}, function(e){
					resolve("注销登录失败："+e);
				});
//			}
		});
	}
	/**
	 * 获取授权支付认证服务列表
	 * @param keyword: 'wxpay' 'alipay' 指定授权商关键字（可选）
	 * @return 授权支付对象
	 */
	app.getChannels = function(keyword){
		return new Promise(function(resolve, reject){
			plus.payment.getChannels(function(channels){
				resolve(channels.filter(function(item){
					for(var i in item){
						return item[i] == (keyword || "wxpay");
					}                                                                                                                                                                                             
				})[0]);
			}, function(e){
				reject("获取支付通道失败："+ e.message);
			});
		})
	}
	
	/**
	 * 请求支付操作
	 * @param channels: 授权服务对象
	 * @return userInfo（有时返回信息不全，待测）
	 */
	app.requestPay = function(channels){
		return new Promise(function(resolve, reject){
			plus.payment.request(channels, "", function(data){
				resolve(data);
			},function(e){
				reject("支付失败："+ e.message);
			})
			
		})
	}
	


	
}(mui, window.app = {}));
