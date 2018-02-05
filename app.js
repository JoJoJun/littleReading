//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("5e325c78426a5b263b49cd28914eb351", "2a43d9f47ab4eb22eec3ccf03ba77cd6");
App({
  onLaunch: function () {
    //小程序初始化完成只执行一次
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.localBooks = this.getBook();
  },
  onShow: function(){
    //启动小程序或者从后台进入前台
  },
  onHide: function(){
    //从前台进入后台
  },
   getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            console.log('res:'+res.userInfo);
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    getBook: function () {
        try {
            var value = wx.getStorageSync('localBooks')
            if (!value) {
                value = [];
            }
            return value;
        } catch (e) {
            return [];
        }
    },
  globalData:{
    //全局信息
        localBooks: [],
        userInfo: null,
        currentBook: null,
        bookContents: null,
        contentsIndex:-1,
        permit:true,
        isShowToast:true,//?
        toastText:'0',//?
    },
    //自定义Toast
  showToast:  function (text, o, count) {
        var  _this  =  o;
        count  =  parseInt(count)  ?  parseInt(count)  :  3000;
        _this.setData({
            toastText: text,
            isShowToast:  true,
        });
        setTimeout(function  ()  {
            _this.setData({
                isShowToast:  false
            });
        }, count);
    },
})
