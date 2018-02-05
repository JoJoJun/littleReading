// his_reader.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');

var test = "";
var _this = this;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: '',
    userInfo: {},
    username: '',
    ttest: test,
    text: '',
    ChapterNum: 0,
    hiddenn: true,
    showBottom: true,
    ID: {},
    loading: true,
    loadingContact: false,
    chapter: {},
    selection: [], //段
    contentsIndex: 0,
    scrollHeight: 100,
    scrollTop: 0,
    recordScrollTop: 0,
    bookId: "",
    name: "",
    permit: false,
    showBottom: false,
  },

  showMenu: function (e) {
    if (this.data.loadingContact) {
      return;
    }
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
    var _this = this;
    var num = _this.data.ChapterNum
    if (_this.data.ChapterNum > 0) {
      _this.setData({
        ChapterNum: num - 1
      })
      this.myfunction();
    }
    else {
      wx.showToast({
        title: '这是第一章！',
        icon: 'loading',
        duration: 2000
      })
    }
    //console.log('next' + _this.data.ChapterNum);
  },

  NextPage: function () {
    var _this = this;
    console.log("next  "+ _this.data.permit);
    
    if (_this.data.permit=="true") {
       console.log("显示true了")
      var num = _this.data.ChapterNum
      _this.setData({
        ChapterNum: num + 1,
        scrollTop: 0,
      })
      //console.log('next' + _this.data.ChapterNum);
      this.myfunction();
    }
    else {
      console.log("显示false了")
      wx.showToast({
        title: '只能试读一章哦！',
        icon: 'loading',
        duration: 2000
      })
    }
  },

  myfunction: function () {
    //console.log(this.data.ChapterNum);
    var _this = this;
    var name;
    _this.setData({
      hiddenn: !this.data.hiddenn
    });
    // console.log(name);
    wx.setNavigationBarTitle({ title: _this.data.name });
    var _this = this;
    var Book = Bmob.Object.extend("BookInf");
    var query = new Bmob.Query(Book);
    query.equalTo("BookName", _this.data.name);
    query.find({
      success: function (result) {
        // The object was retrieved successfully.
        // console.log((result.get("Chapter"))[_this.data.ChapterNum])
        _this.setData({
          ttest: (result[0].get("Chapter"))[_this.data.ChapterNum]
        })
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
    if (_this.data.permit==true) {
      var Diary2 = Bmob.Object.extend("User_Book");
      var temp = new Bmob.Query(Diary2);
      temp.equalTo("username", this.data.username);
      temp.equalTo("BookName", this.data.name);
      var ID;
      temp.find({
        success: function (results) {
          ID = results[0].get("objectId");
        }
      })
      temp.get(ID, {
        success: function (result) {
          result.set("PageNum", _this.data.ChapterNum);
          result.save();
        }

      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var _this = this;
    _this.setData({
      name: options.bookname,
      permit: options.permit,
      username: 'default'
    })
    console.log(_this.data.permit);
    if (_this.data.permit=="true") {
      var first = Bmob.Object.extend("User_Book");
      var f = new Bmob.Query(first);
      f.equalTo("BookName", _this.data.name);
      f.equalTo("username", _this.data.username);
      f.find({
        success: function (res) {
          _this.setData({
            ChapterNum: res[0].get("PageNum")
          })
        }
      })
    }
    else {
      _this.setData({
        ChapterNum: 0
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight,
        })
      }
    });
    this.myfunction();
    console.log(_this.data.ChapterNum);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    var num = _this.data.ChapterNum;
    console.log("aaa" + num);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})