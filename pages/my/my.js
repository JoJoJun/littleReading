


//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    user:null,
  },
 
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      user: wx.getStorageSync("1")
    })

   app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
