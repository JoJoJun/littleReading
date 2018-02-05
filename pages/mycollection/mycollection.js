var Bmob = require('../../utils/bmob.js');
Page({
    data: {
        isPurchase: {},
        username: null,
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
        scrolltop: null, //滚动位置
        page: 0, //分页
        isEmpty: false,
        showLoading: true,
        num: 0
    },
    onLoad: function () { //加载数据渲染页面
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
                isEmpty: true
            })
        }
        this.fetchBookListData();
        this.fetchFilterData();

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
                ]
            }
        })
    },
    fetchBookListData: function () {  //获取城市列表
        let _this = this;
        /* wx.showToast({
             title: '加载中',
             icon: 'loading'
         })*/
        const perpage = 10;
        this.setData({
            page: this.data.page + 1,
            booklist: []
        })
        const page = _this.data.page;
        var Diary_new = Bmob.Object.extend("User_Collect");
        var query_new = new Bmob.Query(Diary_new);
        query_new.equalTo("username", _this.data.username);
        //console.log(this.data.username);
        query_new.find({
            success: function (results_new) {
                // 循环处理查询到的数据  
                const percent = [];
                const time = [];
                _this.setData({
                    num: 0
                })
                if (!(results_new.length < 1)) {
                    for (var j = 0; j < results_new.length; j++) {
                        var Diary = Bmob.Object.extend("BookInf");
                        var query = new Bmob.Query(Diary);
                        time[j] = results_new[j].get('createdAt');
                        percent[j] = results_new[j].get('Percentage');
                        query.equalTo("BookName", results_new[j].get('BookName'));
                        const newlist = [];
                        //console.log(results_new[j]);
                        if (_this.data.sortid == 1) {
                            query.equalTo("Category", "文学");
                            if (_this.data.subsortid == 1)
                                query.equalTo("SubCategory", "名著");
                            if (_this.data.subsortid == 2)
                                query.equalTo("SubCategory", "散文");
                            if (_this.data.subsortid == 3)
                                query.equalTo("SubCategory", "诗歌");
                            if (_this.data.subsortid == 4)
                                query.notEqualTo("SubCategory", "名著");
                            query.notEqualTo("SubCategory", "散文");
                            query.notEqualTo("SubCategory", "诗歌");
                        }
                        if (_this.data.sortid == 2) {
                            query.equalTo("Category", "生活");
                            if (_this.data.subsortid == 1)
                                query.equalTo("SubCategory", "管理");
                            if (_this.data.subsortid == 2)
                                query.equalTo("SubCategory", "时间");
                            if (_this.data.subsortid == 3)
                                query.equalTo("SubCategory", "人生");
                            if (_this.data.subsortid == 4)
                                query.notEqualTo("SubCategory", "人生");
                            query.notEqualTo("SubCategory", "时间");
                            query.notEqualTo("SubCategory", "管理");
                        }
                        if (_this.data.sortid == 3) {
                            query.equalTo("Category", "小说");
                            if (_this.data.subsortid == 1)
                                query.equalTo("SubCategory", "青春爱情");
                            if (_this.data.subsortid == 2)
                                query.equalTo("SubCategory", "玄幻武侠");
                            if (_this.data.subsortid == 3)
                                query.equalTo("SubCategory", "悬疑推理");
                            if (_this.data.subsortid == 4)
                                query.notEqualTo("SubCategory", "青春爱情");
                            query.notEqualTo("SubCategory", "玄幻武侠");
                            query.notEqualTo("SubCategory", "悬疑推理");
                        }
                        if (_this.data.sortid == 4) {
                            query.equalTo("Category", "历史");
                            if (_this.data.subsortid == 1)
                                query.equalTo("SubCategory", "中国历史");
                            if (_this.data.subsortid == 2)
                                query.equalTo("SubCategory", "世界历史");
                            if (_this.data.subsortid == 3)
                                query.equalTo("SubCategory", "人物传记");
                            if (_this.data.subsortid == 4)
                                query.notEqualTo("SubCategory", "中国历史");
                            query.notEqualTo("SubCategory", "世界历史");
                            query.notEqualTo("SubCategory", "人物传记");
                        }
                        if (_this.data.sortid == 5) {
                            query.notEqualTo("Category", "生活");
                            query.notEqaulTo("Category", "文学");
                            query.notEqaulTo("Category", "小说");
                            query.notEqaulTo("Category", "历史");
                        }
                        if (_this.data.orderid == 1)
                            query.descending("CollectNum");
                        if (_this.data.orderid == 2)
                            query.descending("BuyNum");
                        if (_this.data.orderid == 3)
                            query.descending("HotNum");
                        query.find({
                            success: function (results) {
                                // 循环处理查询到的数据
                                for (var i = 0; i < results.length; i++) {
                                    var object = results[i];
                                    newlist.push({
                                        "id": _this.data.num,
                                        "name": object.get('BookName'),
                                        "tag": object.get('Category'),
                                        "category": object.get('Category'),
                                        "imgurl": object.get('Picture_URL'),
                                        "price": object.get('Price'),
                                        "author": object.get('Author'),
                                        "summary": object.get('Summary'),
                                        "time": time.shift(),
                                        "percent": percent.shift()
                                    })
                                    var tmp = _this.data.num;
                                    console.log("tmp    " + tmp)
                                    _this.setData({
                                        num: tmp + 1
                                    })
                                }
                                setTimeout(() => {
                                    _this.setData({
                                        booklist: _this.data.booklist.concat(newlist),
                                        showLoading: false
                                    })
                                }, 1500)
                            }
                        });
                        var Diary_p = Bmob.Object.extend("User_Book");
                        var query_p = new Bmob.Query(Diary_new);
                        query_p.equalTo("username", _this.data.username);
                        query_p.equalTo("BookName", _this.data.username);
                        query_p.find({
                            success: function (results_p) {
                                if (results_p.length > 0) {
                                    _this.setData({
                                        isPurchase: "      已购买"
                                    })
                                }
                                else {
                                    _this.setData({
                                        isPurchase: "      未购买"
                                    })
                                }
                            }
                        })
                    }

                }
                else {
                    _this.setData({
                        isEmpty: true,
                        showLoading: false
                    })
                }

            }
        })
    },
    inputSearch: function (e) {  //输入搜索文字
        this.setData({
            showsearch: e.detail.cursor > 0,
            searchtext: e.detail.value
        })
    },
    submitSearch: function () {  //提交搜索
        //console.log(this.data.searchtext);
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
        // console.log(d.showfilterindex);
    },
    setSortIndex: function (e) { //图书类别一级索引
        const d = this.data;
        const dataset = e.currentTarget.dataset;
        this.setData({
            sortindex: dataset.sortindex,
            sortid: dataset.sortid,
            subsortindex: d.sortindex == dataset.sortindex ? d.subsortindex : 0
        })
        // console.log('sortid：一级--' +this.data.sortid + ',二级--' + this.data.subsortid);
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
})