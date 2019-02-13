//index.js
//获取应用实例
const app = getApp()

const years = ["等额本金", "等额本息", "其它"]


Page({
  data: {
    currentTab: 0,
    years,
    year: "贷款",
    value: [3],
  },

  onLoad: function (options) {
    
  },

  bindChange(e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
    })
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
  }
})
