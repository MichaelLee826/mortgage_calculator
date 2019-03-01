// pages/result/result.js

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //当前的标签索引
    option: "", //计算方式
    duration: 0, //贷款年限
    total: 0, //贷款总额
    interest: 0.0, //贷款利率
    payback_time: "2019-02", //首次还款时间
    monthPay: 0,
    interestPay: 0,
    sum: 0,
    time: 0,
    result: [],
    dataList: [],
  },

  onLoad: function(options) {
    var that = this;
    var height; //屏幕高度

    //更换标题栏
    wx.setNavigationBarTitle({
      title: '计算结果'
    })

    //swiper高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88; //88是swiper-tab的高度
      }
    });

    that.setData({
      winHeight: height,
      option: options.option,
      duration: options.duration,
      total: options.total,
      interest: options.interest,
      payback_time: options.payback_time,
    });

    that.compute();
  },

  //计算
  compute: function() {
    var that = this;
    var option = that.data.option; //计算方式
    var duration = parseInt(that.data.duration); //贷款年限
    var time = 0; //贷款月数
    var total = that.data.total; //贷款总额（万元）
    var mortgage = 0; //贷款总额（元）
    var interest = that.data.interest; //利息总额
    var payback_time = that.data.payback_time; //首次还款时间
    var monthRate = 0; //月利率
    var monthPay = 0; //月供
    var sum = 0; //还款总额
    var interestPay = 0; //还款利息总额
    var monthCapital = [];
    var monthInterest = [];
    var monthSum = [];
    var dataList = that.data.dataList;

    //万元转换为元
    mortgage = total * 10000;

    //年利率转换为月利率
    interest = interest / 100;
    monthRate = interest / 12;

    //贷款时间转换为月
    time = duration * 12;

    //月供（元）
    monthPay = mortgage * monthRate * Math.pow((1 + monthRate), time) / (Math.pow(1 + monthRate, time) - 1);
    //还款总额（万元）
    sum = (monthPay * time) / 10000;
    //还款利息总额（万元）
    interestPay = (monthPay * time - mortgage) / 10000;

    //保留两位小数
    monthPay = monthPay.toFixed(2);
    sum = sum.toFixed(2);
    interestPay = interestPay.toFixed(2);

    //每个月的还款详情
    for (let i = 0; i <= time; i++) {
      var dataItem = {};

      //每月应还本金：贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
      monthCapital[i] = mortgage * monthRate * Math.pow((1 + monthRate), i - 1) / (Math.pow(1 + monthRate, time) - 1);
      dataItem["monthCapital"] = monthCapital[i].toFixed(2);

      //每月应还利息：贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
      monthInterest[i] = mortgage * monthRate * (Math.pow(1 + monthRate, time) - Math.pow(1 + monthRate, i - 1)) / (Math.pow(1 + monthRate, time) - 1);
      dataItem["monthInterest"] = monthInterest[i].toFixed(2);

      //月供：贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
      monthSum[i] = mortgage * monthRate * Math.pow((1 + monthRate), time) / (Math.pow(1 + monthRate, time) - 1);
      dataItem["monthSum"] = monthSum[i].toFixed(2);

      dataList.push(dataItem);
      
      //已还本金
      //paidCapital = paidCapital + mortgage * montRate * Math.pow((1 + montRate), i - 1) / (Math.pow(1 + montRate, time) - 1);

      //已还利息
      //paidInterest = paidInterest + mortgage * montRate * (Math.pow(1 + montRate, time) - Math.pow(1 + montRate, i - 1)) / (Math.pow(1 + montRate, time) - 1);

      //总共已还
      //paid = paid + mortgage * montRate * Math.pow((1 + montRate), time) / (Math.pow(1 + montRate, time) - 1);

    }

    that.setData({
      monthPay: monthPay,
      sum: sum,
      interestPay: interestPay,
      total: total,
      duration: duration,
      time: time,
      //monthCapital: monthCapital,
      //monthInterest: monthInterest,
      //monthSum: monthSum,
    });
  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  showList: function() {
    let that = this;
    wx.navigateTo({
      //url: '/pages/list/list?monthCapital=' + JSON.stringify(that.data.monthCapital) + '&monthInterest=' + JSON.stringify(that.data.monthInterest) + '&monthSum=' + JSON.stringify(that.data.monthSum)

      //url: '/pages/list/list?monthCapital=' + JSON.stringify(that.data.monthCapital)
      url: '/pages/list/list?dataList=' + JSON.stringify(that.data.dataList)
    })
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