// pages/list/list.js

Page({
  data: {
    dataList: [],
    scroll_height: 0,
  },

  onLoad: function(options) {
    //更换标题栏
    wx.setNavigationBarTitle({
      title: '月供详情'
    })

    var that = this;
    var windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    var windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    var option = options.option;
    var dataList_typeOne = JSON.parse(options.dataList_typeOne);
    var dataList_typeTwo = JSON.parse(options.dataList_typeTwo);

    if (option == "等额本息") {
      that.setData({
        dataList: dataList_typeOne,
        scroll_height: windowHeight * 750 / windowWidth - 100,
      });
    } else {
      that.setData({
        dataList: dataList_typeTwo,
        scroll_height: windowHeight * 750 / windowWidth - 100,
      });
    }
  },
})