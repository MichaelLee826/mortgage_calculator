//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

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
    startDate: "",
    date: "",
    option: "等额本息",
    duration: 1,
    way: "贷款金额",
    total: 0,
    interest: 0.049,
    payback_time: "",
  },

  onLoad: function (options) {
    var that = this;
    var height;       //屏幕高度
    var date;         //当期日期

    //swiper高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88;    //88是swiper-tab的高度
      }
    });

    //贷款年限
    var duration = [];
    for (var i = 0; i < 30; i++){
      duration[i] = (i + 1) + "年(" + (i + 1) * 12 + "期)";
    }

    //当期日期
    var currentDate = new Date();
    date = util.formatTime(currentDate);
    date = date.substring(0, 7);
    date= date.replace("/", "-");
    
    that.setData({
      winHeight: height,
      mortgage_duration: duration,
      startDate: date,
      date: date,
      payback_time: date,
    });
  },

  //picker的监听器
  bindPickerChange(e) {
    let that = this;
    let id = e.currentTarget.id;
    let val = e.detail.value;

    switch (id){
      case "picker_options":
        this.setData({
          index_options: val,
          option: that.data.mortgage_options[val],
        });
        break;

      case "picker_duration":
        this.setData({
          index_duration: val,
          duration: that.data.mortgage_duration[val],
        });
        break;

      case "picker_ways":
        this.setData({
          index_ways: val,
          way: that.data.mortgage_ways[val],
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
      date: val,
      payback_time: val,
    });
  },

  //输入框的监听器
  inputTyping:function (e) {
    this.setData({
      total: e.detail.value
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

  //计算按钮
  toCompute: function () {
    var that = this;

    if (that.data.total <= 0){
    }


    console.log(that.data.option);
    console.log(that.data.duration);
    console.log(that.data.way);
    console.log(that.data.total);
    console.log(that.data.interest);
    console.log(that.data.payback_time);
   
    wx.navigateTo({
      //url: '/pages/result/result?Num=' + num + '&String=' + string
      url: '/pages/result/result'
    })
  },

  //错误提示
  showAlert: function (message) {
    let alert = message + "不能为空！";
    wx.showModal({
      title: '提示',
      content: alert,
      confirmText: '好的',
      confirmColor: '#ACB4E3',
      showCancel: false,
    });

  }
})
