//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //当前的标签索引
    mortgage_options: ["等额本息", "等额本金"],
    mortgage_duration: [],
    mortgage_ways: ["贷款金额", "住房面积"],
    mortgage_interest: ["基准利率8.5折", "基准利率9折", "基准利率9.5折", "基准利率", "基准利率1.1倍", "基准利率1.2倍", "自定义利率"],
    mortgage_payback_time: "",
    index_options: 0,
    index_duration: 19,
    index_ways: 0,
    index_interest: 3,
    startDate: "",
    date: "",
    option: "等额本息",
    duration: 1,
    way: "贷款金额",
    total: -1,
    interest: 4.90,
    payback_time: "",
    interest_disable: true,
    interest_value: "4.90",
  },

  onLoad: function(options) {
    var that = this;
    var height; //屏幕高度
    var date; //当期日期

    //swiper高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88; //88是swiper-tab的高度
      }
    });

    //贷款年限
    var duration = [];
    for (var i = 0; i < 30; i++) {
      duration[i] = (i + 1) + "年(" + (i + 1) * 12 + "期)";
    }

    //当期日期
    var currentDate = new Date();
    date = util.formatTime(currentDate);
    date = date.substring(0, 7);
    date = date.replace("/", "-");

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

    switch (id) {
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
        switch (val) {
          case "0":
            that.setData({
              interest_disable: true,
              interest: (4.9 * 0.85).toFixed(2),
              interest_value: (4.9 * 0.85).toFixed(2)
            });
            break;

          case "1":
            that.setData({
              interest_disable: true,
              interest: (4.9 * 0.9).toFixed(2),
              interest_value: (4.9 * 0.9).toFixed(2)
            });
            break;

          case "2":
            that.setData({
              interest_disable: true,
              interest: (4.9 * 0.95).toFixed(2),
              interest_value: (4.9 * 0.95).toFixed(2)
            });
            break;

          case "3":
            that.setData({
              interest_disable: true,
              interest: 4.90,
              interest_value: 4.90.toFixed(2)
            });
            break;

          case "4":
            that.setData({
              interest_disable: true,
              interest: (4.9 * 1.1).toFixed(2),
              interest_value: (4.9 * 1.1).toFixed(2)
            });
            break;

          case "5":
            that.setData({
              interest_disable: true,
              interest: (4.9 * 1.2).toFixed(2),
              interest_value: (4.9 * 1.2).toFixed(2)
            });
            break;

          case "6":
            that.setData({
              interest_disable: false,
              interest: -1,
              interest_value: ""
            });
            break;
        }
        that.setData({
          index_interest: val
        });
        break;
    }
  },

  //时间picker的监听器
  bindTimePickerchange: function(e) {
    let val = e.detail.value;
    this.setData({
      date: val,
      payback_time: val,
    });
  },

  //输入框的监听器
  inputTyping: function(e) {
    let that = this;
    let id = e.currentTarget.id;

    switch (id) {
      case "input_total":
        if (e.detail.value == "") {
          that.setData({
            total: -1
          });
        } else {
          that.setData({
            total: e.detail.value
          });
        }
        break;

      case "input_interest":
        if (e.detail.value == "") {
          that.setData({
            interest: -1
          });
        } else {
          that.setData({
            interest: e.detail.value
          });
        }
        break;
    }
  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  //点击切换
  clickTab: function(e) {
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
  toCompute: function() {
    let that = this;

    let option = that.data.option;
    let duration = that.data.duration;
    let total = that.data.total;
    let interest = that.data.interest;
    let payback_time = that.data.payback_time;

    let reg_int = /^[1-9]\d*$/; //整数：非0开头
    let reg_float = /^\d+\.\d{0,3}$/; //小数：小数部分最多3位

    //判断贷款金额是否填写正确
    if (total == -1) {
      that.showAlert("请填写贷款金额！");
    } else if (total == 0) {
      that.showAlert("贷款金额不能为0！");
    }
    //if判断条件的写法是根据几个测试用例推出来的
    else if (!(reg_int.test(total) ^ reg_float.test(total))) {
      that.showAlert("请填写正确格式的贷款金额！");
    }

    //判断自定义贷款利率是否填写正确
    else if (interest == -1) {
      that.showAlert("请填写贷款利率！");
    } else if (interest == 0) {
      that.showAlert("贷款利率不能为0！");
    }
    //if判断条件的写法是根据几个测试用例推出来的
    else if (!(reg_int.test(interest) ^ reg_float.test(interest))) {
      that.showAlert("请填写正确格式的贷款利率！");
    } else {
      wx.navigateTo({
        url: '/pages/result/result?option=' + option + '&duration=' + duration + '&total=' + total + '&interest=' + interest + '&payback_time=' + payback_time
        //url: '/pages/result/result'
      })
    }
  },

  //错误提示
  showAlert: function(message) {
    wx.showModal({
      title: '提示',
      content: message,
      confirmText: '好的',
      confirmColor: '#ACB4E3',
      showCancel: false,
    });
  },

  //控制台输出
  outPut: function(message) {
    console.log(message);
  }
})