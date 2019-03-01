// pages/list/list.js

Page({
  data: {
    dataList: [],
  },

  onLoad: function (options) {
    var that = this;
    var dataList = JSON.parse(options.dataList); 

    //更换标题栏
    wx.setNavigationBarTitle({
      title: '月供详情'
    })

    that.setData({
      dataList: dataList,
    });

    for (var i = 0; i < that.data.dataList.length; i++){
      console.log("本金：" + that.data.dataList[i].monthCapital);
      console.log("利息：" + that.data.dataList[i].monthInterest);
      console.log("月供：" + that.data.dataList[i].monthSum);
    }
  },

  formatData: function () {
    var startYear = 2019;
    var startMonth = 3;
    var year = startYear;
    var month = startMonth;
    var date = [];

    date[0] = startYear;
    date[1] = startMonth;

    for (var i = 2; i < 48; i++) {
      if (month == 12) {
        year++;
        month = 0;
        date[i] = year + "年";
      }
      else {
        month++;
        date[i] = month + "月";
      }
    }

    for (var i = 0; i < date.length; i++) {
      console.log(date[i]);
    }
  },
})