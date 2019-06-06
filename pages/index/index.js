//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  //“分享”功能
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '分享',
      path: '/pages/index',
      success: (res) => {
        console.log(res.shareTickets[0])
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //当前的标签索引

    //通用部分
    mortgage_options: ["等额本息", "等额本金"],
    mortgage_duration: [],
    mortgage_ways: ["贷款金额", "住房面积"],
    mortgage_ratio: ["20%", "25%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", ],
    mortgage_interest_commercial: ["基准利率8.5折", "基准利率9折", "基准利率9.5折", "基准利率", "基准利率1.1倍", "基准利率1.2倍", "自定义利率"],
    mortgage_interest_HAF: ["基准利率", "基准利率1.1倍", "基准利率1.2倍", "自定义利率"],
    mortgage_payback_time: "",

    //商业贷款
    commercial_index_options: 0,
    commercial_index_duration: 19,
    commercial_index_ways: 0,
    commercial_index_ratio: 2,
    commercial_index_interest: 3,
    commercial_startDate: "",
    commercial_date: "",
    commercial_option: "等额本息",
    commercial_duration: 20,
    commercial_way: "贷款金额",
    commercial_total_show: true,
    commercial_area_show: false,
    commercial_total: -1,
    commercial_price: -1,
    commercial_area: -1,
    commercial_ratio: 0.3,
    commercial_interest: 4.90,
    commercial_payback_time: "",
    commercial_interest_disable: true,
    commercial_interest_value: "4.90",

    //公积金贷款
    HAF_index_options: 0,
    HAF_index_duration: 19,
    HAF_index_ways: 0,
    HAF_index_ratio: 2,
    HAF_index_interest: 0,
    HAF_startDate: "",
    HAF_date: "",
    HAF_option: "等额本息",
    HAF_duration: 20,
    HAF_way: "贷款金额",
    HAF_total_show: true,
    HAF_area_show: false,
    HAF_total: -1,
    HAF_price: -1,
    HAF_area: -1,
    HAF_ratio: 0.3,
    HAF_interest: 3.25,
    HAF_payback_time: "",
    HAF_interest_disable: true,
    HAF_interest_value: "3.25",

    //组合贷款
    combination_index_options: 0,
    combination_comm_index_duration: 19,
    combination_HAF_index_duration: 19,
    combination_comm_index_interest: 3,
    combination_HAF_index_interest: 0,
    combination_startDate: "",
    combination_date: "",
    combination_option: "等额本息",
    combination_comm_duration: 20,
    combination_HAF_duration: 20,
    combination_comm_total: -1,
    combination_HAF_total: -1,
    combination_comm_interest: 4.90,
    combination_HAF_interest: 3.25,
    combination_payback_time: "",
    combination_comm_interest_disable: true,
    combination_HAF_interest_disable: true,
    combination_comm_interest_value: "4.90",
    combination_HAF_interest_value: "3.25",
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
      commercial_startDate: date,
      commercial_date: date,
      commercial_payback_time: date,
      HAF_startDate: date,
      HAF_date: date,
      HAF_payback_time: date,
      combination_startDate: date,
      combination_date: date,
      combination_payback_time: date,
    });
  },

  //picker的监听器
  bindPickerChange(e) {
    let that = this;
    let id = e.currentTarget.id;
    let val = e.detail.value;

    switch (id) {
      //商业贷款 贷款方式
      case "commercial_picker_options":
        this.setData({
          commercial_index_options: val,
          commercial_option: that.data.mortgage_options[val],
        });
        break;

        //公积金贷款 贷款方式
      case "HAF_picker_options":
        this.setData({
          HAF_index_options: val,
          HAF_option: that.data.mortgage_options[val],
        });
        break;

        //组合贷款 贷款方式
      case "combination_picker_options":
        this.setData({
          combination_index_options: val,
          combination_option: that.data.mortgage_options[val],
        });
        break;

        //商业贷款 贷款年限
      case "commercial_picker_duration":
        this.setData({
          commercial_index_duration: val,
          commercial_duration: that.data.mortgage_duration[val],
        });
        break;

        //公积金贷款 贷款年限
      case "HAF_picker_duration":
        this.setData({
          HAF_index_duration: val,
          HAF_duration: that.data.mortgage_duration[val],
        });
        break;

        //组合贷款 商业贷款年限
      case "combination_comm_picker_duration":
        this.setData({
          combination_comm_index_duration: val,
          combination_comm_duration: that.data.mortgage_duration[val],
        });
        break;

        //组合贷款 公积金贷款年限
      case "combination_HAF_picker_duration":
        this.setData({
          combination_HAF_index_duration: val,
          combination_HAF_duration: that.data.mortgage_duration[val],
        });
        break;

        //商业贷款 计算方式
      case "commercial_picker_ways":
        var commercial_total_show;
        var commercial_area_show;

        if (val == 0) {
          commercial_total_show = true;
          commercial_area_show = false;
        } else {
          commercial_total_show = false;
          commercial_area_show = true;
        }

        this.setData({
          commercial_index_ways: val,
          commercial_way: that.data.mortgage_ways[val],
          commercial_total_show: commercial_total_show,
          commercial_area_show: commercial_area_show,
        });
        break;

      case "commercial_picker_ratio":
        var ratio = -1.0;
        switch (val) {
          case "0":
            ratio = 0.2;
            break;
          case "1":
            ratio = 0.25;
            break;
          case "2":
            ratio = 0.3;
            break;
          case "3":
            ratio = 0.4;
            break;
          case "4":
            ratio = 0.5;
            break;
          case "5":
            ratio = 0.6;
            break;
          case "6":
            ratio = 0.7;
            break;
          case "7":
            ratio = 0.8;
            break;
          case "8":
            ratio = 0.9;
            break;
          case "9":
            ratio = 1.0;
            break;
        }
        this.setData({
          commercial_index_ratio: val,
          commercial_ratio: ratio,
        });
        break;

        //公积金贷款 计算方式
      case "HAF_picker_ways":
        var HAF_total_show;
        var HAF_area_show;

        if (val == 0) {
          HAF_total_show = true;
          HAF_area_show = false;
        } else {
          HAF_total_show = false;
          HAF_area_show = true;
        }

        this.setData({
          HAF_index_ways: val,
          HAF_way: that.data.mortgage_ways[val],
          HAF_total_show: HAF_total_show,
          HAF_area_show: HAF_area_show,
        });
        break;

      case "HAF_picker_ratio":
        var ratio = -1.0;
        switch (val) {
          case "0":
            ratio = 0.2;
            break;
          case "1":
            ratio = 0.25;
            break;
          case "2":
            ratio = 0.3;
            break;
          case "3":
            ratio = 0.4;
            break;
          case "4":
            ratio = 0.5;
            break;
          case "5":
            ratio = 0.6;
            break;
          case "6":
            ratio = 0.7;
            break;
          case "7":
            ratio = 0.8;
            break;
          case "8":
            ratio = 0.9;
            break;
          case "9":
            ratio = 1.0;
            break;
        }
        this.setData({
          HAF_index_ratio: val,
          HAF_ratio: ratio,
        });
        break;

        //商业贷款 利率选择
      case "commercial_picker_interest":
        switch (val) {
          case "0":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: (4.9 * 0.85).toFixed(2),
              commercial_interest_value: (4.9 * 0.85).toFixed(2)
            });
            break;

          case "1":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: (4.9 * 0.9).toFixed(2),
              commercial_interest_value: (4.9 * 0.9).toFixed(2)
            });
            break;

          case "2":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: (4.9 * 0.95).toFixed(2),
              commercial_interest_value: (4.9 * 0.95).toFixed(2)
            });
            break;

          case "3":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: 4.90,
              commercial_interest_value: 4.90.toFixed(2)
            });
            break;

          case "4":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: (4.9 * 1.1).toFixed(2),
              commercial_interest_value: (4.9 * 1.1).toFixed(2)
            });
            break;

          case "5":
            that.setData({
              commercial_interest_disable: true,
              commercial_interest: (4.9 * 1.2).toFixed(2),
              commercial_interest_value: (4.9 * 1.2).toFixed(2)
            });
            break;

          case "6":
            that.setData({
              commercial_interest_disable: false,
              commercial_interest: -1,
              commercial_interest_value: ""
            });
            break;
        }
        that.setData({
          commercial_index_interest: val,
        });
        break;

        //公积金贷款 利率选择
      case "HAF_picker_interest":
        switch (val) {
          case "0":
            that.setData({
              HAF_interest_disable: true,
              HAF_interest: 3.25,
              HAF_interest_value: 3.25.toFixed(2)
            });
            break;

          case "1":
            that.setData({
              HAF_interest_disable: true,
              HAF_interest: (3.25 * 1.1).toFixed(2),
              HAF_interest_value: (3.25 * 1.1).toFixed(2)
            });
            break;

          case "2":
            that.setData({
              HAF_interest_disable: true,
              HAF_interest: (3.25 * 1.2).toFixed(2),
              HAF_interest_value: (3.25 * 1.2).toFixed(2)
            });
            break;

          case "3":
            that.setData({
              HAF_interest_disable: false,
              HAF_interest: -1,
              HAF_interest_value: ""
            });
            break;
        }
        that.setData({
          HAF_index_interest: val,
        });
        break;

        //组合贷款 商业贷款利率选择
      case "combination_comm_picker_interest":
        switch (val) {
          case "0":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comm_interest: (4.9 * 0.85).toFixed(2),
              combination_comm_interest_value: (4.9 * 0.85).toFixed(2)
            });
            break;

          case "1":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comm_interest: (4.9 * 0.9).toFixed(2),
              combination_comm_interest_value: (4.9 * 0.9).toFixed(2)
            });
            break;

          case "2":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comm_interest: (4.9 * 0.95).toFixed(2),
              combination_comm_interest_value: (4.9 * 0.95).toFixed(2)
            });
            break;

          case "3":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comml_interest: 4.90,
              combination_comm_interest_value: 4.90.toFixed(2)
            });
            break;

          case "4":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comm_interest: (4.9 * 1.1).toFixed(2),
              combination_comm_interest_value: (4.9 * 1.1).toFixed(2)
            });
            break;

          case "5":
            that.setData({
              combination_comm_interest_disable: true,
              combination_comm_interest: (4.9 * 1.2).toFixed(2),
              combination_comm_interest_value: (4.9 * 1.2).toFixed(2)
            });
            break;

          case "6":
            that.setData({
              combination_comm_interest_disable: false,
              combination_comm_interest: -1,
              combination_comm_interest_value: ""
            });
            break;
        }
        that.setData({
          combination_comm_index_interest: val,
        });
        break;

        //组合贷款 公积金贷款利率选择
      case "combination_HAF_picker_interest":
        switch (val) {
          case "0":
            that.setData({
              combination_HAF_interest_disable: true,
              combination_HAF_interest: 3.25,
              combination_HAF_interest_value: 3.25.toFixed(2)
            });
            break;

          case "1":
            that.setData({
              combination_HAF_interest_disable: true,
              combination_HAF_interest: (3.25 * 1.1).toFixed(2),
              combination_HAF_interest_value: (3.25 * 1.1).toFixed(2)
            });
            break;

          case "2":
            that.setData({
              combination_HAF_interest_disable: true,
              combination_HAF_interest: (3.25 * 1.2).toFixed(2),
              combination_HAF_interest_value: (3.25 * 1.2).toFixed(2)
            });
            break;

          case "3":
            that.setData({
              combination_HAF_interest_disable: false,
              combination_HAF_interest: -1,
              combination_HAF_interest_value: ""
            });
            break;
        }
        that.setData({
          combination_HAF_index_interest: val,
        });
        break;
    }
  },

  //时间picker的监听器
  bindTimePickerchange: function(e) {
    let id = e.currentTarget.id;
    let val = e.detail.value;

    switch (id) {
      case "commercial_picker_time":
        this.setData({
          commercial_date: val,
          commercial_payback_time: val,
        });
        break;

      case "HAF_picker_time":
        this.setData({
          HAF_date: val,
          HAF_payback_time: val,
        });
        break;

      case "combination_picker_time":
        this.setData({
          combination_date: val,
          combination_payback_time: val,
        });
        break;
    }
  },

  //输入框的监听器
  inputTyping: function(e) {
    let that = this;
    let id = e.currentTarget.id;

    switch (id) {
      case "commercial_input_total":
        if (e.detail.value == "") {
          that.setData({
            commercial_total: -1
          });
        } else {
          that.setData({
            commercial_total: e.detail.value
          });
        }
        break;

      case "commercial_input_price":
        if (e.detail.value == "") {
          that.setData({
            commercial_price: -1
          });
        } else {
          that.setData({
            commercial_price: e.detail.value
          });
        }
        break;

      case "commercial_input_area":
        if (e.detail.value == "") {
          that.setData({
            commercial_area: -1
          });
        } else {
          that.setData({
            commercial_area: e.detail.value
          });
        }
        break;

      case "commercial_input_interest":
        if (e.detail.value == "") {
          that.setData({
            commercial_interest: -1
          });
        } else {
          that.setData({
            commercial_interest: e.detail.value
          });
        }
        break;

      case "HAF_input_total":
        if (e.detail.value == "") {
          that.setData({
            HAF_total: -1
          });
        } else {
          that.setData({
            HAF_total: e.detail.value
          });
        }
        break;

      case "HAF_input_price":
        if (e.detail.value == "") {
          that.setData({
            HAF_price: -1
          });
        } else {
          that.setData({
            HAF_price: e.detail.value
          });
        }
        break;

      case "HAF_input_area":
        if (e.detail.value == "") {
          that.setData({
            HAF_area: -1
          });
        } else {
          that.setData({
            HAF_area: e.detail.value
          });
        }
        break;

      case "HAF_input_interest":
        if (e.detail.value == "") {
          that.setData({
            HAF_interest: -1
          });
        } else {
          that.setData({
            HAF_interest: e.detail.value
          });
        }
        break;

      case "combination_comm_input_total":
        if (e.detail.value == "") {
          that.setData({
            combination_comm_total: -1
          });
        } else {
          that.setData({
            combination_comm_total: e.detail.value
          });
        }
        break;

      case "combination_HAF_input_total":
        if (e.detail.value == "") {
          that.setData({
            combination_HAF_total: -1
          });
        } else {
          that.setData({
            combination_HAF_total: e.detail.value
          });
        }
        break;

      case "combination_comm_input_interest":
        if (e.detail.value == "") {
          that.setData({
            combination_comm_interest: -1
          });
        } else {
          that.setData({
            combination_comm_interest: e.detail.value
          });
        }
        break;

      case "combination_HAF_input_interest":
        if (e.detail.value == "") {
          that.setData({
            combination_HAF_interest: -1
          });
        } else {
          that.setData({
            combination_HAF_interest: e.detail.value
          });
        }
        break;
    }
  },

  //计算按钮
  toCompute: function() {
    var that = this;
    var option;
    var duration;
    var combination_comm_duration;
    var combination_HAF_duration;
    var total;
    var price;
    var area;
    var ratio;
    var combination_comm_total;
    var combination_HAF_total;
    var interest;
    var combination_comm_interest;
    var combination_HAF_interest;
    var payback_time;

    switch (that.data.currentTab) {
      case 0:
        option = that.data.commercial_option;
        duration = that.data.commercial_duration;
        if (that.data.commercial_way == "贷款金额") {
          total = that.data.commercial_total;
        } else {
          price = that.data.commercial_price;
          area = that.data.commercial_area;
          ratio = that.data.commercial_ratio;
          total = (price * area / 10000 * (1 - ratio)).toFixed(2);
        }
        interest = that.data.commercial_interest;
        payback_time = that.data.commercial_payback_time;
        break;

      case 1:
        option = that.data.HAF_option;
        duration = that.data.HAF_duration;
        if (that.data.HAF_way == "贷款金额") {
          total = that.data.HAF_total;
        } else {
          price = that.data.HAF_price;
          area = that.data.HAF_area;
          ratio = that.data.HAF_ratio
          total = (price * area / 10000 * (1 - ratio)).toFixed(2);
        }
        interest = that.data.HAF_interest;
        payback_time = that.data.HAF_payback_time;
        break;

      case 2:
        option = that.data.combination_option;
        combination_comm_duration = that.data.combination_comm_duration;
        combination_HAF_duration = that.data.combination_HAF_duration;
        combination_comm_total = that.data.combination_comm_total;
        combination_HAF_total = that.data.combination_HAF_total;
        combination_comm_interest = that.data.combination_comm_interest;
        combination_HAF_interest = that.data.combination_HAF_interest;
        payback_time = that.data.combination_payback_time;
        break;
    }

    let reg_int = /^[1-9]\d*$/; //整数：非0开头
    let reg_float = /^\d+\.\d{0,3}$/; //小数：小数部分最多3位

    //商业贷款和公积金贷款
    if (that.data.currentTab == 0 || that.data.currentTab == 1) {
      //根据贷款金额计算
      if (that.data.commercial_way == "贷款金额") {
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
          })
        }
      }
      //根据住房面积计算
      else {
        //判断单价和面积是否填写正确
        if (price == -1) {
          that.showAlert("请填写单价！");
        } else if (price == 0) {
          that.showAlert("单价不能为0！");
        }
        //if判断条件的写法是根据几个测试用例推出来的
        else if (!(reg_int.test(price) ^ reg_float.test(price))) {
          that.showAlert("请填写正确格式的单价！");
        } else if (area == -1) {
          that.showAlert("请填写面积！");
        } else if (area == 0) {
          that.showAlert("面积不能为0！");
        }
        //if判断条件的写法是根据几个测试用例推出来的
        else if (!(reg_int.test(price) ^ reg_float.test(price))) {
          that.showAlert("请填写正确格式的单价！");
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
          })
        }
      }
    }
    //组合贷款
    else {
      //判断贷款金额是否填写正确
      if (combination_comm_total == -1 || combination_HAF_total == -1) {
        that.showAlert("请填写贷款金额！");
      } else if (combination_comm_total == 0 || combination_HAF_total == 0) {
        that.showAlert("贷款金额不能为0！");
      }
      //if判断条件的写法是根据几个测试用例推出来的
      else if (!(reg_int.test(combination_comm_total) ^ reg_float.test(combination_comm_total))) {
        that.showAlert("请填写正确格式的贷款金额！");
      } else if (!(reg_int.test(combination_HAF_total) ^ reg_float.test(combination_HAF_total))) {
        that.showAlert("请填写正确格式的贷款金额！");
      }

      //判断自定义贷款利率是否填写正确
      else if (combination_comm_interest == -1 || combination_HAF_interest == -1) {
        that.showAlert("请填写贷款利率！");
      } else if (combination_comm_interest == 0 || combination_HAF_interest == 0) {
        that.showAlert("贷款利率不能为0！");
      }
      //if判断条件的写法是根据几个测试用例推出来的
      else if (!(reg_int.test(combination_comm_interest) ^ reg_float.test(combination_comm_interest))) {
        that.showAlert("请填写正确格式的贷款利率！");
      } else if (!(reg_int.test(combination_HAF_interest) ^ reg_float.test(combination_HAF_interest))) {
        that.showAlert("请填写正确格式的贷款利率！");
      } else {
        wx.navigateTo({
          url: '/pages/result_combination/result_combination?option=' + option + '&combination_comm_duration=' + combination_comm_duration + '&combination_comm_total=' + combination_comm_total + '&combination_comm_interest=' + combination_comm_interest + '&combination_HAF_duration=' + combination_HAF_duration + '&combination_HAF_total=' + combination_HAF_total + '&combination_HAF_interest=' + combination_HAF_interest + '&payback_time=' + payback_time
        })
      }
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


})