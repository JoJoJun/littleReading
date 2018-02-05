var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    goods: {},
    goodList: {},
    showView: true,
    carts: false,
    labelList: ["全部",],
    username: null,
    myid: '',
    isEmpty: false,
    isLog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    showView: (options.showView == "true" ? true : false)
    var currentUser = wx.getStorageSync("1");
    if (currentUser) {
      this.setData({
        username: currentUser.username,
        isEmpty: false,
        showLoading: true,
        isLog: true
      })
    }
    else {
      this.setData({
        isLog: false,
        isEmpty: true,
        showLoading:false
      })
    }
  },
  onChangeShowState: function () {
    var that = this;
    //console.log('clicked');
    that.setData({
      showView: (!that.data.showView)
    });

  },
  toAddCart: function (event) {
    var that = this;
    var nowTile = event.target.dataset.title;
    var nowId = event.target.dataset.id;

    that.setData({
      carts: true,
      nowTitle: nowTile,
      nowId: nowId

    });
  },
  addCart: function (event) {
    var label = event.detail.value.title;
    // var bookname = event.detail.value.BookName;
    var bookname = this.data.nowTitle;
    var that = this;

    var objectId = that.data.nowId;

    var arrL = Bmob.Object.extend("User_Book");
    var query = new Bmob.Query(arrL);

    query.get(objectId, {
      success: function (res) {
        res.addUnique("BookLabel", label);
        console.log("add success to user-book");
        res.save();
        //queryLabels(that, label);
        // that.onShow();
      },
      error: function () {
        console.log('error in query');
      }
    });

    var Blabel = Bmob.Object.extend("Labels");
    var User_Book_Label = new Blabel();
    var befQuery = new Bmob.Query(Blabel);
    var temp;

    console.log('this is queryLabels function!');
    befQuery.equalTo("username", that.data.username);
    befQuery.equalTo("label", label);
    befQuery.find({
      success: function (res) {
        if (res.length < 1) {
          console.log('arrive into Labels add');
          User_Book_Label.set("label", label);
          User_Book_Label.set("username", that.data.username);
          //添加数据，第一个入口参数是null
          User_Book_Label.save(null, {
            success: function (result) {
              console.log("标签创建成功, objectId:" + result.id);
              that.onShow();
            },
            error: function (result, error) {
              console.log('创建失败');
            },
          });
        }
      }
    });
    that.setData({
      carts: false
    });
    that.onShow();
  },

  deleteLabel: function (event) {
    console.log('delete label');
    var objectId = event.target.dataset.id;
    var name = event.target.dataset.name;
    var that = this;
    console.log('delete label');
    var book = Bmob.Object.extend("User_Book");
    var query = new Bmob.Query(book);
    wx.showModal({
      title: '操作提示',
      content: '确定要删除该标签？',
      success: function (res) {
        if (res.confirm) {
          query.get(objectId, {
            success: function (result) {
              result.remove("BookLabel", name);
              result.save();
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              /* that.setData({
                 showLoading: false,
                 loading: false
               })*/
              that.onShow();
            },
            error: function (error) {
              console.log("Error: " + error.code + " " + error.message);
            }
          });
          that.setData({
            showLoading: false,
            loading: false
          })
          //判断是否需要删除标签
          query = new Bmob.Query(book);
          query.equalTo("BookLabel", name);
          query.find({
            success: function (res) {
              console.log('have checked' + res.length)
              if (res.length == 1) {
                var Labels = Bmob.Object.extend("Labels");
                var labelquery = new Bmob.Query(Labels);
                labelquery.equalTo("label", name);
                labelquery.equalTo("username", that.data.username);
                labelquery.destroyAll({

                  success: function () {

                    console.log('delete');
                    that.onShow();
                  },/*
            error: function (err) {
              wx.showToast({
                title: '删除另一个表失败',
                icon: 'warn',
                duration: 5000
              })
            }*/
                });
              }
            }
          }
          )

        }
      }
    });
    query = new Bmob.Query(book);
    query.equalTo("username", that.data.username);
    query.find({
      success: function (res) {
        that.setData({
          goods: res
        })
      }
    })
    that.onShow();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  noneWindows: function () {
    var that = this;
    that.setData({
      carts: false,
    })
  },

  DeleteBook: function (event) {
    var objectId = event.target.dataset.id;
    var that = this;
    //console.log('delete1');
    var lllname;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除本书？',
      success: function (res) {
        if (res.confirm) {
          var book = Bmob.Object.extend("User_Book");
          var query4 = new Bmob.Query(book);
          query4.equalTo("objectId", objectId);
          query4.find({
            success: function (res) {
              var tmp = res[0].get("BookLabel");
              console.log(tmp);
              for (var i = 0; i < tmp.length; i++) {
                //判断是否需要删除标签
                var Labels = Bmob.Object.extend("Labels");
                var labelquery = new Bmob.Query(Labels);
                labelquery.equalTo("label", tmp[i]);
                labelquery.equalTo("username", that.data.username);
                labelquery.destroyAll({
                  success: function () {
                    console.log('delete');
                    that.onShow();
                  },
                });
              }
              that.setData({
                lllname: res
              })
              console.log('when delete, read the labels ');
            }
          })
          query4.destroyAll({
            success: function () {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            },
            error: function (err) {
              wx.showToast({
                title: '删除失败',
                icon: 'warn',
                duration: 2000
              })
            }
          });
        }
      }
    });
    that.onShow();
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    var _this = this;
    if (!this.data.isLog) {
      _this.setData({
        isEmpty: true,
        isLoading: false
      })
    }
    console.log('onShow');
    var userbook = Bmob.Object.extend("User_Book");
    var query = new Bmob.Query(userbook);
    var that = this;
    query.equalTo("username", that.data.username);
    query.find({
      success: function (results) {
        //console.log('there are ' + results.length + ' records');
        if (results.length < 1)
          that.setData({
            isEmpty: true
          })
        else {
          that.setData({
            isEmpty: false
          })
        }
        that.setData({
          goods: results,
          carts: false,
          showLoading: false,
          //isEmpty: results.length < 1 ?"这里空空如也":""
        })
      }
    });
    var label = Bmob.Object.extend("Labels");
    var labelQuery = new Bmob.Query(label);
    labelQuery.equalTo("username", that.data.username);
    //labelQuery.equalTo("username",that.data.username);
    labelQuery.find({
      success: function (res) {
        //console.log("label list");
        that.setData({
          labelList: res,
          carts: false
        })
      }
    });
  },

  classify: function (event) {
    var label = event.target.dataset.label;
    var that = this;
    getList(that, label);
  },

  myfunction: function (event) {
    var _this = this;
    if (!this.data.isLog) {
      _this.setData({
        isEmpty: true,
        isLoading: false,
        loading: false
      })
      return;
    }
    console.log('This is myfunction！');
    var that = this;
    //const id = ;//e.currentTarget.dataset.id;
    const title = event.currentTarget.id;
    var Diary = Bmob.Object.extend("BookInf");
    var query = new Bmob.Query(Diary);
    query.equalTo("BookName", title);
    query.first({
      success: function (object) {
        // 查询成功
        that.setData({
          myid: object.id
        })
        const id = that.data.myid;
        console.log("myid:" + id);
        //e.currentTarget.dataset.title;
        try {
          var readInfo = wx.getStorageSync(id)//(id + constant.READER_INFO_KEY)
          if (!readInfo) {
            readInfo = new Object();
            readInfo.contentsIndex = 0;
            readInfo.scrollTop = 0;
          }
          console.log(readInfo);
          const top = readInfo.scrollTop;
          console.log('要跳啦！');
          wx.navigateTo({
            url: "../his_reader/his_reader?contentsIndex=" + readInfo.contentsIndex + "&top=" + top + "&bookId=" + id + "&title=" + title
          })
        } catch (e) {
          console.log('跳转失败');
          // Do something when catch error,异常处理
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },




  goRead: function (event) {
    var that = this;
    console.log("event  " + event.currentTarget.id);
    wx.navigateTo({
      url: '../reader/reader?bookname=' + event.currentTarget.id + '&permit=true',
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
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },
})
function queryLabels(t, label) {
  var _this = this;
  if (!this.data.isLog) {
    _this.setData({
      isEmpty: true,
      isLoading: false,
      loading: false
    })
    return;
  }
  async: false;
  var Blabel = Bmob.Object.extend("Labels");
  var User_Book_Label = new Blabel();
  var befQuery = new Bmob.Query(Blabel);
  var temp;

  console.log('this is queryLabels function!');
  befQuery.equalTo("username", t.data.username);
  befQuery.find({
    success: function (res) {
      for (var i = 0; i < res.length; i++) {
        temp = res[i].get("label");
        console.log(i + '  ' + temp + ' ' + label);
        if (temp == label) {
          console.log('come in!!!!!!')
          t.setData({
            flag: 'false'
          })
            ;
        }
      }
    }
  });
  // console.log("queryLabels 's  flag "+ flag );
  changeLabels(t, label, t.data.username);
}
function changeLabels(t, label, username) {
  var _this = this;
  if (!this.data.isLog) {
    _this.setData({
      isEmpty: true,
      isLoading: false,
      loading: false
    })
    return;
  }
  var Blabel = Bmob.Object.extend("Labels");
  var User_Book_Label = new Blabel();
  if (t.data.flag == 'true') {
    console.log('arrive into Labels add');
    User_Book_Label.set("label", label);
    User_Book_Label.set("username", username);
    //添加数据，第一个入口参数是null
    User_Book_Label.save(null, {
      success: function (result) {
        console.log("标签创建成功, objectId:" + result.id);
        t.onShow();
      },
      error: function (result, error) {
        console.log('创建失败');
      },
    });
  }
}
function getList(t, k) {
  var _this = this;
  /*if (!_this.data.isLog) {
    _this.setData({
      isEmpty: true,
      isLoading: false,
      loading: false
    })
    return;
  }*/
  var that = t;
  var userbook = Bmob.Object.extend("User_Book");
  var query = new Bmob.Query(userbook);
  query.equalTo("username", that.data.username);

  if (k == "全部") {
    query.find({
      success: function (results) {
        //console.log('there are ' + results.length + ' records');

        that.setData({
          goods: results
        })
        ////console.log(goods.BookName)
      }
    });
  }
  else {
    query.equalTo("BookLabel", k);
    query.find({
      success: function (results) {
        //console.log('there are ' + results.length + ' records');
        that.setData({
          goods: results
        })
        ////console.log(goods.BookName)
      }
    });
  }
}