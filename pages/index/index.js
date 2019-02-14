//index.js
//获取应用实例
const app = getApp()
var duration = [];


Page({
  data: {
    currentTab: 0,
    mortgage_options: ["等额本息", "等额本金"],
    mortgage_duration: [],
    index: 0,
    value: [3],
  },

  onLoad: function (options) {
    for (var i = 0; i < 20; i++){
      duration[i] = (i + 1) + "年(" + (i + 1) * 12 + "期)";
    }
    duration[20] = "25年(300期)";
    duration[21] = "30年(360期)";
    this.setData({
      mortgage_duration:duration
    });
  },

  bindPickerChange(e) {
    const val = e.detail.value
    this.setData({
      index: val
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
