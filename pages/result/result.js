// pages/result/result.js

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: "", //当前的标签索引
    option: "", //计算方式
    duration: 0, //贷款年限
    total: 0, //贷款总额
    interest: 0.0, //贷款利率
    payback_time: "", //首次还款时间
    monthPay_typeOne: 0, //月供
    interestPay_typeOne: 0, //利息总额
    sum_typeOne: 0, //还款总额
    monthPay_typeTwo: 0, //首月月供
    interestPay_typeTwo: 0, //利息总额
    sum_typeTwo: 0, //还款总额
    time: 0,
    dataList_typeOne: [],
    dataList_typeTwo: [],
    delta: 0, //等额本金方式每月递减金额
  },

  onLoad: function(options) {
    //更换标题栏
    wx.setNavigationBarTitle({
      title: '计算结果'
    })

    var that = this;
    var height; //屏幕高度

    //swiper高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        height = clientHeight * rpxR - 88; //88是swiper-tab的高度
      }
    });

    that.data.winHeight = height;
    that.data.duration = options.duration;
    that.data.total = options.total;
    that.data.interest = options.interest;
    that.data.payback_time = options.payback_time;
    that.data.option = options.option;

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
    that.compute();
  },

  //计算
  compute: function() {
    var that = this;
    var duration = parseInt(that.data.duration); //贷款年限
    var time = 0; //贷款月数
    var total = that.data.total; //贷款总额（万元）
    var mortgage = 0; //贷款总额（元）
    var interest = that.data.interest; //贷款利率
    var payback_time = that.data.payback_time; //首次还款时间
    var monthRate = 0; //月利率
    var monthCapital = [];
    var monthInterest = [];
    var monthSum = [];
    var date = [];
    var dataItem = {};

    //等额本息
    var monthPay_typeOne = 0; //月供
    var sum_typeOne = 0; //还款总额
    var interestPay_typeOne = 0; //还款利息总额
    var dataList_typeOne = that.data.dataList_typeOne;

    //等额本金
    var monthPay_typeTwo = 0; //首月月供
    var sum_typeTwo = 0; //还款总额
    var interestPay_typeTwo = 0; //还款利息总额
    var dataList_typeTwo = that.data.dataList_typeTwo;

    //万元转换为元
    mortgage = total * 10000;

    //年利率转换为月利率
    interest = interest / 100;
    monthRate = interest / 12;

    //贷款时间转换为月
    time = duration * 12;

    //获得开始还款的年份
    var startYear = parseInt(payback_time.substr(0, 4), 10);
    //获得开始还款的月份
    var startMonth = parseInt(payback_time.substr(5, 2), 10);

    //等额本息计算方式
    var year_typeOne = startYear;
    var month_typeOne = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    dataItem["date"] = startYear + "年";
    dataItem["monthCapital"] = "";
    dataItem["monthInterest"] = "";
    dataItem["monthSum"] = "";
    dataList_typeOne.push(dataItem);

    //月供（元）
    monthPay_typeOne = mortgage * monthRate * Math.pow((1 + monthRate), time) / (Math.pow(1 + monthRate, time) - 1);
    //还款总额（万元）
    sum_typeOne = (monthPay_typeOne * time) / 10000;
    //还款利息总额（万元）
    interestPay_typeOne = (monthPay_typeOne * time - mortgage) / 10000;

    //保留两位小数
    monthPay_typeOne = monthPay_typeOne.toFixed(2);
    sum_typeOne = sum_typeOne.toFixed(2);
    interestPay_typeOne = interestPay_typeOne.toFixed(2);

    //每个月的还款详情
    for (let i = 1; i <= time; i++) {
      dataItem = {};

      if (month_typeOne == 12) {
        year_typeOne++;
        month_typeOne = 0;
        date[i] = year_typeOne + "年";
        dataItem["date"] = date[i];
        dataItem["monthCapital"] = "";
        dataItem["monthInterest"] = "";
        dataItem["monthSum"] = "";
        dataList_typeOne.push(dataItem);
      } else {
        month_typeOne++;
        date[i] = month_typeOne + "月," + i + "期";
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

        dataList_typeOne.push(dataItem);
      }
    }

    //等额本金计算方式
    var year_typeTwo = startYear;
    var month_typeTwo = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    dataItem["date"] = startYear + "年";
    dataItem["monthCapital"] = "";
    dataItem["monthInterest"] = "";
    dataItem["monthSum"] = "";
    dataList_typeTwo.push(dataItem);

    //还款总额（万元）
    sum_typeTwo = (time * (mortgage * monthRate - monthRate * (mortgage / time) * (time - 1) / 2 + mortgage / time)) / 10000;
    //还款利息总额（万元）
    interestPay_typeTwo = sum_typeTwo - total;

    //保留两位小数
    sum_typeTwo = sum_typeTwo.toFixed(2);
    interestPay_typeTwo = interestPay_typeTwo.toFixed(2);

    //每个月的还款详情
    let paid = 0;
    let delta = 0;
    for (let i = 1; i <= time; i++) {
      dataItem = {};

      if (month_typeTwo == 12) {
        year_typeTwo++;
        month_typeTwo = 0;
        date[i] = year_typeTwo + "年";
        dataItem["date"] = date[i];
        dataItem["monthCapital"] = "";
        dataItem["monthInterest"] = "";
        dataItem["monthSum"] = "";
        dataList_typeTwo.push(dataItem);
      } else {
        month_typeTwo++;
        date[i] = month_typeTwo + "月," + i + "期";
        dataItem["date"] = date[i];

        //每月应还本金：贷款本金÷还款月数
        monthCapital[i] = mortgage / time;
        dataItem["monthCapital"] = "¥" + monthCapital[i].toFixed(2);

        //每月应还利息：剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        monthInterest[i] = (mortgage - paid) * monthRate;
        dataItem["monthInterest"] = "¥" + monthInterest[i].toFixed(2);

        //月供：(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        monthSum[i] = (mortgage / time) + (mortgage - paid) * monthRate;
        dataItem["monthSum"] = "¥" + monthSum[i].toFixed(2);

        //已归还本金累计额
        paid = paid + mortgage / time;

        dataList_typeTwo.push(dataItem);
      }
    }
    monthPay_typeTwo = monthSum[1];
    delta = (monthSum[1] - monthSum[2]).toFixed(2);

    that.setData({
      monthPay_typeOne: monthPay_typeOne,
      sum_typeOne: sum_typeOne,
      interestPay_typeOne: interestPay_typeOne,

      monthPay_typeTwo: monthPay_typeTwo,
      sum_typeTwo: sum_typeTwo,
      interestPay_typeTwo: interestPay_typeTwo,

      total: total,
      duration: duration,
      time: time,
      delta: delta,
    });
  },

  //跳转到月供详情页面
  showList: function() {
    var that = this;
    var option = that.data.option; //计算方式
    wx.navigateTo({
      url: '/pages/list/list?option=' + option + '&dataList_typeOne=' + JSON.stringify(that.data.dataList_typeOne) + '&dataList_typeTwo=' + JSON.stringify(that.data.dataList_typeTwo)
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