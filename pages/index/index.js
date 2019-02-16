//index.js
//获取应用实例
const app = getApp()



Page({
  data: {
    winHeight: "",                            //窗口高度
    currentTab: 0,                            //当前的标签索引
    mortgage_options: ["等额本息", "等额本金"],
    mortgage_duration: [],
    mortgage_ways: ["贷款金额", "住房面积"],
    mortgage_interest: ["基准利率8.5折", "基准利率9折", "基准利率9.5折", "基准利率(4.9%)", "基准利率1.1倍", "基准利率1.2倍", "自定义利率"],
    mortgage_payback_time: "",
    index_options: 0,
    index_duration: 0,
    index_ways: 0,
    index_interest: 3,
    value: [3],
  },

  onLoad: function (options) {
    var that = this;
    var height;       //屏幕高度

    //swiper高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88;    //88是swiper-tab的高度
      }
    });

    var duration = [];
    for (var i = 0; i < 30; i++){
      duration[i] = (i + 1) + "年(" + (i + 1) * 12 + "期)";
    }
    
    that.setData({
      winHeight: height,
      mortgage_duration: duration
    });
  },

  //picker的监听器
  bindPickerChange(e) {
    let id = e.currentTarget.id;
    let val = e.detail.value;

    switch (id){
      case "picker_options":
        this.setData({
          index_options: val
        });
        break;

      case "picker_duration":
        this.setData({
          index_duration: val
        });
        break;

      case "picker_ways":
        this.setData({
          index_ways: val
        });
        break;

      case "picker_interest":
        this.setData({
          index_interest: val
        });
        break;
    }
  },

  //时间picker的监听器
  bindTimePickerchange: function (e) {
    let val = e.detail.value;
    this.setData({
      index_payback_time: val
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
  }
})
