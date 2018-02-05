var Bmob = require('../../utils/bmob.js');



Page({
  data: {
    showLoading: true,
    isLoading: true,//正在加载
    isSearch: false,
    isEmpty: false,
    showsearch: false,   //显示搜索按钮
    searchtext: '',  //搜索文字
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    sortindex: 0,  //一级分类索引
    sortid: null,  //一级分类id
    subsortindex: 0, //二级分类索引
    subsortid: null, //二级分类id
    orderindex: 0,  //一级城市索引
    orderid: null,  //一级城市id
    suborderindex: 0,  //二级城市索引
    suborderid: null, //二级城市id
    booklist: [],
    downloadlist: [],
    scrolltop: null, //滚动位置
    page: 0  //分页
  },
  onLoad: function () { //加载数据渲染页面
    this.fetchBookListData();
    this.fetchFilterData();
    var currentUser = wx.getStorageSync("1");
    console.log(currentUser.username)

    Bmob.User.logIn(currentUser.username, currentUser.password, {
      success: function (user) {
        // Do stuff after successful login.
        console.log("MY!!!login!")
      },
      error: function (user, error) {
        // The login failed. Check error to see why.
        console.log("ouch no log?")
      }
    });
    if (currentUser) {
      // do stuff with the user
      console.log(currentUser.username);
    } else {
      console.log('??????not logged??');
      // show the signup or login page
      wx.openSetting({ success: (res) => { console.log(res); } });
      wx.login({
        success: function (res) {
          if (res.code) {
            Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
              success: function (userData) {
                wx.getUserInfo({
                  success: function (result) {
                    console.log("login success")
                    var userInfo = result.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl;

                    //var Diary = Bmob.Object.extend("_User");
                    // var query = new Bmob.Query(Diary);
                    //   query.equalTo("Category", "文学");


                    var user = new Bmob.User();//开始注册用户
                    user.set("username", nickName);
                    user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                    user.set("userData", userData);
                    user.set("userPic", avatarUrl);
                    wx.setStorage({
                      key: "1",
                      data: user
                    })
                    user.signUp(null, {
                      success: function (res) {
                        console.log("注册成功!");
                      },
                      error: function (userData, error) {
                        console.log(error)
                      }
                    });
                  }
                })
              },
              error: function (error) {
                // Show the error message somewhere
                console.log("Error: " + error.code + " " + error.message);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },


  fetchFilterData: function () { //获取筛选条件
    this.setData({
      filterdata: {
        "sort": [
          {
            "id": 0,
            "title": "全部"
          },
          {
            "id": 1,
            "title": "文学",
            "subsort": [
              {
                "id": 1,
                "title": "全部"
              },
              {
                "id": 11,
                "title": "名著"
              },
              {
                "id": 12,
                "title": "散文"
              },
              {
                "id": 13,
                "title": "诗歌"
              },
              {
                "id": 14,
                "title": "其他"
              }
            ]
          },
          {
            "id": 2,
            "title": "生活",
            "subsort": [
              {
                "id": 2,
                "title": "全部"
              },
              {
                "id": 21,
                "title": "管理"
              },
              {
                "id": 22,
                "title": "时间"
              },
              {
                "id": 23,
                "title": "人生"
              },
              {
                "id": 24,
                "title": "其他"
              }
            ]
          },
          {
            "id": 3,
            "title": "小说",
            "subsort": [
              {
                "id": 3,
                "title": "全部"
              },
              {
                "id": 31,
                "title": "青春爱情"
              },
              {
                "id": 32,
                "title": "玄幻武侠"
              },
              {
                "id": 33,
                "title": "悬疑推理"
              },
              {
                "id": 34,
                "title": "其他"
              }
            ]
          },
          {
            "id": 4,
            "title": "历史",
            "subsort": [
              {
                "id": 4,
                "title": "全部"
              },
              {
                "id": 41,
                "title": "中国历史"
              },
              {
                "id": 42,
                "title": "世界历史"
              },
              {
                "id": 43,
                "title": "人物传记"
              },
              {
                "id": 44,
                "title": "其他"
              }
            ]
          },
          {
            "id": 5,
            "title": "其他"
          }
        ],
        "order": [
          {
            "id": 0,
            "title": "默认排序"
          },
          {
            "id": 1,
            "title": "按热度排序",

          },
          {
            "id": 2,
            "title": "按销量排序",
          },
          {
            "id": 3,
            "title": "综合排序"
          }
        ]
      }
    })
  },

  fetchBookListData: function () {  //获取城市列表
    let _this = this;
    /*wx.showToast({
       title: '加载中',
       icon: 'loading'
     })*/
    const perpage = 10;
    this.setData({
      page: this.data.page + 1,
      booklist: []
    })
    const page = this.data.page;
    const newlist = [];
    const newdownloadlist = [];
    var Diary = Bmob.Object.extend("BookInf");
    var query = new Bmob.Query(Diary);
    if (this.data.sortid == 1) {
      query.equalTo("Category", "文学");
      if (this.data.subsortid == 1)
        query.equalTo("SubCategory", "名著");
      if (this.data.subsortid == 2)
        query.equalTo("SubCategory", "散文");
      if (this.data.subsortid == 3)
        query.equalTo("SubCategory", "诗歌");
      if (this.data.subsortid == 4)
        query.notEqualTo("SubCategory", "名著");
      query.notEqualTo("SubCategory", "散文");
      query.notEqualTo("SubCategory", "诗歌");
    }
    if (this.data.sortid == 2) {
      query.equalTo("Category", "生活");
      if (this.data.subsortid == 1)
        query.equalTo("SubCategory", "管理");
      if (this.data.subsortid == 2)
        query.equalTo("SubCategory", "时间");
      if (this.data.subsortid == 3)
        query.equalTo("SubCategory", "人生");
      if (this.data.subsortid == 4)
        query.notEqualTo("SubCategory", "人生");
      query.notEqualTo("SubCategory", "时间");
      query.notEqualTo("SubCategory", "管理");
    }
    if (this.data.sortid == 3) {
      query.equalTo("Category", "小说");
      if (this.data.subsortid == 1)
        query.equalTo("SubCategory", "青春爱情");
      if (this.data.subsortid == 2)
        query.equalTo("SubCategory", "玄幻武侠");
      if (this.data.subsortid == 3)
        query.equalTo("SubCategory", "悬疑推理");
      if (this.data.subsortid == 4)
        query.notEqualTo("SubCategory", "青春爱情");
      query.notEqualTo("SubCategory", "玄幻武侠");
      query.notEqualTo("SubCategory", "悬疑推理");
    }
    if (this.data.sortid == 4) {
      query.equalTo("Category", "历史");
      if (this.data.subsortid == 1)
        query.equalTo("SubCategory", "中国历史");
      if (this.data.subsortid == 2)
        query.equalTo("SubCategory", "世界历史");
      if (this.data.subsortid == 3)
        query.equalTo("SubCategory", "人物传记");
      if (this.data.subsortid == 4)
        query.notEqualTo("SubCategory", "中国历史");
      query.notEqualTo("SubCategory", "世界历史");
      query.notEqualTo("SubCategory", "人物传记");
    }
    if (this.data.sortid == 5) {
      query.notEqualTo("Category", "生活");
      query.notEqaulTo("Category", "文学");
      query.notEqaulTo("Category", "小说");
      query.notEqaulTo("Category", "历史");
    }
    if (this.data.orderid == 1)
      query.descending("CollectNum");
    if (this.data.orderid == 2)
      query.descending("BuyNum");
    if (this.data.orderid == 3)
      query.descending("HotNum");
    if (this.data.isSearch) {
      _this.setData({
        isLoading:true,
        loading:true
      })
      var query1 = new Bmob.Query(Diary);
      query1.equalTo("BookName", this.data.searchtext);
      // console.log(this.data.searchtext);
      var query2 = new Bmob.Query(Diary);
      query2.equalTo("Author", this.data.searchtext);
      query = Bmob.Query.or(query1, query2);
      this.setData({
        isSearch: false,
        loading:false,
        isLoading:false
      })
    }
    var that = this;
    query.limit(1000);
    query.find({
      success: function (results) {
        // 循环处理查询到的数据
        if (results.length < 1) {
          that.setData({
            isEmpty: true
          })
        }
        else{
           that.setData({
            isEmpty: false
          })
        }
        console.log("isEmpty  "+_this.data.isEmpty);
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          newlist.push({
            "id": i,
            "name": object.get('BookName'),
            "tag": object.get('Category'),
            "category": object.get('Category'),
            "imgurl": object.get('Picture_URL'),
            "price": object.get('Price'),
            "author": object.get('Author'),
            "summary": object.get('Summary'),
          })
        }
        
        setTimeout(() => {
          _this.setData({
            booklist: _this.data.booklist.concat(newlist),
          })
        }, 1500)
        that.setData({
          showLoading: false,
          loading: false
        })
        console.log('isLoading: ' + that.data.isLoading);
      }
    });
  },
  inputSearch: function (e) {  //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function () {  //提交搜索
    console.log(this.data.searchtext);
    this.setData({
      isSearch: true
    })
    this.fetchBookListData();
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
    console.log(d.showfilterindex);
  },
  setSortIndex: function (e) { //图书类别一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid,
      subsortindex: d.sortindex == dataset.sortindex ? d.subsortindex : 0
    })
    // console.log('sortid：一级--' + this.data.sortid + ',二级--' + this.data.subsortid);
    this.fetchBookListData();
  },
  setSubsortIndex: function (e) { //图书类别二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subsortindex: dataset.subsortindex,
      subsortid: dataset.subsortid,
    })
    //console.log('sortid：一级--' + this.data.sortid + ',二级--' + this.data.subsortid);
    this.fetchBookListData();
  },
  setorderIndex: function (e) { //排序方式一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      orderindex: dataset.orderindex,
      orderid: dataset.orderid,
      suborderindex: d.orderindex == dataset.orderindex ? d.suborderindex : 0
    })
    // console.log('orderid：一级--' + this.data.orderid + ',二级--' + this.data.suborderid);
    this.fetchBookListData();
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  /* scrollHandle: function (e) { //滚动事件
     this.setData({
       scrolltop: e.detail.scrollTop
     })
   },
   goToTop: function () { //回到顶部
     this.setData({
       scrolltop: 0
     })
   },
   scrollLoading: function () { //滚动加载
     this.fetchBookListData();
   },*/
  onPullDownRefresh: function () { //下拉刷新
    this.setData({
      page: 0,
      booklist: []
    })
    this.fetchBookListData();
    this.fetchFilterData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  showLoading: function () {
    this.setData({
      showLoading: true
    })
  },
  cancelLoading: function () {
    this.setData({
      showLoading: false
    })
  }
})