// pages/result_combination/result_combination.js

Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: "", //当前的标签索
    scroll_height: 0,

    sum_typeOne: 0, //还款总额
    sum_typeTwo: 0,
    total: 0, //贷款总额
    interestPay_typeOne: 0, //利息总额
    interestPay_typeTwo: 0,
    payback_time: "", //首次还款时间

    duration_commercial: 0, //商业贷款贷款年限
    total_commercial: 0, //商业贷款贷款总额
    interest_commercial: 0, //商业贷款利率

    duration_HAF: 0, //公积金贷款贷款年限
    total_HAF: 0, //公积金贷款贷款总额
    interest_HAF: 0, //公积金贷款利率

    monthPay_typeOne_commercial: 0, //商业贷款等额本息月供
    sum_typeOne_commercial: 0, //商业贷款等额本息还款总额
    interestPay_typeOne_commercial: 0, ///商业贷款等额本息利息总额

    monthPay_typeOne_HAF: 0, //公积金贷款等额本息月供
    sum_typeOne_HAF: 0, //公积金贷款等额本息还款总额
    interestPay_typeOne_HAF: 0, ///公积金贷款等额本息利息总额

    monthPay_typeTwo_commercial: 0, //商业贷款等额本金月供
    sum_typeTwo_commercial: 0, //商业贷款等额本金还款总额
    interestPay_typeTwo_commercial: 0, ///商业贷款等额本金利息总额
    delta_commercial: 0, //等额本金方式每月递减金额

    monthPay_typeTwo_HAF: 0, //公积金贷款等额本金月供
    sum_typeTwo_HAF: 0, //公积金贷款等额本金还款总额
    interestPay_typeTwo_HAF: 0, ///公积金贷款等额本金利息总额
    delta_HAF: 0, //等额本金方式每月递减金额

    delta: 0,

    dataList_typeOne_commercial: [],
    dataList_typeOne_HAF: [],
    dataList_typeOne: [],
    dataList_typeTwo_commercial: [],
    dataList_typeTwo_HAF: [],
    dataList_typeTwo: [],
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
        height = clientHeight * rpxR + 100; //88是swiper-tab的高度
      }
    });

    //获得从前一页传来的数据
    that.setData({
      winHeight: height,
      duration_commercial: options.combination_comm_duration,
      total_commercial: options.combination_comm_total,
      interest_commercial: options.combination_comm_interest,
      duration_HAF: options.combination_HAF_duration,
      total_HAF: options.combination_HAF_total,
      interest_HAF: options.combination_HAF_interest,
      payback_time: options.payback_time,
    });

    if (options.option == "等额本息") {
      that.setData({
        currentTab: 0,
      });
    } else {
      that.setData({
        currentTab: 1,
      });
    }

    that.compute();
  },

  //计算
  compute: function() {
    var that = this;
    var duration_commercial = parseInt(that.data.duration_commercial); //贷款年限
    var duration_HAF = parseInt(that.data.duration_HAF)
    var time_commercial = 0; //贷款月数
    var time_HAF = 0;
    var total = that.data.total;
    var total_commercial = that.data.total_commercial; //贷款总额（万元）
    var total_HAF = that.data.total_HAF;
    var mortgage_commercial = 0; //贷款总额（元）
    var mortgage_HAF = 0;
    var interest_commercial = that.data.interest_commercial; //贷款利率
    var interest_HAF = that.data.interest_HAF; //贷款利率
    var payback_time = that.data.payback_time; //首次还款时间
    var monthRate_commercial = 0; //月利率
    var monthRate_HAF = 0;

    var monthCapital_commercial = [];
    var monthCapital_HAF = [];
    var monthInterest_commercial = [];
    var monthInterest_HAF = [];
    var monthSum_commercial = [];
    var monthSum_HAF = [];
    var date_commercial = [];
    var date_HAF = [];
    var dataItem_typeOne_commercial = {};
    var dataItem_typeTwo_commercial = {};
    var dataItem_typeOne_HAF = {};
    var dataItem_typeTwo_HAF = {};

    //等额本息
    var monthPay_typeOne_commercial = 0; //月供
    var monthPay_typeOne_HAF = 0;
    var sum_typeOne = 0;
    var sum_typeOne_commercial = 0; //还款总额
    var sum_typeOne_HAF = 0;
    var interestPay_typeOne = 0;
    var interestPay_typeOne_commercial = 0; //还款利息总额
    var interestPay_typeOne_HAF = 0;
    var dataList_typeOne_commercial = that.data.dataList_typeOne_commercial;
    var dataList_typeOne_HAF = that.data.dataList_typeOne_HAF;
    var dataList_typeOne = that.data.dataList_typeOne;

    //等额本金
    var monthPay_typeTwo_commercial = 0; //首月月供
    var monthPay_typeTwo_HAF = 0;
    var sum_typeTwo = 0;
    var sum_typeTwo_commercial = 0; //还款总额
    var sum_typeTwo_HAF = 0;
    var interestPay_typeTwo = 0;
    var interestPay_typeTwo_commercial = 0; //还款利息总额
    var interestPay_typeTwo_HAF = 0;
    var dataList_typeTwo_commercial = that.data.dataList_typeTwo_commercial;
    var dataList_typeTwo_HAF = that.data.dataList_typeTwo_HAF;
    var dataList_typeTwo = that.data.dataList_typeTwo;
    var delta = that.data.delta;

    //万元转换为元
    mortgage_commercial = total_commercial * 10000;
    mortgage_HAF = total_HAF * 10000;

    //年利率转换为月利率
    interest_commercial = interest_commercial / 100;
    monthRate_commercial = interest_commercial / 12;
    interest_HAF = interest_HAF / 100;
    monthRate_HAF = interest_HAF / 12;

    //贷款时间转换为月
    time_commercial = duration_commercial * 12;
    time_HAF = duration_HAF * 12;

    //获得开始还款的年份
    var startYear = parseInt(payback_time.substr(0, 4), 10);
    //获得开始还款的月份
    var startMonth = parseInt(payback_time.substr(5, 2), 10);

    //1、等额本息计算
    var year_typeOne_commercial = startYear;
    var month_typeOne_commercial = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    var year_typeOne_HAF = startYear;
    var month_typeOne_HAF = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    dataItem_typeOne_commercial["date"] = startYear + "年";
    dataItem_typeOne_commercial["monthCapital"] = "";
    dataItem_typeOne_commercial["monthInterest"] = "";
    dataItem_typeOne_commercial["monthSum"] = "";
    dataList_typeOne_commercial.push(dataItem_typeOne_commercial);
    dataItem_typeOne_HAF["date"] = startYear + "年";
    dataItem_typeOne_HAF["monthCapital"] = "";
    dataItem_typeOne_HAF["monthInterest"] = "";
    dataItem_typeOne_HAF["monthSum"] = "";
    dataList_typeOne_HAF.push(dataItem_typeOne_HAF);

    //1.1、商业贷款部分
    //月供（元）
    monthPay_typeOne_commercial = mortgage_commercial * monthRate_commercial * Math.pow((1 + monthRate_commercial), time_commercial) / (Math.pow(1 + monthRate_commercial, time_commercial) - 1);
    //还款总额（万元）
    sum_typeOne_commercial = (monthPay_typeOne_commercial * time_commercial) / 10000;
    //还款利息总额（万元）
    interestPay_typeOne_commercial = (monthPay_typeOne_commercial * time_commercial - mortgage_commercial) / 10000;

    //保留两位小数
    monthPay_typeOne_commercial = monthPay_typeOne_commercial.toFixed(2);
    sum_typeOne_commercial = sum_typeOne_commercial.toFixed(2);
    interestPay_typeOne_commercial = interestPay_typeOne_commercial.toFixed(2);

    //每个月的还款详情
    var i = 1;
    while (i <= time_commercial) {
      dataItem_typeOne_commercial = {};

      if (month_typeOne_commercial == 12) {
        year_typeOne_commercial++;
        month_typeOne_commercial = 0;
        date_commercial[i] = year_typeOne_commercial + "年";
        dataItem_typeOne_commercial["date"] = date_commercial[i];
        dataItem_typeOne_commercial["monthCapital"] = "";
        dataItem_typeOne_commercial["monthInterest"] = "";
        dataItem_typeOne_commercial["monthSum"] = "";
        dataList_typeOne_commercial.push(dataItem_typeOne_commercial);
      } else {
        month_typeOne_commercial++;
        date_commercial[i] = month_typeOne_commercial + "月," + i + "期";
        dataItem_typeOne_commercial["date"] = date_commercial[i];

        //每月应还本金：贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        monthCapital_commercial[i] = mortgage_commercial * monthRate_commercial * Math.pow((1 + monthRate_commercial), i - 1) / (Math.pow(1 + monthRate_commercial, time_commercial) - 1);
        dataItem_typeOne_commercial["monthCapital"] = "¥" + monthCapital_commercial[i].toFixed(2);

        //每月应还利息：贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        monthInterest_commercial[i] = mortgage_commercial * monthRate_commercial * (Math.pow(1 + monthRate_commercial, time_commercial) - Math.pow(1 + monthRate_commercial, i - 1)) / (Math.pow(1 + monthRate_commercial, time_commercial) - 1);
        dataItem_typeOne_commercial["monthInterest"] = "¥" + monthInterest_commercial[i].toFixed(2);

        //月供：贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        monthSum_commercial[i] = mortgage_commercial * monthRate_commercial * Math.pow((1 + monthRate_commercial), time_commercial) / (Math.pow(1 + monthRate_commercial, time_commercial) - 1);
        dataItem_typeOne_commercial["monthSum"] = "¥" + monthSum_commercial[i].toFixed(2);

        dataList_typeOne_commercial.push(dataItem_typeOne_commercial);
        i++;
      }
    }

    //1.2、公积金贷款部分
    //月供（元）
    monthPay_typeOne_HAF = mortgage_HAF * monthRate_HAF * Math.pow((1 + monthRate_HAF), time_HAF) / (Math.pow(1 + monthRate_HAF, time_HAF) - 1);
    //还款总额（万元）
    sum_typeOne_HAF = (monthPay_typeOne_HAF * time_HAF) / 10000;
    //还款利息总额（万元）
    interestPay_typeOne_HAF = (monthPay_typeOne_HAF * time_HAF - mortgage_HAF) / 10000;

    //保留两位小数
    monthPay_typeOne_HAF = monthPay_typeOne_HAF.toFixed(2);
    sum_typeOne_HAF = sum_typeOne_HAF.toFixed(2);
    interestPay_typeOne_HAF = interestPay_typeOne_HAF.toFixed(2);

    //每个月的还款详情
    var j = 1;
    //for (let i = 1; i <= time_HAF; i++) {
    while (j <= time_HAF) {
      dataItem_typeOne_HAF = {};

      if (month_typeOne_HAF == 12) {
        year_typeOne_HAF++;
        month_typeOne_HAF = 0;
        date_HAF[j] = year_typeOne_HAF + "年";
        dataItem_typeOne_HAF["date"] = date_HAF[j];
        dataItem_typeOne_HAF["monthCapital"] = "";
        dataItem_typeOne_HAF["monthInterest"] = "";
        dataItem_typeOne_HAF["monthSum"] = "";
        dataList_typeOne_HAF.push(dataItem_typeOne_HAF);
      } else {
        month_typeOne_HAF++;
        date_HAF[j] = month_typeOne_HAF + "月," + j + "期";
        dataItem_typeOne_HAF["date"] = date_HAF[j];

        //每月应还本金：贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        monthCapital_HAF[j] = mortgage_HAF * monthRate_HAF * Math.pow((1 + monthRate_HAF), j - 1) / (Math.pow(1 + monthRate_HAF, time_HAF) - 1);
        dataItem_typeOne_HAF["monthCapital"] = "¥" + monthCapital_HAF[j].toFixed(2);

        //每月应还利息：贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        monthInterest_HAF[j] = mortgage_HAF * monthRate_HAF * (Math.pow(1 + monthRate_HAF, time_HAF) - Math.pow(1 + monthRate_HAF, j - 1)) / (Math.pow(1 + monthRate_HAF, time_HAF) - 1);
        dataItem_typeOne_HAF["monthInterest"] = "¥" + monthInterest_HAF[j].toFixed(2);

        //月供：贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        monthSum_HAF[j] = mortgage_HAF * monthRate_HAF * Math.pow((1 + monthRate_HAF), time_HAF) / (Math.pow(1 + monthRate_HAF, time_HAF) - 1);
        dataItem_typeOne_HAF["monthSum"] = "¥" + monthSum_HAF[j].toFixed(2);

        dataList_typeOne_HAF.push(dataItem_typeOne_HAF);
        j++;
      }
    }

    //合并商业贷款和公积金贷款的每一期数据
    //商业贷款时间长的情况
    if (dataList_typeOne_commercial.length > dataList_typeOne_HAF.length) {
      for (let i = 0; i < dataList_typeOne_HAF.length; i++) {
        var dataItem_typeOne = {};
        dataItem_typeOne["date"] = dataList_typeOne_HAF[i].date;
        if (dataItem_typeOne["date"].indexOf("年") != -1) {
          dataItem_typeOne["monthCapital"] = "";
          dataItem_typeOne["monthInterest"] = "";
          dataItem_typeOne["monthSum"] = "";
        } else {
          dataItem_typeOne["monthCapital"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthCapital.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthCapital.substring(1))).toFixed(2);
          dataItem_typeOne["monthInterest"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthInterest.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthInterest.substring(1))).toFixed(2);
          dataItem_typeOne["monthSum"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthSum.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthSum.substring(1))).toFixed(2);
        }
        dataList_typeOne.push(dataItem_typeOne)
      }
      for (let j = dataList_typeOne_HAF.length; j < dataList_typeOne_commercial.length; j++) {
        dataList_typeOne[j] = dataList_typeOne_commercial[j];
      }
    }
    //公积金贷款时间长（或两者时间相等）的情况
    else {
      for (let i = 0; i < dataList_typeOne_commercial.length; i++) {
        var dataItem_typeOne = {};
        dataItem_typeOne["date"] = dataList_typeOne_commercial[i].date;
        if (dataItem_typeOne["date"].indexOf("年") != -1) {
          dataItem_typeOne["monthCapital"] = "";
          dataItem_typeOne["monthInterest"] = "";
          dataItem_typeOne["monthSum"] = "";
        } else {
          dataItem_typeOne["monthCapital"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthCapital.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthCapital.substring(1))).toFixed(2);
          dataItem_typeOne["monthInterest"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthInterest.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthInterest.substring(1))).toFixed(2);
          dataItem_typeOne["monthSum"] = "¥" + (parseFloat(dataList_typeOne_commercial[i].monthSum.substring(1)) + parseFloat(dataList_typeOne_HAF[i].monthSum.substring(1))).toFixed(2);
        }
        dataList_typeOne.push(dataItem_typeOne)
      }
      for (let j = dataList_typeOne_commercial.length; j < dataList_typeOne_HAF.length; j++) {
        dataList_typeOne[j] = dataList_typeOne_HAF[j];
      }
    }

    //2.等额本金计算方式
    var year_typeTwo_commercial = startYear;
    var month_typeTwo_commercial = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    var year_typeTwo_HAF = startYear;
    var month_typeTwo_HAF = startMonth - 1; //如果for循环i从2开始，这里就不需要减1了
    dataItem_typeTwo_commercial["date"] = startYear + "年";
    dataItem_typeTwo_commercial["monthCapital"] = "";
    dataItem_typeTwo_commercial["monthInterest"] = "";
    dataItem_typeTwo_commercial["monthSum"] = "";
    dataList_typeTwo_commercial.push(dataItem_typeTwo_commercial);
    dataItem_typeTwo_HAF["date"] = startYear + "年";
    dataItem_typeTwo_HAF["monthCapital"] = "";
    dataItem_typeTwo_HAF["monthInterest"] = "";
    dataItem_typeTwo_HAF["monthSum"] = "";
    dataList_typeTwo_HAF.push(dataItem_typeTwo_HAF);

    //2.1、商业贷款部分
    //还款总额（万元）
    sum_typeTwo_commercial = (time_commercial * (mortgage_commercial * monthRate_commercial - monthRate_commercial * (mortgage_commercial / time_commercial) * (time_commercial - 1) / 2 + mortgage_commercial / time_commercial)) / 10000;
    //还款利息总额（万元）
    interestPay_typeTwo_commercial = sum_typeTwo_commercial - total_commercial;

    //保留两位小数
    sum_typeTwo_commercial = sum_typeTwo_commercial.toFixed(2);
    interestPay_typeTwo_commercial = interestPay_typeTwo_commercial.toFixed(2);

    //每个月的还款详情
    let paid_commercial = 0;
    let delta_commercial = 0;
    var k = 1;
    while(k <= time_commercial) {
      dataItem_typeTwo_commercial = {};

      if (month_typeTwo_commercial == 12) {
        year_typeTwo_commercial++;
        month_typeTwo_commercial = 0;
        date_commercial[k] = year_typeTwo_commercial + "年";
        dataItem_typeTwo_commercial["date"] = date_commercial[k];
        dataItem_typeTwo_commercial["monthCaptial"] = "";
        dataItem_typeTwo_commercial["monthInterest"] = "";
        dataItem_typeTwo_commercial["monthSum"] = "";
        dataList_typeTwo_commercial.push(dataItem_typeTwo_commercial);
      } else {
        month_typeTwo_commercial++;
        date_commercial[k] = month_typeTwo_commercial + "月," + k + "期";
        dataItem_typeTwo_commercial["date"] = date_commercial[k];

        //每月应还本金：贷款本金÷还款月数
        monthCapital_commercial[k] = mortgage_commercial / time_commercial;
        dataItem_typeTwo_commercial["monthCapital"] = "¥" + monthCapital_commercial[k].toFixed(2);

        //每月应还利息：剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        monthInterest_commercial[k] = (mortgage_commercial - paid_commercial) * monthRate_commercial;
        dataItem_typeTwo_commercial["monthInterest"] = "¥" + monthInterest_commercial[k].toFixed(2);

        //月供：(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        monthSum_commercial[k] = (mortgage_commercial / time_commercial) + (mortgage_commercial - paid_commercial) * monthRate_commercial;
        dataItem_typeTwo_commercial["monthSum"] = "¥" + monthSum_commercial[k].toFixed(2);

        //已归还本金累计额
        paid_commercial = paid_commercial + mortgage_commercial / time_commercial;

        dataList_typeTwo_commercial.push(dataItem_typeTwo_commercial);
        k++;
      }
    }
    monthPay_typeTwo_commercial = monthSum_commercial[1].toFixed(2);
    delta_commercial = (monthSum_commercial[1] - monthSum_commercial[2]).toFixed(2);

    //2.2、公积金贷款部分
    //还款总额（万元）
    sum_typeTwo_HAF = (time_HAF * (mortgage_HAF * monthRate_HAF - monthRate_HAF * (mortgage_HAF / time_HAF) * (time_HAF - 1) / 2 + mortgage_HAF / time_HAF)) / 10000;
    //还款利息总额（万元）
    interestPay_typeTwo_HAF = sum_typeTwo_HAF - total_HAF;

    //保留两位小数
    sum_typeTwo_HAF = sum_typeTwo_HAF.toFixed(2);
    interestPay_typeTwo_HAF = interestPay_typeTwo_HAF.toFixed(2);

    //每个月的还款详情
    let paid_HAF = 0;
    let delta_HAF = 0;
    var t = 1;
    while (t <= time_HAF) {
      dataItem_typeTwo_HAF = {};

      if(month_typeTwo_HAF == 12) {
        year_typeTwo_HAF++;
        month_typeTwo_HAF = 0;
        date_HAF[t] = year_typeTwo_HAF + "年";
        dataItem_typeTwo_HAF["date"] = date_HAF[t];
        dataItem_typeTwo_HAF["monthCapital"] = "";
        dataItem_typeTwo_HAF["monthInterest"] = "";
        dataItem_typeTwo_HAF["monthSum"] = "";
        dataList_typeTwo_HAF.push(dataItem_typeTwo_HAF);
      } else {
        month_typeTwo_HAF++;
        date_HAF[t] = month_typeTwo_HAF + "月," + t + "期";
        dataItem_typeTwo_HAF["date"] = date_HAF[t];

        //每月应还本金：贷款本金÷还款月数
        monthCapital_HAF[t] = mortgage_HAF / time_HAF;
        dataItem_typeTwo_HAF["monthCapital"] = "¥" + monthCapital_HAF[t].toFixed(2);

        //每月应还利息：剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        monthInterest_HAF[t] = (mortgage_HAF - paid_HAF) * monthRate_HAF;
        dataItem_typeTwo_HAF["monthInterest"] = "¥" + monthInterest_HAF[t].toFixed(2);

        //月供：(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        monthSum_HAF[t] = (mortgage_HAF / time_HAF) + (mortgage_HAF - paid_HAF) * monthRate_HAF;
        dataItem_typeTwo_HAF["monthSum"] = "¥" + monthSum_HAF[t].toFixed(2);

        //已归还本金累计额
        paid_HAF = paid_HAF + mortgage_HAF / time_HAF;

        dataList_typeTwo_HAF.push(dataItem_typeTwo_HAF);
        t++;
      }
    }
    monthPay_typeTwo_HAF = monthSum_HAF[1].toFixed(2);
    delta_HAF = (monthSum_HAF[1] - monthSum_HAF[2]).toFixed(2);

    //合并商业贷款和公积金贷款的每一期数据
    //商业贷款时间长的情况
    if (dataList_typeTwo_commercial.length > dataList_typeTwo_HAF.length) {
      for (let i = 0; i < dataList_typeTwo_HAF.length; i++) {
        var dataItem_typeTwo = {};
        dataItem_typeTwo["date"] = dataList_typeTwo_HAF[i].date;
        if (dataItem_typeTwo["date"].indexOf("年") != -1) {
          dataItem_typeTwo["monthCapital"] = "";
          dataItem_typeTwo["monthInterest"] = "";
          dataItem_typeTwo["monthSum"] = "";
        } else {
          dataItem_typeTwo["monthCapital"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthCapital.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthCapital.substring(1))).toFixed(2);
          dataItem_typeTwo["monthInterest"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthInterest.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthInterest.substring(1))).toFixed(2);
          dataItem_typeTwo["monthSum"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthSum.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthSum.substring(1))).toFixed(2);
        }
        dataList_typeTwo.push(dataItem_typeTwo)
      }
      for (let j = dataList_typeTwo_HAF.length; j < dataList_typeTwo_commercial.length; j++) {
        dataList_typeTwo[j] = dataList_typeTwo_commercial[j];
      }
    }
    //公积金贷款时间长（或两者时间相等）的情况
    else {
      for (let i = 0; i < dataList_typeTwo_commercial.length; i++) {
        var dataItem_typeTwo = {};
        dataItem_typeTwo["date"] = dataList_typeTwo_commercial[i].date;
        if (dataItem_typeTwo["date"].indexOf("年") != -1) {
          dataItem_typeTwo["monthCapital"] = "";
          dataItem_typeTwo["monthInterest"] = "";
          dataItem_typeTwo["monthSum"] = "";
        } else {
          dataItem_typeTwo["monthCapital"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthCapital.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthCapital.substring(1))).toFixed(2);
          dataItem_typeTwo["monthInterest"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthInterest.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthInterest.substring(1))).toFixed(2);
          dataItem_typeTwo["monthSum"] = "¥" + (parseFloat(dataList_typeTwo_commercial[i].monthSum.substring(1)) + parseFloat(dataList_typeTwo_HAF[i].monthSum.substring(1))).toFixed(2);
        }
        dataList_typeTwo.push(dataItem_typeTwo)
      }
      for (let j = dataList_typeTwo_commercial.length; j < dataList_typeTwo_HAF.length; j++) {
        dataList_typeTwo[j] = dataList_typeTwo_HAF[j];
      }
    }

    sum_typeOne = (parseFloat(sum_typeOne_commercial) + parseFloat(sum_typeOne_HAF)).toFixed(2);
    interestPay_typeOne = (parseFloat(interestPay_typeOne_commercial) + parseFloat(interestPay_typeOne_HAF)).toFixed(2);
    sum_typeTwo = (parseFloat(sum_typeTwo_commercial) + parseFloat(sum_typeTwo_HAF)).toFixed(2);
    interestPay_typeTwo = (parseFloat(interestPay_typeTwo_commercial) + parseFloat(interestPay_typeTwo_HAF)).toFixed(2);

    total = parseFloat(total_commercial) + parseFloat(total_HAF);

    delta = (parseFloat(delta_commercial) + parseFloat(delta_HAF)).toFixed(2);

    that.setData({
      sum_typeOne: sum_typeOne,
      sum_typeTwo: sum_typeTwo,
      interestPay_typeOne: interestPay_typeOne,
      interestPay_typeTwo: interestPay_typeTwo,
      total: total,
      delta: delta,

      //等额本息、商业贷款
      monthPay_typeOne_commercial: monthPay_typeOne_commercial,
      sum_typeOne_commercial: sum_typeOne_commercial,
      interestPay_typeOne_commercial: interestPay_typeOne_commercial,

      //等额本息、公积金贷款
      monthPay_typeOne_HAF: monthPay_typeOne_HAF,
      sum_typeOne_HAF: sum_typeOne_HAF,
      interestPay_typeOne_HAF: interestPay_typeOne_HAF,

      //等额本金、商业贷款
      monthPay_typeTwo_commercial: monthPay_typeTwo_commercial,
      sum_typeTwo_commercial: sum_typeTwo_commercial,
      interestPay_typeTwo_commercial: interestPay_typeTwo_commercial,
      delta_commercial: delta_commercial,

      //等额本金、公积金贷款
      monthPay_typeTwo_HAF: monthPay_typeTwo_HAF,
      sum_typeTwo_HAF: sum_typeTwo_HAF,
      interestPay_typeTwo_HAF: interestPay_typeTwo_HAF,
      delta_HAF: delta_HAF,


      total_commercial: total_commercial,
      duration_commercial: duration_commercial,
      time_commercial: time_commercial,

      total_HAF: total_HAF,
      duration_HAF: duration_HAF,
      time_HAF: time_HAF,

      //dataList_typeOne: dataList_typeOne,
      //dataList_typeTwo: dataList_typeTwo,
    });
  },

  //跳转到月供详情页面
  showList: function() {
    var that = this;
    var currentTab = that.data.currentTab;

    if (currentTab == 0) {
      wx.navigateTo({
        url: '/pages/list_combination/list_combination?dataList_combination=' + JSON.stringify(that.data.dataList_typeOne) + '&dataList_commercial=' + JSON.stringify(that.data.dataList_typeOne_commercial) + '&dataList_HAF=' + JSON.stringify(that.data.dataList_typeOne_HAF)
      })
    } else {
      wx.navigateTo({
        url: '/pages/list_combination/list_combination?dataList_combination=' + JSON.stringify(that.data.dataList_typeTwo) + '&dataList_commercial=' + JSON.stringify(that.data.dataList_typeTwo_commercial) + '&dataList_HAF=' + JSON.stringify(that.data.dataList_typeTwo_HAF)
      })
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
})