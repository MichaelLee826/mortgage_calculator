// pages/result/result.js

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //当前的标签索引
    option: "", //计算方式
    duration: 0, //贷款年限
    total: 0, //贷款总额
    interest: 0.0, //贷款利率
    payback_time: "", //首次还款时间
    monthPay: 0,//月供
    interestPay: 0,//利息总额
    sum: 0,//还款总额
    time: 0,
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
    var startYear;
    var startMonth;
    var year;
    var month;
    var date = [];
    var dataItem = {};

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

    //获得开始还款的年份
    startYear = parseInt(payback_time.substr(0, 4), 10);
    //获得开始还款的月份
    startMonth = parseInt(payback_time.substr(5, 2), 10);

    year = startYear;
    month = startMonth - 1;//如果for循环i从2开始，这里就不需要减1了
    dataItem["date"] = startYear + "年";
    dataItem["monthCapital"] = "";
    dataItem["monthInterest"] = "";
    dataItem["monthSum"] = "";
    dataList.push(dataItem);

    //每个月的还款详情
    for (let i = 1; i <= time; i++) {
      dataItem = {};

      if (month == 12) {
        year++;
        month = 0;
        date[i] = year + "年";
        dataItem["date"] = date[i];
        dataItem["monthCapital"] = "";
        dataItem["monthInterest"] = "";
        dataItem["monthSum"] = "";
        dataList.push(dataItem);
      }
      else {
        month++;
        date[i] = month + "月," + i + "期";
        dataItem["date"] = date[i];

        //每月应还本金：贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        monthCapital[i] = mortgage * monthRate * Math.pow((1 + monthRate), i - 1) / (Math.pow(1 + monthRate, time) - 1);
        dataItem["monthCapital"] = "¥" + monthCapital[i].toFixed(2);

        //每月应还利息：贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        monthInterest[i] = mortgage * monthRate * (Math.pow(1 + monthRate, time) - Math.pow(1 + monthRate, i - 1)) / (Math.pow(1 + monthRate, time) - 1);
        dataItem["monthInterest"] = "¥" + monthInterest[i].toFixed(2);

        //月供：贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        monthSum[i] = mortgage * monthRate * Math.pow((1 + monthRate), time) / (Math.pow(1 + monthRate, time) - 1);
        dataItem["monthSum"] = "¥" + monthSum[i].toFixed(2);

        dataList.push(dataItem);
      }
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

  //跳转到月供详情页面
  showList: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/list/list?dataList=' + JSON.stringify(that.data.dataList)
    })
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