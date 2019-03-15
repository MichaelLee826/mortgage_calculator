// pages/result_combination/result_combination.js

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: "", //当前的标签索引
  },

  onLoad: function (options) {
    //更换标题栏
    wx.setNavigationBarTitle({
      title: '计算结果'
    })

    var that = this;
    var height; //屏幕高度

    //swiper高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88; //88是swiper-tab的高度
      }
    });

    if (that.data.option == "等额本息") {
      that.setData({
        currentTab: 0,
        winHeight: height,
        duration: options.duration,
        total: options.total,
        interest: options.interest,
      });
    } else {
      that.setData({
        currentTab: 1,
        winHeight: height,
        duration: options.duration,
        total: options.total,
        interest: options.interest,
      });
    }
  },


})