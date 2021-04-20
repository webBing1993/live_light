// pages/select/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    objectArray: [
      {
        id: 0,
        name: 'qa环境'
      },
      {
        id: 1,
        name: '生产环境v2.8.5'
      },
      {
        id: 2,
        name: '黄花岸环境'
      }
    ],
    sureLoading: false
  },

  // 选择
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  // 确定
  sureBtn (e) {
    let id = this.data.objectArray[this.data.index].id;
    let url = '';
    if (id == 0) {
      url = 'https://wqt.fortrun.cn/q/master/qyz-api'     // qa
    }else if (id == 1) {
      url = 'https://wqt.fortrun.cn/p/v2.8.5/qyz-api'     // 生产285
    }else {
      url = 'https://hha.jsyby.com:8443/qyz-api'    // 黄花岸
    }
    getApp().globalData.urlOld = url;
    wx.navigateTo({
      url: '../index/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})