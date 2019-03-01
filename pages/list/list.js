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
  },
})