var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
Page({
  data: {
    isLog: false,
    isCollect: null,
    isBuy: null,
    isOnShelf: null,
    collection: "",
    purchase: "",
    username: null,
    userid: null,
    detaildata: {},
    result: [],
    index: null,
    nowName: null,

    writeDiary: false,
    loading: false,
    diaryList: [],
    modifyDiarys: false,
    CurrentUser: ""
  },
  onLoad: function (options) {
    that = this;
    var _this = this;
    const i = options.id;
    var currentUser = wx.getStorageSync("1");
    if (currentUser) {
      this.setData({
        CurrentUser: currentUser.username,
        isLog: true
      })
    }
    else {
      _this.setData({
        isLog: false
      })
    }
    // _this.setData({ username: currentUser});
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前选择好友页面
    var prevPage = pages[pages.length - 2];  //上一个编辑款项页面
    var _this = this;
    //判断是否收藏过
    var Diary = Bmob.Object.extend("User_Collect");
    var query = new Bmob.Query(Diary);
    this.setData({
      index: options.id,
      username: this.data.CurrentUser
    })
    query.equalTo("username", this.data.username);
    // console.log(this.data.username);
    console.log(this.data.index)
    console.log(prevPage.data.booklist[this.data.index].name)

    query.equalTo("BookName", prevPage.data.booklist[this.data.index].name);
    //  console.log(prevPage.data.booklist[this.data.index].name)；
    query.find({
      success: function (results) {
        if (results.length > 0) {
          _this.setData({
            isCollect: true
          })
          //  console.log("调用了true的refresh");
          _this.refresh();
        }
        else {
          _this.setData({
            isCollect: false
          })
          //  console.log("调用了false的refresh");
          _this.refresh();
        }
      }

    })
    //判断是否购买过
    var Diary2 = Bmob.Object.extend("Bought");
    var query2 = new Bmob.Query(Diary2);
    this.setData({
      index: options.id,
      username: this.data.CurrentUser
    })
    query2.equalTo("username", this.data.username);
    //  console.log(this.data.username);
    query2.equalTo("BookName", prevPage.data.booklist[this.data.index].name);
    //console.log(prevPage.data.booklist[this.data.index].name);
    query2.find({
      success: function (results) {
        if (results.length > 0) {
          _this.setData({
            isBuy: true
          })
          //console.log("调用了true的refresh");
          _this.refresh();
        }
        else {
          _this.setData({
            isBuy: false
          })
          //console.log("调用了false的refresh");
          _this.refresh();
        }
      }

    })
    //判断是否在书架上
    var Diary3 = Bmob.Object.extend("User_Book");
    var query3 = new Bmob.Query(Diary3);
    this.setData({
      index: options.id,
      username: this.data.CurrentUser
    })
    query3.equalTo("username", this.data.username);
    //console.log(this.data.username);
    query3.equalTo("BookName", prevPage.data.booklist[this.data.index].name);
    //console.log(prevPage.data.booklist[this.data.index].name);
    query3.find({
      success: function (results) {
        if (results.length > 0) {
          _this.setData({
            isOnShelf: true
          })
          //console.log("调用了true的refresh");
          _this.refresh();
        }
        else {
          _this.setData({
            isOnShelf: false
          })
          //console.log("调用了false的refresh");
          _this.refresh();
        }
      }
    })
  },
  refresh: function () {
    var _this = this;
    console.log("执行refresh")
    const i = this.data.index;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前选择好友页面
    var prevPage = pages[pages.length - 2];  //上一个编辑款项页面
    if (this.data.isCollect == true) {
      // console.log("tr");
      this.setData({
        username: this.data.CurrentUser,
        collection: "已收藏",
        detaildata: {
          "id": prevPage.data.booklist[this.data.index].id,
          "name": prevPage.data.booklist[this.data.index].name,
          "author": prevPage.data.booklist[this.data.index].author,
          "tag": prevPage.data.booklist[this.data.index].tag,
          "price": prevPage.data.booklist[this.data.index].price,
          "category": prevPage.data.booklist[this.data.index].category,
          "imgurl": prevPage.data.booklist[this.data.index].imgurl,
          "summary": prevPage.data.booklist[this.data.index].summary,
          "collection": "已收藏"
        },
      })
    }
    else {
      // console.log(this.data.detaildata.name);
      this.setData({
        username: this.data.CurrentUser,
        collection: "收藏",
        detaildata: {
          "id": prevPage.data.booklist[this.data.index].id,
          "name": prevPage.data.booklist[this.data.index].name,
          "author": prevPage.data.booklist[this.data.index].author,
          "tag": prevPage.data.booklist[this.data.index].tag,
          "price": prevPage.data.booklist[this.data.index].price,
          "category": prevPage.data.booklist[this.data.index].category,
          "imgurl": prevPage.data.booklist[this.data.index].imgurl,
          "summary": prevPage.data.booklist[this.data.index].summary,
          "collection": "收藏"
        },
      })
    }
    // console.log("goumai" + _this.data.isBuy + "shujia" + _this.data.isOnShelf);
    if (_this.data.isBuy == false) {
      _this.setData({
        purchase: "立即购买"
      })
    }
    else if (_this.data.isOnShelf == false) {
      _this.setData({
        purchase: "加入书架"
      })
    }
    else {
      _this.setData({
        purchase: "已购买"
      })
    }
    var temp = this.data.detaildata.name;
    getList(this, temp);
  },
  reserveHandle: function () {
    wx.navigateTo({
      url: '../detailreserve/detailreserve'
    })
  },
  goRead: function () {
    var _this = this;
    if (_this.data.detaildata.name != "数学之美") {
      wx.navigateTo({
        url: '../reader/reader?permit=false&bookname=' + _this.data.detaildata.name,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
    else {

    }
    console.log("执行了goRead");
  },
  goPurchase: function () {
    var _this = this;
    if (!this.data.isLog) {
      wx.showToast({
        title: '请先登录',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    var _this = this;
    if (_this.data.isBuy == false) {
      wx.showModal({
        title: '操作提示',
        content: '确定购买？',
        success: function (res) {
          if (res.confirm) {
            var Diary = Bmob.Object.extend("Bought");
            var diary = new Diary();
            diary.set("username", _this.data.username);
            diary.set("BookName", _this.data.detaildata.name);
            diary.set("pic", _this.data.detaildata.imgurl);
            diary.set("Percentage", 0);
            //添加数据，第一个入口参数是null
            diary.save(null, {
              success: function (result) {
                console.log("日记创建成功, objectId:" + result.id);
                _this.setData({
                  isBuy: true
                })
                wx.showToast({
                  title: '购买成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.refresh();
              },
              error: function (result, error) {
                console.log('创建日记失败');
                wx.showToast({
                  title: '购买失败',
                  icon: 'warn',
                  duration: 2000
                })
              }
            });
            //添加到书架
            var Diary1 = Bmob.Object.extend("User_Book");
            var diary1 = new Diary1();
            diary1.set("username", _this.data.username);
            diary1.set("BookName", _this.data.detaildata.name);
            diary1.set("pic", _this.data.detaildata.imgurl);
            diary1.set("Percentage", 0);
            //添加数据，第一个入口参数是null
            diary1.save(null, {
              success: function (result) {
                console.log("日记创建成功, objectId:" + result.id);
                _this.setData({
                  isOnShelf: true
                })
              },
              error: function (result, error) {
                console.log('创建日记失败');
                wx.showToast({
                  title: '购买失败',
                  icon: 'warn',
                  duration: 2000
                })
              }
            });
            //BookInf表修改数据
            var hot = 0;
            var collect = 0;
            var ID;
            var Diary2 = Bmob.Object.extend("BookInf");
            var temp = new Bmob.Query(Diary2);
            temp.equalTo("BookName", _this.data.detaildata.name);
            temp.find({
              success: function (results) {
                hot = results[0].get("HotNum");
                collect = results[0].get("BuyNum");
                ID = results[0].get("objectId");
              }
            })
            temp.get(ID, {
              success: function (result) {
                console.log("+1");
                result.set("HotNum", hot + 1);
                result.set("BuyNum", collect + 1);
                result.save();
              }

            })
          }
        }
      });
    }
    else {
      if (_this.data.isOnShelf == true) {
        wx.showToast({
          title: '已经在书架中了',
          icon: 'success',
          duration: 2000
        })
      }
      else {
        var Diary1 = Bmob.Object.extend("User_Book");
        var diary1 = new Diary1();
        diary1.set("username", _this.data.username);
        diary1.set("BookName", _this.data.detaildata.name);
        diary1.set("pic", _this.data.detaildata.imgurl);
        diary1.set("Percentage", 0);
        //添加数据，第一个入口参数是null
        diary1.save(null, {
          success: function (result) {
            console.log("日记创建成功, objectId:" + result.id);
            _this.setData({
              isOnShelf: true
            })
          },
          error: function (result, error) {
            console.log('创建日记失败');
            wx.showToast({
              title: '购买失败',
              icon: 'warn',
              duration: 2000
            })
          }
        });
        wx.showToast({
          title: '加入书架成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
    if (_this.data.isBuy == false) {
      _this.setData({
        purchase: "立即购买"
      })
    }
    else if (_this.data.isOnShelf == false) {
      _this.setData({
        purchase: "加入书架"
      })
    }
    else {
      _this.setData({
        purchase: "已购买"
      })
    }
    this.refresh();
  },
  collect: function () {
    var _this = this;
    if (!this.data.isLog) {
      wx.showToast({
        title: '请先登录',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    //console.log("执行了collect");
    var _this = this;
    if (!_this.data.isCollect) {
      // console.log("执行了添加")
      //User_Collect表添加数据
      var Diary = Bmob.Object.extend("User_Collect");
      var diary = new Diary();
      diary.set("username", _this.data.username);
      diary.set("BookName", _this.data.detaildata.name);
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          console.log("日记创建成功, objectId:" + result.id);
          _this.setData({
            isCollect: true
          })
          _this.refresh();
        },
        error: function (result, error) {
          console.log('创建日记失败');
        }
      });
      //BookInf表修改数据
      var hot = 0;
      var collect = 0;
      var ID;
      var Diary2 = Bmob.Object.extend("BookInf");
      var temp = new Bmob.Query(Diary2);
      temp.equalTo("BookName", this.data.detaildata.name);
      temp.find({
        success: function (results) {
          hot = results[0].get("HotNum");
          collect = results[0].get("CollectNum");
          ID = results[0].get("objectId");
        }
      })
      temp.get(ID, {
        success: function (result) {
          console.log("+1");
          result.set("HotNum", hot + 1);
          result.set("CollectNum", collect + 1);
          result.save();
        }

      })
    }
    else {
      var _this = this;
      var Diary = Bmob.Object.extend("User_Collect");
      var query = new Bmob.Query(Diary);
      query.equalTo("username", this.data.username);
      query.equalTo("BookName", this.data.detaildata.name);
      query.find({
        success: function (results) {
          if (results.length > 0) {
            var myObject = results[0];
            myObject.destroy({
              success: function (myObject) {
                console.log("delete")
                _this.setData({
                  isCollect: false
                })
                _this.refresh();
              },
            });
          } else {
            _this.setData({
              isCollect: false
            })
          }
        }
      })
      //BookInf表修改数据
      var hot = 0;
      var collect = 0;
      var ID;
      var Diary2 = Bmob.Object.extend("BookInf");
      var temp = new Bmob.Query(Diary2);
      temp.equalTo("BookName", this.data.detaildata.name);
      temp.find({
        success: function (results) {
          hot = results[0].get("HotNum");
          collect = results[0].get("CollectNum");
          ID = results[0].get("objectId");
        }
      })
      temp.get(ID, {
        success: function (result) {
          console.log("+1");
          result.set("HotNum", hot - 1);
          result.set("CollectNum", collect - 1);
          result.save();
        },

      })
    }
  },
  noneWindows: function () {
    // console.log("cbhgbghjd")
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    /*var temp = this.data.detaildata.name;
    console.log(temp)
     getList(this, temp);*/
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAddDiary: function () {
    that.setData({
      writeDiary: true
    })
  },
  addDiary: function (event) {
    var _this = this;
    if (!this.data.isLog) {
      wx.showToast({
        title: '请先登录',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    var title = this.data.detaildata.name;
    var content = event.detail.value.content;
    if (!content) {
      console.log("空的")
      wx.showToast({
        title: '评论不能为空',
        icon: 'loading',
        duration: 2000
      })
    }
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();

      var User = Bmob.Object.extend("User_Comms");
      var UserModel = new User();

      // var post = Bmob.Object.createWithoutData("_User", "594fdde53c");

      //增加日记
      var Diary = Bmob.Object.extend("User_Comms");
      var diary = new Diary();
      diary.set("BookName", title);
      console.log("1---");
      diary.set("comment", content);
      console.log("2---");
      diary.set("username", this.data.username);
      console.log("3---");
      // if (currentUser) {
      //    UserModel.id = currentUser.id;
      // diary.set("own", UserModel);
      //}
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            writeDiary: false,
            loading: false
          })
          that.refresh();
        },
        error: function (result, error) {
          // 添加失败
          wx.showToast({
            title: '评论失败',
            icon: 'loading',
            duration: 2000
          })

        }
      });
    }
  },
  closeLayer: function () {
    that.setData({
      writeDiary: false
    })
  },

  toModifyDiary: function (event) {
    var nowTile = event.target.dataset.title;
    var nowContent = event.target.dataset.content;
    var nowId = event.target.dataset.id;
    that.setData({
      modifyDiarys: true,
      nowTitle: nowTile,
      nowContent: nowContent,
      nowId: nowId
    })
  },
  modifyDiary: function (e) {
    var t = this;
    modify(t, e)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  onShareAppMessage: function () {
    return {
      title: '小小阅读',
      desc: '我向你分享了一本书哦~',
      path: '/page/user?id=123'
    }
  },

  inputTyping: function (e) {
    //搜索数据
    getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  }
})

function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("User_Comms");
  var query = new Bmob.Query(Diary);
  query.descending('createdAt');
  // query.include("own")
  // 查询所有数据
  //query.limit(that.data.limit);
  query.equalTo("BookName", k);
  console.log(k)
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      that.setData({
        diaryList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
function modify(t, e) {
  var that = t;
  //修改日记
  var modyTitle = e.detail.value.title;
  var modyContent = e.detail.value.content;
  var objectId = e.detail.value.content;
  var thatTitle = that.data.nowTitle;
  var thatContent = that.data.nowContent;
  if ((modyTitle != thatTitle || modyContent != thatContent)) {
    if (modyContent == "") {
      wx.showToast({
        title: '评论不能为空',
        icon: 'loading',
        duration: 2000
      })
    }
    else {
      //console.log(modyContent)
      var Diary = Bmob.Object.extend("diary");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('title', modyTitle);
          result.set('content', modyContent);
          result.save();
          common.showTip('修改成功', 'success', function () {
            that.onShow();
            that.setData({
              modifyDiarys: false
            })
          });
          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyContent == "") {
    wx.showToast({
      title: '评论不能为空',
      icon: 'loading',
      duration: 2000
    })
  }
  else {
    that.setData({
      modifyDiarys: false
    })
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
  }
}
