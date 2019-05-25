// pages/list_combination/list_combination.js
Page({
  data: {
    winHeight: 0, //窗口高度
    dataList_combination: [],
    dataList_commercial: [],
    dataList_HAF: [],
    currentTab: "", //当前的标签索
    scroll_height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更换标题栏
    wx.setNavigationBarTitle({
      title: '月供详情'
    })

    var that = this;
    var height = 0; //屏幕高度
    var scroll_height = 0;

    //swiper高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88; //88是swiper-tab的高度
        scroll_height = height - 100;
      }
    });

    var windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    var windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    var dataList_combination = JSON.parse(options.dataList_combination);
    var dataList_commercial = JSON.parse(options.dataList_commercial);
    var dataList_HAF = JSON.parse(options.dataList_HAF);

    that.setData({
      dataList_combination: dataList_combination,
      dataList_commercial: dataList_commercial,
      dataList_HAF: dataList_HAF,
      winHeight: height,
      scroll_height: scroll_height,
    });
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
})