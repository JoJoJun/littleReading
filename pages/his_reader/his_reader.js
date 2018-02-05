// his_reader.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var Book = Bmob.Object.extend("BookInf");
var query = new Bmob.Query(Book);
var test = "";
var that = this;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: '',
    userInfo: {},
    ttest: test,
    text: '',
    ChapterNum:0,
    hiddenn: true,
    showBottom: true,

    loading: false,
    loadingContact: false,
    chapter: {},
    selection: [], //段
    contentsIndex: 0,
    scrollHeight: 100,
    scrollTop: 0,
    recordScrollTop: 0,
    bookId: "",
    showBottom: false,
    fontSize:38,
    percentage:0.0,
    title:'',
    allchapter:0
  },
  scroll: function (e) {
    var that = this;
    that.setData({
      recordScrollTop: e.detail.scrollTop
    });
    console.log(e.detail.scrollTop)
  },


  save_process: function () {
    var that = this;
    var saveObj = new Object();
    saveObj.contentsIndex = this.data.ChapterNum;
    saveObj.scrollTop = this.data.recordScrollTop;
    //const key = this.data.bookId + constant.READER_INFO_KEY;
    wx.setStorage({
      key: that.data.bookId,
      data: saveObj
    })
    var currentUser = wx.getStorageSync("1");


    var Diary = Bmob.Object.extend("User_Book");
    var query = new Bmob.Query(Diary);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    query.equalTo("BookName", that.data.title);
    console.log('title:' + that.data.title)
    query.equalTo("username", currentUser.username);
    query.first({
      success: function (result) {
        // 回调中可以取得这个 diary 对象的一个实例，然后就可以修改它了
        result.set('Percentage', parseFloat(that.data.percentage.toFixed(2)));
        //result.set('Percentage', that.data.percentage);
        result.save();
        // The object was retrieved successfully.
      },
      error: function (object, error) {
        console.log('没存上')
      }
    });
  },

  showMenu: function (e) {
    const showBottom = !this.data.showBottom;
    this.setData({
      showBottom: showBottom
    })
  },

  slider4change: function (e) {
    this.setData({
      fontSize: e.detail.value
    })
    //util.saveData("fontSize", e.detail.value);
  },


  LastPage: function () {
    var that = this;
    var num = that.data.ChapterNum
    if (that.data.ChapterNum > 0 )
    {
      this.myfunction();
      that.setData({
      ChapterNum: num - 1,
      scrollTop: 0,
    })
      this.save_process();
    }
    else
    {
      var app = getApp();
      app.showToast('已经第一章啦', that, 2000);
    }
    console.log('next' + that.data.ChapterNum);
    

  },

  NextPage:function(){

    var that = this;
    
    var num = parseInt(that.data.ChapterNum)
    if ( that.data.ChapterNum < that.data.allchapter)
    {
      this.myfunction();
      that.setData({
      ChapterNum: num + 1,
      scrollTop: 0,
    })
      this.save_process();
    }
    else
    {
      var app = getApp();
      app.showToast('已经是最后一章啦', that, 2000);
    }
    console.log('next' + that.data.ChapterNum);
    

  },

  myfunction: function () {
    var that = this;
    that.setData({
      hiddenn: !this.data.hiddenn
    });
    console.log('myfunction' + that.data.bookId),
    
      query.get(that.data.bookId, {
        success: function (result) {
          // The object was retrieved successfully.
          //console.log((result.get("Chapter"))[that.data.ChapterNum])
          that.setData({
            ttest: (result.get("Chapter"))[that.data.ChapterNum],
            percentage: (parseInt(that.data.ChapterNum) + 1)*100 / result.get("ChapterNum"),
            allchapter: result.get("ChapterNum")
          })
          console.log('allchapter:' + that.data.allchapter);
          console.log('chNum:'+that.data.ChapterNum);
          console.log('per%:'+that.data.percentage)
          that.setData({
            hiddenn: !that.data.hiddenn
          });

          that.setData({
            scrollTop: parseInt(parseInt(that.data.recordScrollTop)+1)
          });
          console.log("scrLL:" + that.data.scrollTop)
        },
        error: function (result, error) {
          console.log("查询失败");
        }
      });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var fontSize = 39;
    try {
      fontSize = wx.getStorageSync("fontSize")
      if (!fontSize) {
        fontSize = 39;
      }
    } catch (e) {
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        })
        console.log("height:" + that.data.scrollHeight);
      }
    });

    that.setData({
      ChapterNum: options.contentsIndex,
      bookId: options.bookId,
      title:options.title,
      fontSize: fontSize,
    });
    this.myfunction();
   
    var body = test;
    const data = body.replace(/[ ]*/g, "");
    var selection = data.split("\n");
    that.setData({
      loading: false,
      selection: selection,
      loadingContact: false,
      //scrollTop: options.top+1,
      recordScrollTop: parseInt(parseInt(options.top)+1)
    });
    wx.setNavigationBarTitle({ title: options.title })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setData({
      scrollTop: parseInt(that.data.recordScrollTop)
    });
    console.log("scrLL:" + that.data.scrollTop)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   this.save_process();
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.save_process();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})